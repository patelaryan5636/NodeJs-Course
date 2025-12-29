// chat-server.js — Real-Time Chat Application (Single File)

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3001;

// Serve simple homepage
app.get("/", (req, res) => {
  res.send(`
    <h2>Realtime Chat Server Running</h2>
    <p>Connect using Socket.IO client</p>
  `);
});

// Store users
let users = {}; // socketId -> username

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins chat
  socket.on("join", (username) => {
    users[socket.id] = username;

    socket.broadcast.emit("system", {
      message: `${username} joined the chat`
    });
  });

  // Receive message
  socket.on("message", (data) => {
    io.emit("message", {
      user: users[socket.id],
      text: data,
      time: new Date().toLocaleTimeString()
    });
  });

  // User disconnects
  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      socket.broadcast.emit("system", {
        message: `${username} left the chat`
      });
      delete users[socket.id];
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`💬 Chat Server running at http://localhost:${PORT}`);
});
