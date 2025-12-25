// realtime-server.js — Real-Time Backend using Node.js + Socket.IO

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = 10000;

// In-memory users
let onlineUsers = [];

// ---------- SOCKET CONNECTION ----------
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // User joins
  socket.on("join", (username) => {
    onlineUsers.push({ id: socket.id, username });
    io.emit("users", onlineUsers);
    io.emit("message", {
      user: "System",
      text: `${username} joined the chat`
    });
  });

  // Receive message
  socket.on("sendMessage", (data) => {
    io.emit("message", {
      user: data.user,
      text: data.text,
      time: new Date().toLocaleTimeString()
    });
  });

  // User disconnects
  socket.on("disconnect", () => {
    const user = onlineUsers.find(u => u.id === socket.id);
    onlineUsers = onlineUsers.filter(u => u.id !== socket.id);

    if (user) {
      io.emit("message", {
        user: "System",
        text: `${user.username} left the chat`
      });
      io.emit("users", onlineUsers);
    }

    console.log("🔴 User disconnected:", socket.id);
  });
});

// ---------- API ----------
app.get("/", (req, res) => {
  res.json({
    status: "Real-time server is live 🚀",
    onlineUsers: onlineUsers.length
  });
});

// ---------- START SERVER ----------
server.listen(PORT, () => {
  console.log(`🚀 Real-time server running on http://localhost:${PORT}`);
});
