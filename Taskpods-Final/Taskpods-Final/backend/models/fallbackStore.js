import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../db_local.json');

// Helper to generate UUID-like IDs
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Load data from file
const loadData = () => {
    try {
        if (fs.existsSync(DB_FILE)) {
            const content = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(content || '{"users":[],"tasks":[]}');
        }
    } catch (e) {
        console.error('Error loading fallback DB:', e);
    }
    return { users: [], tasks: [] };
};

// Save data to file
const saveData = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving fallback DB:', e);
    }
};

// Wrap document with a .save() method so it behaves like a Mongoose document
const wrapWithSave = (item, collectionName) => {
    if (!item) return item;
    const doc = { ...item };
    
    // Mimic Mongoose's virtual `id` getter (alias for `_id`)
    Object.defineProperty(doc, 'id', {
        get() { return this._id; },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(doc, 'save', {
        value: async function() {
            const db = loadData();
            const collection = db[collectionName] || [];
            
            const dataToSave = { ...this };
            
            const index = collection.findIndex(x => String(x._id) === String(this._id));
            if (index > -1) {
                collection[index] = dataToSave;
            } else {
                collection.push(dataToSave);
            }
            
            db[collectionName] = collection;
            saveData(db);
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true
    });
    
    return doc;
};

// Mock Query Chain (for methods like sort, select)
class QueryChain {
    constructor(data, collectionName) {
        this.data = data;
        this.collectionName = collectionName;
    }
    select(fieldsString) {
        if (!this.data) return this;
        const fields = fieldsString.split(' ');
        const isExclude = fields[0].startsWith('-');
        const cleanFields = fields.map(f => f.replace('-', ''));

        const project = (item) => {
            const newItem = { ...item };
            if (isExclude) {
                cleanFields.forEach(f => delete newItem[f]);
            } else {
                Object.keys(newItem).forEach(k => {
                    if (!cleanFields.includes(k) && k !== '_id' && k !== 'id') {
                        delete newItem[k];
                    }
                });
            }
            return newItem;
        };

        if (Array.isArray(this.data)) {
            return this.data.map(item => wrapWithSave(project(item), this.collectionName));
        }
        return wrapWithSave(project(this.data), this.collectionName);
    }
    sort(sortObj) {
        if (!Array.isArray(this.data)) return this;
        const key = Object.keys(sortObj)[0];
        const direction = sortObj[key];
        const sorted = [...this.data];
        sorted.sort((a, b) => {
            const valA = a[key];
            const valB = b[key];
            if (valA < valB) return direction === -1 ? 1 : -1;
            if (valA > valB) return direction === -1 ? -1 : 1;
            return 0;
        });
        this.data = sorted;
        return this;
    }
    // So it can be awaited or directly used
    then(onfulfilled) {
        const resolvedData = Array.isArray(this.data)
            ? this.data.map(item => wrapWithSave(item, this.collectionName))
            : wrapWithSave(this.data, this.collectionName);
        return Promise.resolve(resolvedData).then(onfulfilled);
    }
}

class FallbackModel {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    _getCollection() {
        const db = loadData();
        return db[this.collectionName] || [];
    }

    _saveCollection(collection) {
        const db = loadData();
        db[this.collectionName] = collection;
        saveData(db);
    }

    _matches(item, query) {
        for (const key in query) {
            const queryVal = query[key];
            
            if (queryVal && typeof queryVal === 'object' && '$ne' in queryVal) {
                if (String(item[key]) === String(queryVal.$ne)) {
                    return false;
                }
                continue;
            }

            if (key === '_id' || key === 'owner') {
                if (String(item[key]) !== String(queryVal)) {
                    return false;
                }
            } else if (item[key] !== queryVal) {
                return false;
            }
        }
        return true;
    }

    find(query = {}) {
        const items = this._getCollection().filter(item => this._matches(item, query));
        return new QueryChain(items, this.collectionName);
    }

    findOne(query = {}) {
        const items = this._getCollection();
        const found = items.find(item => this._matches(item, query));
        return new QueryChain(found, this.collectionName);
    }

    findById(id) {
        return this.findOne({ _id: id });
    }

    async create(doc) {
        const collection = this._getCollection();
        const newDoc = {
            _id: generateId(),
            createdAt: new Date().toISOString(),
            ...doc
        };
        collection.push(newDoc);
        this._saveCollection(collection);
        return wrapWithSave(newDoc, this.collectionName);
    }

    async findByIdAndUpdate(id, update, options = {}) {
        const collection = this._getCollection();
        const index = collection.findIndex(item => String(item._id) === String(id));
        if (index === -1) return null;

        const updatedItem = { ...collection[index], ...update };
        collection[index] = updatedItem;
        this._saveCollection(collection);

        const wrapped = wrapWithSave(updatedItem, this.collectionName);
        if (options.select) {
            return new QueryChain(wrapped, this.collectionName).select(options.select);
        }
        return wrapped;
    }

    async findOneAndUpdate(query, update, options = {}) {
        const collection = this._getCollection();
        const index = collection.findIndex(item => this._matches(item, query));
        if (index === -1) return null;

        const updatedItem = { ...collection[index], ...update };
        collection[index] = updatedItem;
        this._saveCollection(collection);

        return wrapWithSave(updatedItem, this.collectionName);
    }

    async findOneAndDelete(query) {
        const collection = this._getCollection();
        const index = collection.findIndex(item => this._matches(item, query));
        if (index === -1) return null;

        const deleted = collection.splice(index, 1)[0];
        this._saveCollection(collection);
        return wrapWithSave(deleted, this.collectionName);
    }
}

// Instance fallback classes
export const FallbackUser = new FallbackModel('users');
export const FallbackTask = new FallbackModel('tasks');

// Class constructor for Task instances (so `new Task({...}).save()` works)
export class FallbackTaskInstance {
    constructor(data) {
        Object.assign(this, data);
    }

    async save() {
        const db = loadData();
        if (!this._id) {
            this._id = generateId();
            this.createdAt = new Date().toISOString();
        }
        
        const dataToSave = { ...this };
        delete dataToSave.save;

        const index = db.tasks.findIndex(t => String(t._id) === String(this._id));
        if (index > -1) {
            db.tasks[index] = dataToSave;
        } else {
            db.tasks.push(dataToSave);
        }
        saveData(db);
        return wrapWithSave(this, 'tasks');
    }
}
