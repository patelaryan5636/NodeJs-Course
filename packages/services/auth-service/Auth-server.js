// auth-server.js — Advanced Login Backend (JWT + Refresh Token + Roles)

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const PORT = 5000;

const ACCESS_SECRET = "ACCESS_SECRET_KEY_CHANGE";
const REFRESH_SECRET = "REFRESH_SECRET_KEY_CHANGE";

// In-memory database
let users = [];
let refreshTokens = [];        // stores valid refresh tokens
let tokenBlacklist = [];       // stores invalidated access tokens

// Generate Tokens
function createAccessToken(user) {
  return jwt.sign({
    id: user.id,
    role: user.role
  }, ACCESS_SECRET, { expiresIn: "10m" });  // Short expiry
}

function createRefreshToken(user) {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "30d" });
}

// Middleware to verify access token
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing token" });

  const token = header.split(" ")[1];

  if (tokenBlacklist.includes(token))
    return res.status(401).json({ message: "Token expired or blacklisted" });

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Role middleware
function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
}

// Register route
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  if (users.find(u => u.email === email))
    return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 12);

  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashed,
    role: role || "user" // default role
  };

  users.push(user);

  res.status(201).json({ message: "User registered" });
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  refreshTokens.push(refreshToken);

  res.json({ message: "Login success", accessToken, refreshToken });
});

// Refresh token route
app.post("/refresh", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Refresh token required" });

  if (!refreshTokens.includes(token))
    return res.status(403).json({ message: "Invalid refresh token" });

  try {
    const user = jwt.verify(token, REFRESH_SECRET);
    const fullUser = users.find(u => u.id === user.id);

    const newAccess = createAccessToken(fullUser);
    res.json({ accessToken: newAccess });
  } catch {
    res.status(403).json({ message: "Refresh token expired" });
  }
});

// Logout route
app.post("/logout", auth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  
  tokenBlacklist.push(token);
  res.json({ message: "Logged out successfully" });
});

// Get profile (protected)
app.get("/me", auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// Admin-only route
app.get("/admin/data", auth, allowRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin! Secret dashboard unlocked." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Advanced Auth Server running at http://localhost:${PORT}`);
});
