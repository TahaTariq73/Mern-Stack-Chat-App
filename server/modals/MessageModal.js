const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    content: {
        type: String, 
        trim: true,
        maxLength: [10000, "Name can't exceed 10,000 characters"] 
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Chat"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

module.exports = mongoose.model("Message", messageSchema);