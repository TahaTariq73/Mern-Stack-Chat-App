const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utilities/errorHandler");
const Message = require("../modals/MessageModal");
const Chat = require("../modals/ChatModal");
const User = require("../modals/UserModal");

exports.getAllMessages = catchAsyncError (
    async (req, res, next) => {
        if (!req.params.chatId) {
            return next(new ErrorHandler("Please provide chatId to access messages", 400));
        }

        const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "-password")
        .populate("chat");

        let opponentUser;
        if (messages.length === 0) {
            opponentUser = null;
        } else {
            const chatUsers = messages[0].chat.users; 

            if (messages[0].chat.isGroupChat === true) {
                opponentUser = await User.find({ _id: { $ne: req.user._id } });
            } else {
                const userId = String(chatUsers[0]) !== String(req.user._id) ? chatUsers[0] : chatUsers[1];            
                opponentUser = await User.findById(String(userId));
            }
        }

        res.json({
            success: true,
            messages,
            opponentUser
        })
    }
)

exports.sendMessage = catchAsyncError (
    async (req, res, next) => {
        const { content, chatId } = req.body;

        if (!content || !chatId) {
            return next(new ErrorHandler("Please provide chatId & content", 400));
        }

        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId
        }

        let message = await Message.create(newMessage);
        
        message = await message.populate("sender", "-password");
        message = await message.populate("chat");

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.json({
            success: true,
            message
        })
    }
)