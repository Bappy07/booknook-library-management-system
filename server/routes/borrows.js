
const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB, getClient } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// POST: Borrow a book (Login required)
router.post("/", verifyToken, async (req, res) => {
  const db = getDB();
  const client = getClient();
  const session = client.startSession();

  try {
    const { bookId } = req.body;

    if (!bookId || !ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const bookObjectId = new ObjectId(bookId);

    let createdBorrow;

    await session.withTransaction(async () => {
      const book = await db.collection("books").findOne(
        { _id: bookObjectId },
        { session }
      );

      if (!book) {
        throw new Error("BOOK_NOT_FOUND");
      }

      const existingBorrow = await db.collection("borrows").findOne(
        {
          bookId: bookObjectId,
          userId: req.user.id,
          returnedAt: null,
        },
        { session }
      );

      if (existingBorrow) {
        throw new Error("ALREADY_BORROWED");
      }

      const stockResult = await db.collection("books").updateOne(
        {
          _id: bookObjectId,
          availableCopies: { $gt: 0 },
        },
        { $inc: { availableCopies: -1 } },
        { session }
      );

      if (stockResult.modifiedCount === 0) {
        throw new Error("OUT_OF_STOCK");
      }

      const borrowDate = new Date();
      const returnDate = new Date(borrowDate);
      returnDate.setDate(returnDate.getDate() + 7);

      createdBorrow = {
        bookId: bookObjectId,
        bookTitle: book.title || book.name || "Untitled",
        bookImage: book.image || book.coverImage || "",
        userId: req.user.id,
        userEmail: req.user.email,
        borrowDate,
        returnDate,
        returnedAt: null,
        status: "borrowed",
      };

      await db.collection("borrows").insertOne(createdBorrow, { session });
    });

    res.status(201).json({
      message: "Book borrowed successfully!",
      borrow: createdBorrow,
    });
  } catch (error) {
    if (error.message === "BOOK_NOT_FOUND") {
      return res.status(404).json({ message: "Book not found" });
    }

    if (error.message === "ALREADY_BORROWED") {
      return res.status(409).json({
        message: "You have already borrowed this book",
      });
    }

    if (error.message === "OUT_OF_STOCK") {
      return res.status(400).json({
        message: "This book is currently unavailable",
      });
    }

    console.error("BORROW BOOK ERROR:", error);
    res.status(500).json({ message: "Failed to borrow book" });
  } finally {
    await session.endSession();
  }
});

// GET: Get current user's borrowed books
router.get("/", verifyToken, async (req, res) => {
  try {
    const db = getDB();

    const borrows = await db.collection("borrows")
      .find({ userId: req.user.id })
      .sort({ borrowDate: -1 })
      .toArray();

    const today = new Date();

    const updatedBorrows = borrows.map((borrow) => {
      let status = borrow.status;

      if (!borrow.returnedAt && new Date(borrow.returnDate) < today) {
        status = "overdue";
      }

      return {
        ...borrow,
        status,
      };
    });

    res.json(updatedBorrows);
  } catch (error) {
    console.error("GET BORROWS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch borrowed books",
    });
  }
});

// DELETE: Return a borrowed book
router.delete("/:id", verifyToken, async (req, res) => {
  const db = getDB();
  const client = getClient();
  const session = client.startSession();

  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid borrow ID" });
    }

    const borrowId = new ObjectId(req.params.id);

    await session.withTransaction(async () => {
      const borrow = await db.collection("borrows").findOne(
        {
          _id: borrowId,
          userId: req.user.id,
          returnedAt: null,
        },
        { session }
      );

      if (!borrow) {
        throw new Error("ACTIVE_BORROW_NOT_FOUND");
      }

      const returnResult = await db.collection("borrows").updateOne(
        {
          _id: borrowId,
          userId: req.user.id,
          returnedAt: null,
        },
        {
          $set: {
            returnedAt: new Date(),
            status: "returned",
          },
        },
        { session }
      );

      if (returnResult.modifiedCount === 0) {
        throw new Error("ACTIVE_BORROW_NOT_FOUND");
      }

      const stockResult = await db.collection("books").updateOne(
        { _id: borrow.bookId },
        { $inc: { availableCopies: 1 } },
        { session }
      );

      if (stockResult.matchedCount === 0) {
        throw new Error("BOOK_NOT_FOUND");
      }
    });

    res.json({ message: "Book returned successfully!" });
  } catch (error) {
    if (error.message === "ACTIVE_BORROW_NOT_FOUND") {
      return res.status(404).json({
        message: "Active borrowing record not found",
      });
    }

    if (error.message === "BOOK_NOT_FOUND") {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    console.error("RETURN BOOK ERROR:", error);
    res.status(500).json({
      message: "Failed to return book",
    });
  } finally {
    await session.endSession();
  }
});

module.exports = router;
