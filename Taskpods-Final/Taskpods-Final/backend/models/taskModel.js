import mongoose from 'mongoose';
import { FallbackTask, FallbackTaskInstance } from './fallbackStore.js';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    dueDate: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const TaskInstance = mongoose.models.Task || mongoose.model('Task', taskSchema);

const PUBLIC_METHODS = new Set(['find', 'findOne', 'findById', 'create', 'findByIdAndUpdate', 'findOneAndUpdate', 'findOneAndDelete']);

const taskProxy = new Proxy(TaskInstance, {
    construct(target, args, newTarget) {
        if (mongoose.connection.readyState === 1) {
            return Reflect.construct(target, args, newTarget);
        }
        console.log(`[Fallback DB] new Task()`);
        return new FallbackTaskInstance(args[0]);
    },
    get(target, prop, receiver) {
        if (mongoose.connection.readyState === 1) {
            return Reflect.get(target, prop, receiver);
        }
        if (PUBLIC_METHODS.has(prop)) {
            console.log(`[Fallback DB] Task.${prop}`);
        }
        return Reflect.get(FallbackTask, prop);
    }
});

export default taskProxy;