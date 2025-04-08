const ConversationModel = require("../models/ConversationModel");
const MessageModel = require("../models/MessageModel");

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

    res.status(201).json({ message: "message sent", data: newMessage });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getMessage = async (req, res) => {
  try {
    const { senderId } = req.body;
    const { receiverId } = req.params.id;

    const conversation = await ConversationModel.find({
      participants: { $all: [senderId, receiverId] },
    });
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

module.exports = { sendMessage, getMessage };
