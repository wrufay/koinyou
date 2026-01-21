const express = require("express");
const router = express.Router();
const SentVerse = require("../models/SentVerse");
const Friendship = require("../models/Friendship");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Not authenticated" });
};

// Send a verse to a friend
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { recipientId, reference, book, chapter, verse, text, note } = req.body;

    // Verify they are friends
    const friendship = await Friendship.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id },
      ],
      status: "accepted",
    });

    if (!friendship) {
      return res.status(403).json({ success: false, message: "You can only send verses to friends" });
    }

    const sentVerse = new SentVerse({
      sender: req.user._id,
      recipient: recipientId,
      reference,
      book,
      chapter,
      verse,
      text,
      note: note || "",
    });

    await sentVerse.save();
    res.json({ success: true, sentVerse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get inbox (received verses)
router.get("/inbox", isAuthenticated, async (req, res) => {
  try {
    const verses = await SentVerse.find({ recipient: req.user._id })
      .populate("sender", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, verses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get sent verses
router.get("/sent", isAuthenticated, async (req, res) => {
  try {
    const verses = await SentVerse.find({ sender: req.user._id })
      .populate("recipient", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, verses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark verse as read
router.post("/read/:verseId", isAuthenticated, async (req, res) => {
  try {
    const verse = await SentVerse.findOneAndUpdate(
      { _id: req.params.verseId, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!verse) {
      return res.status(404).json({ success: false, message: "Verse not found" });
    }

    res.json({ success: true, verse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get unread count
router.get("/unread-count", isAuthenticated, async (req, res) => {
  try {
    const count = await SentVerse.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
