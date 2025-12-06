import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Password is only used for normal email/password accounts.
    // Google accounts will have password = null.
    password: {
      type: String,
      default: null,
    },

    // "local" = email/password
    // "google" = Google OAuth
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      default: null,
    },

    profilePic: {
      type: String,
      default: null,
    },

    avatarGradient: {
      type: Number,
      default: () => Math.floor(Math.random() * 5), // 0–4 randomly
    },

    // Email verification status for local accounts
    emailVerified: {
      type: Boolean,
      default: false,
    },

    // Temporary OTP code
    tempOTP: {
      type: String,
      default: null,
    },

    // When the OTP expires
    otpExpires: {
      type: Date,
      default: null,
    },

    // Number of wrong OTP attempts
    otpAttempts: {
      type: Number,
      default: 0,
    },

    // If the user is locked out for too many attempts
    otpLockedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
