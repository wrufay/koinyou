const express = require("express");
const router = express.Router();
const User = require("../models/User");

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
