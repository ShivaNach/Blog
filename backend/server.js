import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

import pool from "./db.js";
import express from "express";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", process.env.FRONTEND_URL); // allow all origins from the frontend url only
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Get all blogs with pagination
app.get("/api/blogs", async (req, res) => {
  const page = req.query.page || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query(`SELECT slug, title, description, published_at FROM blogs ORDER BY published_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  } 
});

// Get a single blog by the slug
app.get("/api/blog/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM blogs WHERE slug = $1`, [slug]);
    if (result.rows.length === 0) {
      return res.status(404).send("Blog not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//handle admin login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  // Check if credentials match
  const user = await pool.query(`SELECT * FROM admins WHERE username= $1`, [username]);
  const isMatch = await bcrypt.compare(password, user.rows[0]?.hashed_password || "");
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  } 
  // Create JWT token
  const token = jwt.sign(
    {
      username: user.rows[0].username,
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "4h" } 
  );

  // Send the token to frontend
  return res.status(200).json({
    message: "Login successful",
    token,
    expiresIn: 4 * 60 * 60, 
  });
  
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});