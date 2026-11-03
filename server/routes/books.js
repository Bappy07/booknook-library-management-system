
const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// GET: Get all books (Public)
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const books = await db.collection("books")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// POST: Add a new book (Login required)
router.post("/", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const totalCopies = Number(req.body.totalCopies);

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      return res.status(400).json({
        message: "Total copies must be a positive number",
      });
    }

    const book = {
      ...req.body,
      totalCopies,
      availableCopies: totalCopies,
      ownerId: req.user.id,
      ownerEmail: req.user.email,
      createdAt: new Date(),
    };

    delete book._id;

    const result = await db.collection("books").insertOne(book);

    res.status(201).json({
      message: "Book added successfully!",
      bookId: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add book" });
  }
});

// GET: Get one book by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await db.collection("books").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch book" });
  }
});

// PATCH: Update a book (Owner only)
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const db = getDB();

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const bookId = new ObjectId(req.params.id);

    const book = await db.collection("books").findOne({
      _id: bookId,
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own books",
      });
    }

    const updates = { ...req.body };

    delete updates._id;
    delete updates.createdAt;
    delete updates.availableCopies;
    delete updates.ownerId;
    delete updates.ownerEmail;

    if (updates.totalCopies !== undefined) {
      updates.totalCopies = Number(updates.totalCopies);

      if (!Number.isInteger(updates.totalCopies) || updates.totalCopies < 1) {
        return res.status(400).json({
          message: "Total copies must be a positive number",
        });
      }

      const borrowedCopies = book.totalCopies - book.availableCopies;

      if (updates.totalCopies < borrowedCopies) {
        return res.status(400).json({
          message: "Total copies cannot be less than borrowed copies",
        });
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid updates provided",
      });
    }

    await db.collection("books").updateOne(
      { _id: bookId, ownerId: req.user.id },
      { $set: updates }
    );

    res.json({ message: "Book updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update book" });
  }
});

// DELETE: Delete a book (Owner only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const db = getDB();

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const bookId = new ObjectId(req.params.id);

    const book = await db.collection("books").findOne({
      _id: bookId,
      ownerId: req.user.id,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found or you are not the owner",
      });
    }

    // Prevent deletion while someone has an active borrow
    const activeBorrow = await db.collection("borrows").findOne({
      bookId,
      returnedAt: null,
    });

    if (activeBorrow) {
      return res.status(400).json({
        message: "Cannot delete this book while it has active borrows.",
      });
    }

    await db.collection("books").deleteOne({
      _id: bookId,
      ownerId: req.user.id,
    });

    res.json({ message: "Book deleted successfully!" });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);
    res.status(500).json({ message: "Failed to delete book" });
  }
});

module.exports = router;
