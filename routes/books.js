import express from "express";
import Book from "../models/Book.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// create book
router.post("/", auth, async (req, res) => {
  try {
    const { title, author, description, genre } = req.body;

    if (!title || title.length < 2) {
      return res.status(400).json({ message: "Title must be ≥ 2 characters" });
    }

    if (!author || author.length < 2) {
      return res.status(400).json({ message: "Author must be ≥ 2 characters" });
    }

    if (description && description.length > 500) {
      return res.status(400).json({ message: "Description too long" });
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      createdBy: req.user.id,
    });

    return res.status(201).json(book);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// get my books
router.get("/mine", auth, async (req, res) => {
  try {
    const books = await Book.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    return res.json({
      message: "Books created by user",
      count: books.length,
      books,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// get single book
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// update book
router.put("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (req.body.title && req.body.title.length < 2) {
      return res.status(400).json({ message: "Title too short" });
    }

    if (req.body.author && req.body.author.length < 2) {
      return res.status(400).json({ message: "Author too short" });
    }

    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// delete book
router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await book.deleteOne();

    return res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
