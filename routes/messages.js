const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messagesController");

router.get("/user/:userId", messagesController.getMessagesByUser);

router.get("/:conversationId", messagesController.getMessagesByConversation);

router.post("/", messagesController.sendMessageHTTP);

router.post("/start-conversation", messagesController.startConversation);


module.exports = router;
