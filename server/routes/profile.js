const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Not authenticated" });
};

// Get current user's profile
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-googleId");
    res.json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio || "",
        favoriteVerse: user.favoriteVerse || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update current user's profile
router.put("/", isAuthenticated, async (req, res) => {
  try {
    const { name, bio, favoriteVerse } = req.body;

    const updates = {};
    if (name && name.trim()) {
      updates.name = name.trim().slice(0, 50);
    }
    if (bio !== undefined) {
      updates.bio = bio.trim().slice(0, 200);
    }
    if (favoriteVerse !== undefined) {
      updates.favoriteVerse = favoriteVerse.trim().slice(0, 100);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select("-googleId");

    res.json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio || "",
        favoriteVerse: user.favoriteVerse || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Upload avatar
router.post("/avatar", isAuthenticated, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Delete old avatar if it's a local file
    const user = await User.findById(req.user._id);
    if (user.avatar && user.avatar.includes("/uploads/")) {
      const oldPath = path.join(__dirname, "..", user.avatar.replace("/uploads/", "uploads/"));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update user with new avatar URL
    const avatarUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    ).select("-googleId");

    res.json({
      success: true,
      avatar: avatarUrl,
      profile: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio || "",
        favoriteVerse: updatedUser.favoriteVerse || "",
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get another user's public profile
router.get("/:userId", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("name avatar bio favoriteVerse createdAt");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio || "",
        favoriteVerse: user.favoriteVerse || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
