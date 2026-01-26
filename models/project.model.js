const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["In Progress", "Completed"],
        default: "In Progress"
    }
}, { timestamps: true })

const Project = mongoose.model("Project", projectSchema)
module.exports = Project