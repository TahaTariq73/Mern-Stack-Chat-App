const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utilities/errorHandler");
const Chat = require("../modals/ChatModal");
const User = require("../modals/UserModal");

exports.accessChat = catchAsyncError (
    async (req, res, next) => {
        const { userId } = req.body;

        if (!userId) {
            return next(new ErrorHandler("Please send userId in params", 400));
        }

        const receiver = await User.findById(userId);
        if (!receiver) {
            return next(new ErrorHandler("User not found", 400));
        }

        const isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        })
        .populate("users", "-password")
        .populate("latestMessage");

        if (isChat.length > 0) {
            res.status(200).json({
                success: true,
                chat: isChat[0]
            })
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            }

            try {       
                const createdChat = await Chat.create(chatData);
                const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                    "users",
                    "-password"
                )    

                res.status(200).json({
                    success: true,
                    chat: fullChat
                })
            } catch (error) {
                return next(new ErrorHandler("Internal Server Error", 500));
            }
        }
    }
)

exports.fetchAllChats = catchAsyncError (
    async (req, res, next) => {
        const chats = await Chat.find({ 
            users: { $elemMatch: { $eq: req.user._id } } 
        })
        .populate("latestMessage")
        .populate("groupAdmin", "-password")
        .populate("users", "-password");

        res.status(200).json({
            success: true,
            chats
        })
    }
)

exports.createGroupChat = catchAsyncError (
    async (req, res, next) => {
        if (!req.body.users || !req.body.chatName) {
            return next(new ErrorHandler("Please fill all credentials", 400));
        }

        const users = req.body.users;
        if (users.length < 2) {
            return next(new ErrorHandler("More than 2 users are required", 400));
        }
        users.push(req.user);

        const groupChat = await Chat.create({
            chatName: req.body.chatName,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })
      
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      
        res.status(200).json({
            success: true,
            fullGroupChat
        })
    }
)