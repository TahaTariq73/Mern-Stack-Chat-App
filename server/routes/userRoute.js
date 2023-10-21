const express = require("express");
const {
    registerUser,
    login,
    getAllUsers,
    getMyProfile,
    getSingleUserByKeyword,
    getSingleUser
} = require("../controllers/userController");
const isAuthenticatedUser = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(login);

router.route("/users").get(isAuthenticatedUser, getAllUsers);

router.route("/me").get(isAuthenticatedUser, getMyProfile);

router.route("/user").get(isAuthenticatedUser, getSingleUserByKeyword);

module.exports = router;