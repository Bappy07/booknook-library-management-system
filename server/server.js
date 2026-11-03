
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const booksRoutes = require("./routes/books");
const borrowsRoutes = require("./routes/borrows");
const verifyToken = require("./middleware/verifyToken");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main route
app.get("/", (req, res) => {
  res.send("BookNook API is running!");
});

// Book APIs
app.use("/books", booksRoutes);

// Borrow APIs
app.use("/borrows", borrowsRoutes);

// Authentication test
app.get("/test-auth", verifyToken, (req, res) => {
  res.json({
    message: "Authentication successful!",
    user: req.user,
  });
});

// Start server
async function startServer() {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

startServer();
