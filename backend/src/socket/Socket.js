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

const userSocketMap = {}; //this map store socketid    userid -> socketid

const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    // Update user as online
    await UserModel.findByIdAndUpdate(userId, {
      isOnline: true,
    });

    // Notify all users about status change
    io.emit("userStatusChanged", {
      userId,
      isOnline: true,
    });
    // console.log(`user connected: userId = ${userId}, socketId = ${socket.id}`);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      // console.log(
      //   `user connected: userId = ${userId}, socketId = ${socket.id}`
      // );
      delete userSocketMap[userId];
      const mongoose = require("mongoose");
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
