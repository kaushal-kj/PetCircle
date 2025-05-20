const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // this map stores socketid    userId -> socketid

const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    userSocketMap[userId] = socket.id;

    try {
      // Update user as online
      await UserModel.findByIdAndUpdate(userId, {
        isOnline: true,
      });

      // Notify all users about status change
      io.emit("userStatusChanged", {
        userId,
        isOnline: true,
      });
    } catch (error) {
      console.error("Error setting user online:", error.message);
    }
  }
  // else {
  //   console.warn("Invalid or missing userId:", userId);
  // }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      delete userSocketMap[userId];

      try {
        const lastSeenTime = new Date();

        await UserModel.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: lastSeenTime,
        });

        // Notify all users about offline status
        io.emit("userStatusChanged", {
          userId,
          isOnline: false,
          lastSeen: lastSeenTime,
        });
      } catch (error) {
        console.error("Error setting user offline:", error.message);
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = {
  app,
  server,
  io,
  getReceiverSocketId,
};
