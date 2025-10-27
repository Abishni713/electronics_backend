const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Sample in-memory "database"
let Products = [
  { id: 1, name: "Laptop", qty: 10 },
  { id: 2, name: "Mouse", qty: 25 },
  { id: 3, name: "Keyboard", qty: 15 }
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Get all products
app.get("/Products", (req, res) => {
  console.log("GET /Products");
  res.json(Products);
});

// Get single product by id
app.get("/Products/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  const product = Products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ msg: "Product Not Found" });
  }

  res.json(product);
});

// Add new product
app.post("/Products", (req, res) => {
  const { id, name, qty } = req.body;

  // Check if product with same ID exists
  const existing = Products.find(p => p.id === id);
  if (existing) {
    return res.status(400).json({ msg: "Product with this ID already exists" });
  }

  const newProduct = { id, name, qty };
  Products.push(newProduct);

  res.json({ Product: newProduct, msg: "Product added successfully" });
});

// Update product by id
app.put("/Products/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  const { name, qty } = req.body;

  const index = Products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ msg: "Product Not Found" });
  }

  if (name) Products[index].name = name;
  if (qty !== undefined) Products[index].qty = qty;

  res.json({ msg: "Product updated successfully", Product: Products[index] });
});

// Delete product by id
app.delete("/Products/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  const index = Products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ msg: "Product Not Found" });
  }

  const deletedProduct = Products.splice(index, 1);
  res.json({ msg: "Product deleted successfully", Product: deletedProduct[0] });
});

// Start server
app.listen(3000, () => {
  console.log("Server started at Port 3000");
});
