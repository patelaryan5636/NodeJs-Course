// crud-server.js — Single File CRUD Backend (Node.js + Express)

const express = require("express");
const app = express();
const PORT = 6000;

app.use(express.json());

// In-memory database
let products = [];
let currentId = 1;

/*
  Product Schema
  {
    id: Number,
    name: String,
    price: Number,
    category: String
  }
*/

// ---------------- CREATE ----------------
app.post("/products", (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price)
    return res.status(400).json({ message: "Name & price required" });

  const product = {
    id: currentId++,
    name,
    price,
    category: category || "general"
  };

  products.push(product);
  res.status(201).json(product);
});

// ---------------- READ ALL ----------------
app.get("/products", (req, res) => {
  res.json(products);
});

// ---------------- READ ONE ----------------
app.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product)
    return res.status(404).json({ message: "Product not found" });

  res.json(product);
});

// ---------------- UPDATE ----------------
app.put("/products/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product)
    return res.status(404).json({ message: "Product not found" });

  const { name, price, category } = req.body;
  if (name) product.name = name;
  if (price) product.price = price;
  if (category) product.category = category;

  res.json({ message: "Product updated", product });
});

// ---------------- DELETE ----------------
app.delete("/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Product not found" });

  const deleted = products.splice(index, 1);
  res.json({ message: "Product deleted", deleted });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`CRUD Server running on http://localhost:${PORT}`);
});
