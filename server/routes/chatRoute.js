const express = require("express");
const {
    accessChat,
    fetchAllChats,
    createGroupChat
} = require("../controllers/chatController");
const isAuthenticatedUser = require("../middlewares/auth");

const router = express.Router();

router.route("/accesschat").post(isAuthenticatedUser, accessChat);

router.route("/allchats").get(isAuthenticatedUser, fetchAllChats);

router.route("/creategroupchat").post(isAuthenticatedUser, createGroupChat);

module.exports = router;