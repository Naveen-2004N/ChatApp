import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const userSocketMap = {}; // userId → socketId

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.fullName);

  const userId = socket.user._id; // ✅ FIXED

  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ TYPING
  socket.on("typing", ({ receiverId }) => {
    const receiverSocket = userSocketMap[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", {
        senderId: userId,
      });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocket = userSocketMap[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("stopTyping", {
        senderId: userId,
      });
    }
  });

  // ✅ DISCONNECT → LAST SEEN
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.fullName);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    io.emit("lastSeen", {
      userId,
      time: new Date(),
    });
  });
});

export { io, app, server };