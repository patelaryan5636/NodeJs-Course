// newsletter-api.js — Real World Newsletter Subscription API

const express = require("express");
const app = express();
const PORT = 9500;

app.use(express.json());

// ---------------- In-Memory Database ----------------
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

// ---------------- Helpers ----------------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------- API ROUTES ----------------

// Health Check
app.get("/", (req, res) => {
  res.json({
    service: "Newsletter API",
    status: "LIVE",
    time: new Date()
  });
});

// SUBSCRIBE
app.post("/api/v1/newsletter/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email is required" });

  if (!isValidEmail(email))
    return res.status(400).json({ message: "Invalid email format" });

  const exists = subscribers.find(s => s.email === email);

  if (exists && exists.status === "subscribed") {
    return res.status(409).json({ message: "Already subscribed" });
  }

  if (exists && exists.status === "unsubscribed") {
    exists.status = "subscribed";
    exists.subscribedAt = new Date();

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

// UNSUBSCRIBE
app.post("/api/v1/newsletter/unsubscribe", (req, res) => {
  const { email } = req.body;

  const subscriber = subscribers.find(s => s.email === email);
  if (!subscriber)
    return res.status(404).json({ message: "Email not found" });

  subscriber.status = "unsubscribed";

  res.json({
    success: true,
    message: "Unsubscribed successfully"
  });
});

// GET ALL SUBSCRIBERS (ADMIN)
app.get("/api/v1/newsletter/subscribers", (req, res) => {
  res.json({
    total: subscribers.length,
    data: subscribers
  });
});

// GET SUBSCRIBED COUNT
app.get("/api/v1/newsletter/stats", (req, res) => {
  res.json({
    totalSubscribed: subscribers.filter(s => s.status === "subscribed").length,
    totalUnsubscribed: subscribers.filter(s => s.status === "unsubscribed").length
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`📰 Newsletter API running at http://localhost:${PORT}`);
});
