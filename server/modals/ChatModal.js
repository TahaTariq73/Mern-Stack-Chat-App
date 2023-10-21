const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name can't exceed 30 characters"],
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please invite a user first"]
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

module.exports = mongoose.model("Chat", chatSchema);