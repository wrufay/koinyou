const express = require("express");
const SavedVerse = require("../models/SavedVerse");
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
};

// @route   POST /api/verses/save
// @desc    Save a verse
router.post("/save", isAuthenticated, async (req, res) => {
  try {
    const { reference, book, chapter, verse, text } = req.body;

    const savedVerse = await SavedVerse.create({
      userId: req.user._id,
      reference,
      book,
      chapter,
      verse,
      text,
    });

    res.json({ success: true, savedVerse });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - already saved
      res.json({ success: true, message: "Already saved" });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

// @route   DELETE /api/verses/save
// @desc    Unsave a verse
router.delete("/save", isAuthenticated, async (req, res) => {
  try {
    const { reference } = req.body;

    await SavedVerse.findOneAndDelete({
      userId: req.user._id,
      reference,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/verses/saved
// @desc    Get all saved verses for user
router.get("/saved", isAuthenticated, async (req, res) => {
  try {
    const savedVerses = await SavedVerse.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, savedVerses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/verses/is-saved/:reference
// @desc    Check if a verse is saved
router.get("/is-saved/:reference", isAuthenticated, async (req, res) => {
  try {
    const { reference } = req.params;

    const savedVerse = await SavedVerse.findOne({
      userId: req.user._id,
      reference: decodeURIComponent(reference),
    });

    res.json({ success: true, isSaved: !!savedVerse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
