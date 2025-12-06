import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import userBookRoutes from "./routes/userBooks.js";

import { swaggerUiServe, swaggerUiSetup } from "./swagger.js";

dotenv.config();

const app = express();

// frontend url
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.set("trust proxy", 1);

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "https://reactors-4x5p.vercel.app"],
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/userbooks", userBookRoutes);

// Swagger docs
app.use("/api-docs", swaggerUiServe, swaggerUiSetup);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// PORT for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
