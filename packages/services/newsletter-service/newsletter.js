// newsletter-api.js — Real-world Newsletter Subscription API

const express = require("express");
const app = express();
const PORT = 10000;

app.use(express.json());

// ================= DATABASE (IN-MEMORY) =================
let subscribers = [];
let idCounter = 1;

/*
Subscriber Model
{
  id: Number,
  email: String,
  status: "subscribed" | "unsubscribed",
  subscribedAt: Date
}
*/

// ================= SUBSCRIBE =================
app.post("/api/v1/newsletter/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({
      success: false,
      message: "Email is required"
    });

  const existing = subscribers.find(s => s.email === email);

  if (existing && existing.status === "subscribed") {
    return res.status(409).json({
      success: false,
      message: "Already subscribed"
    });
  }

  if (existing && existing.status === "unsubscribed") {
    existing.status = "subscribed";
    existing.subscribedAt = new Date();

    return res.json({
      success: true,
      message: "Subscription re-activated"
    });
  }

  subscribers.push({
    id: idCounter++,
    email,
    status: "subscribed",
    subscribedAt: new Date()
  });

  res.status(201).json({
    success: true,
    message: "Subscribed successfully"
  });
});

// ================= UNSUBSCRIBE =================
app.post("/api/v1/newsletter/unsubscribe", (req, res) => {
  const { email } = req.body;

  const subscriber = subscribers.find(s => s.email === email);

  if (!subscriber)
    return res.status(404).json({
      success: false,
      message: "Email not found"
    });

  subscriber.status = "unsubscribed";

  res.json({
    success: true,
    message: "Unsubscribed successfully"
  });
});

// ================= GET ALL SUBSCRIBERS (ADMIN) =================
app.get("/api/v1/newsletter/subscribers", (req, res) => {
  res.json({
    success: true,
    total: subscribers.length,
    data: subscribers
  });
});

// ================= STATS =================
app.get("/api/v1/newsletter/stats", (req, res) => {
  res.json({
    total: subscribers.length,
    subscribed: subscribers.filter(s => s.status === "subscribed").length,
    unsubscribed: subscribers.filter(s => s.status === "unsubscribed").length
  });
});

// ================= HEALTH =================
app.get("/", (req, res) => {
  res.json({
    status: "Newsletter API Live",
    time: new Date()
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`📩 Newsletter API running at http://localhost:${PORT}`);
});
