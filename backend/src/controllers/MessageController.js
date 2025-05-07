const ConversationModel = require("../models/ConversationModel");
const MessageModel = require("../models/MessageModel");
const { getReceiverSocketId, io } = require("../socket/Socket");

const sendMessage = async (req, res) => {
  try {
    const { senderId, message } = req.body;
    const receiverId = req.params.id;

    let conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    //establish connection if not started
    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);

    //implement socket io for realtime data transfer
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ message: "message sent", data: newMessage });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getMessage = async (req, res) => {
  try {
    const senderId = req.query.senderId;
    const receiverId = req.params.id;

    const conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");
    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    res
      .status(200)
      .json({ message: "message received", data: conversation?.messages });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Mark messages as seen
const markMessagesAsSeen = async (req, res) => {
  try {
    const { receiverId } = req.params; // the one whose messages we are marking as seen
    const { senderId } = req.body; // the one who opened the chat

    const updated = await MessageModel.updateMany(
      {
        senderId: receiverId,
        receiverId: senderId,
        seen: false,
      },
      { $set: { seen: true } }
    );

    // Notify sender via socket that their messages were seen
    const senderSocketId = getReceiverSocketId(receiverId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", {
        by: senderId,
      });
    }

    return res.status(200).json({
      message: "Messages marked as seen",
      updatedCount: updated.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    return res.status(500).json({ error: "Failed to mark messages as seen" });
  }
};

module.exports = { sendMessage, getMessage, markMessagesAsSeen };
