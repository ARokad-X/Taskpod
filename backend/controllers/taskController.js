import { prisma } from "../config/db.js";

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body;
        const task = await prisma.task.create({
            data: {
                title,
                description: description || "",
                priority: priority || "Low",
                dueDate: dueDate ? new Date(dueDate) : null,
                completed: completed === 'Yes' || completed === true,
                ownerId: req.user.id
            }
        });
        res.status(201).json({ success: true, task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all tasks for logged-in user
export const getTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { ownerId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get single task by ID (must belong to user)
export const getTaskById = async (req, res) => {
    try {
        const task = await prisma.task.findFirst({
            where: { id: req.params.id, ownerId: req.user.id }
        });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.completed !== undefined) {
            data.completed = data.completed === 'Yes' || data.completed === true;
        }
        if (data.dueDate) {
            data.dueDate = new Date(data.dueDate);
        }
        
        // Ensure task exists and belongs to user before updating
        const task = await prisma.task.findFirst({
            where: { id: req.params.id, ownerId: req.user.id }
        });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found or not yours' });

        const updated = await prisma.task.update({
            where: { id: req.params.id },
            data
        });
        res.json({ success: true, task: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        // Ensure task exists and belongs to user before deleting
        const task = await prisma.task.findFirst({
            where: { id: req.params.id, ownerId: req.user.id }
        });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found or not yours' });

        await prisma.task.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true, message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
