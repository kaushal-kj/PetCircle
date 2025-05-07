const express = require("express");
const router = express.Router();
const messageController = require("../controllers/MessageController");

router.post("/message/send/:id", messageController.sendMessage);
router.get("/message/all/:id", messageController.getMessage);
router.put("/mark-seen/:receiverId", messageController.markMessagesAsSeen);

module.exports = router;
