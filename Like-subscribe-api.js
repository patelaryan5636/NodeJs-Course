// like-subscribe-api.js — Like & Subscribe Feature (Live API Style)

const express = require("express");
const app = express();
const PORT = 9000;

app.use(express.json());

// ---------------- In-Memory DB ----------------
let users = [];
let channels = [];
let likes = [];        // { userId, postId }
let subscriptions = []; // { userId, channelId }

// ---------------- Helpers ----------------
function getUser(id) {
  return users.find(u => u.id == id);
}

function getChannel(id) {
  return channels.find(c => c.id == id);
}

// ---------------- Seed Data ----------------
users.push({ id: 1, name: "Doha" });
users.push({ id: 2, name: "Alex" });

channels.push({ id: 1, name: "Tech World" });
channels.push({ id: 2, name: "Code Daily" });

// ---------------- LIKE API ----------------

// Like a post
app.post("/api/v1/posts/:postId/like", (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  if (!userId)
    return res.status(400).json({ message: "userId required" });

  const alreadyLiked = likes.find(
    l => l.userId == userId && l.postId == postId
  );

  if (alreadyLiked)
    return res.status(409).json({ message: "Already liked" });

  likes.push({ userId, postId });

  res.json({
    success: true,
    message: "Post liked",
    totalLikes: likes.filter(l => l.postId == postId).length
  });
});

// Unlike a post
app.delete("/api/v1/posts/:postId/unlike", (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  const index = likes.findIndex(
    l => l.userId == userId && l.postId == postId
  );

  if (index === -1)
    return res.status(404).json({ message: "Like not found" });

  likes.splice(index, 1);

  res.json({
    success: true,
    message: "Post unliked",
    totalLikes: likes.filter(l => l.postId == postId).length
  });
});

// Get likes count
app.get("/api/v1/posts/:postId/likes", (req, res) => {
  const { postId } = req.params;

  res.json({
    postId,
    totalLikes: likes.filter(l => l.postId == postId).length
  });
});

// ---------------- SUBSCRIBE API ----------------

// Subscribe to channel
app.post("/api/v1/channels/:channelId/subscribe", (req, res) => {
  const { userId } = req.body;
  const { channelId } = req.params;

  if (!userId)
    return res.status(400).json({ message: "userId required" });

  const exists = subscriptions.find(
    s => s.userId == userId && s.channelId == channelId
  );

  if (exists)
    return res.status(409).json({ message: "Already subscribed" });

  subscriptions.push({ userId, channelId });

  res.json({
    success: true,
    message: "Subscribed successfully",
    totalSubscribers: subscriptions.filter(s => s.channelId == channelId).length
  });
});

// Unsubscribe
app.delete("/api/v1/channels/:channelId/unsubscribe", (req, res) => {
  const { userId } = req.body;
  const { channelId } = req.params;

  const index = subscriptions.findIndex(
    s => s.userId == userId && s.channelId == channelId
  );

  if (index === -1)
    return res.status(404).json({ message: "Subscription not found" });

  subscriptions.splice(index, 1);

  res.json({
    success: true,
    message: "Unsubscribed",
    totalSubscribers: subscriptions.filter(s => s.channelId == channelId).length
  });
});

// Get channel subscribers
app.get("/api/v1/channels/:channelId/subscribers", (req, res) => {
  const { channelId } = req.params;

  res.json({
    channelId,
    totalSubscribers: subscriptions.filter(s => s.channelId == channelId).length
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`👍 Like & Subscribe API running at http://localhost:${PORT}`);
});
