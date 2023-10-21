const express = require("express");
const {
    getAllMessages,
    sendMessage
} = require("../controllers/messageController");
const isAuthenticatedUser = require("../middlewares/auth");

const router = express.Router();

router.route("/messages/:chatId").get(isAuthenticatedUser, getAllMessages);

router.route("/message").post(isAuthenticatedUser, sendMessage);

module.exports = router;