// live-api.js — Production-Style REST API (Single File)

const express = require("express");
const app = express();
const PORT = 8000;

app.use(express.json());

// ---------------- GLOBAL MIDDLEWARE ----------------

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ---------------- IN-MEMORY DATABASE ----------------
let users = [];
let idCounter = 1;

/*
 User Model
 {
   id: Number,
   name: String,
   email: String,
   role: "user" | "admin",
   status: "active" | "blocked",
   createdAt: Date
 }
*/

// ---------------- HELPERS ----------------
function success(res, data, message = "Success") {
  return res.status(200).json({
    success: true,
    message,
    data
  });
}

function error(res, status, message) {
  return res.status(status).json({
    success: false,
    message
  });
}

// ---------------- API ROUTES ----------------
const router = express.Router();

// CREATE USER
router.post("/users", (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email)
    return error(res, 400, "Name and email required");

  if (users.some(u => u.email === email))
    return error(res, 409, "Email already exists");

  const user = {
    id: idCounter++,
    name,
    email,
    role: role || "user",
    status: "active",
    createdAt: new Date()
  };

  users.push(user);
  success(res, user, "User created");
});

// GET USERS (pagination + search)
router.get("/users", (req, res) => {
  let { page = 1, limit = 5, search = "" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let result = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);

  success(res, {
    total: result.length,
    page,
    limit,
    users: paginated
  });
});

// GET SINGLE USER
router.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return error(res, 404, "User not found");
  success(res, user);
});

// UPDATE USER
router.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return error(res, 404, "User not found");

  const { name, role, status } = req.body;
  if (name) user.name = name;
  if (role) user.role = role;
  if (status) user.status = status;

  success(res, user, "User updated");
});

// DELETE USER (soft delete)
router.delete("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return error(res, 404, "User not found");

  user.status = "blocked";
  success(res, null, "User blocked (soft delete)");
});

// ---------------- REGISTER API VERSION ----------------
app.use("/api/v1", router);

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Live API running on http://localhost:${PORT}/api/v1`);
});
