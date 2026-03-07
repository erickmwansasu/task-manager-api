const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    dueDate: {
        type: Date,
        required: true
    },

    department: {
        type: String,
        enum: ['IT', 'HR'],
        required: true
    },

    userName: {
        type: String,
        default: null
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    completed: {
        type: Boolean,
        default: false
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
}, { timestamps: true })

const Task = mongoose.model('Task', taskSchema)

module.exports = Task