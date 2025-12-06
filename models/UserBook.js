import mongoose from "mongoose";

const userBookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    // ⭐ ADD THIS FIELD ⭐
    coverImage: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["wishlist", "reading", "finished"],
      default: "wishlist",
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    finishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserBook", userBookSchema);
