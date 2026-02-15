const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    owners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ],
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low",
    },
    dueDate: {
        type: Date,
        required: true,
    },
    timeToComplete: {
        type: Number,
        required: true,
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low",
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Completed", "Blocked"],
        default: "To Do",
    }
}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema)
module.exports = Task