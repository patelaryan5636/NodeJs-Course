// server.js — Simple Login Backend (Node.js + Express + JWT + bcrypt)

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 4000;
const JWT_SECRET = "super_secret_key_change_later";

// Middleware
app.use(express.json());

// In-memory DB
let users = [];

// Generate JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// Auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing token" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// --- Routes ---

// Register User
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashed
  };

  users.push(newUser);

  res.status(201).json({ message: "User registered" });
});

// Login User
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken(user);

  res.json({
    message: "Login successful",
    token
  });
});

// Protected User Info
app.get("/me", auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({
    id: user.id,
    name: user.name,
    email: user.email
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Login backend running on http://localhost:${PORT}`);
});
