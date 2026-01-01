// task-api.js — Task Management REST API (Single File Backend)

const express = require("express");
const app = express();
const PORT = 7000;

app.use(express.json());

// In-memory DB
let tasks = [];
let idCounter = 1;

/*
 Task Model
 {
   id: Number,
   title: String,
   description: String,
   completed: Boolean,
   priority: "low" | "medium" | "high",
   createdAt: Date
 }
*/

// ---------------- CREATE TASK ----------------
app.post("/tasks", (req, res) => {
  const { title, description, priority } = req.body;

  if (!title)
    return res.status(400).json({ message: "Title is required" });

  const task = {
    id: idCounter++,
    title,
    description: description || "",
    completed: false,
    priority: priority || "medium",
    createdAt: new Date()
  };

  tasks.push(task);
  res.status(201).json(task);
});

// ---------------- GET ALL TASKS ----------------
app.get("/tasks", (req, res) => {
  const { completed, priority } = req.query;

  let result = [...tasks];

  if (completed !== undefined)
    result = result.filter(t => t.completed == completed);

  if (priority)
    result = result.filter(t => t.priority === priority);

  res.json(result);
});

// ---------------- GET SINGLE TASK ----------------
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task)
    return res.status(404).json({ message: "Task not found" });

  res.json(task);
});

// ---------------- UPDATE TASK ----------------
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task)
    return res.status(404).json({ message: "Task not found" });

  const { title, description, completed, priority } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;
  if (priority) task.priority = priority;

  res.json({ message: "Task updated", task });
});

// ---------------- DELETE TASK ----------------
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id == req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Task not found" });

  const removed = tasks.splice(index, 1);
  res.json({ message: "Task deleted", removed });
});

// ---------------- STATS API ----------------
app.get("/stats", (req, res) => {
  res.json({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Task API running at http://localhost:${PORT}`);
});
