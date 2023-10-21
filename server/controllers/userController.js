const User = require("../modals/UserModal");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utilities/errorHandler");
const sendToken = require("../utilities/jwtToken");

exports.registerUser = catchAsyncError (
    async (req, res, next) => {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return next(new ErrorHandler("Please enter all credentials", 400));
        }

        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return next(new ErrorHandler("User already exists", 400));
        }

        const user = await User.create({
            name,
            email,
            password
        })
        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        sendToken(user, 200, res);
    }
)

exports.login = catchAsyncError (
    async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please enter all credentials", 400));
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }


        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        sendToken(user, 200, res);
    }
)

exports.getAllUsers = catchAsyncError (
    async (req, res, next) => {
        const keyword = req.query.keyword ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { email: { $regex: req.query.keyword, $options: "i" } },
            ]
        } : {}

        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

        res.json({
            success: true,
            users
        })
    }
)

exports.getSingleUserByKeyword = catchAsyncError (
    async (req, res, next) => {
        const keyword = req.query.keyword ? {
            $or: [
                { name: req.query.keyword },
                { email: req.query.keyword },
            ]
        } : {}

        const user = await User.find({ _id: { $ne: req.user._id } }).findOne(keyword);

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        res.json({
            success: true,
            user
        })
    }
)

exports.getMyProfile = catchAsyncError (
    async (req, res, next) => {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            user
        })
    }
)