import express from "express";
import UserBook from "../models/UserBook.js";
import auth from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// add book to reading list
router.post("/", auth, async (req, res) => {
  try {
    const { bookId, status, progress, rating, notes, coverImage } = req.body;
    coverImage: { type: String };
    // validate book
    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    if (status && !["wishlist", "reading", "finished"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100",
      });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (notes && notes.length > 500) {
      return res.status(400).json({
        message: "Notes must be less than 500 characters",
      });
    }

    // check if exists
    const exists = await UserBook.findOne({
      user: req.user.id,
      book: bookId,
    });

    if (exists) {
      return res.status(400).json({ message: "Book already in your list" });
    }

    // create book
    const entry = await UserBook.create({
      user: req.user.id,
      book: bookId,
      coverImage,
      status: status || "wishlist",
      progress: progress || 0,
      rating: rating || undefined,
      notes: notes || "",
    });

    return res.status(201).json(entry);
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// get reading list summary
// get reading list summary
router.get("/summary", auth, async (req, res) => {
  try {
    const rawId = req.user.id || req.user._id;

    if (!rawId) {
      return res
        .status(400)
        .json({ message: "Cannot determine current user id" });
    }

    const userObjectId = new mongoose.Types.ObjectId(rawId.toString());

    const summary = await UserBook.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: null,
          wishlist: {
            $sum: { $cond: [{ $eq: ["$status", "wishlist"] }, 1, 0] },
          },
          reading: {
            $sum: { $cond: [{ $eq: ["$status", "reading"] }, 1, 0] },
          },
          finished: {
            $sum: { $cond: [{ $eq: ["$status", "finished"] }, 1, 0] },
          },
        },
      },
    ]);

    const result = summary[0] || {
      wishlist: 0,
      reading: 0,
      finished: 0,
    };

    return res.json({ summary: result });
  } catch (err) {
    console.error("Error in /userbooks/summary:", err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
});

// Get all books from logged in user
router.get("/", auth, async (req, res) => {
  try {
    const list = await UserBook.find({ user: req.user.id })
      .populate("book") // include book details
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// update user book entry
router.put("/:id", auth, async (req, res) => {
  try {
    const entry = await UserBook.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // check ownership
    if (entry.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // validate
    const { status, progress, rating, notes } = req.body;

    if (status && !["wishlist", "reading", "finished"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return res.status(400).json({ message: "Progress must be 0–100" });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be 1–5" });
    }

    if (notes && notes.length > 500) {
      return res.status(400).json({ message: "Notes too long" });
    }

    // prevent duplicates
    if (req.body.book) {
      return res.status(400).json({ message: "Book cannot be changed" });
    }

    //update
    const updated = await UserBook.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// delete from usre list
router.delete("/:id", auth, async (req, res) => {
  try {
    const entry = await UserBook.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // onwership check
    if (entry.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await entry.deleteOne();

    return res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
