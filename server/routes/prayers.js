const express = require("express");
const router = express.Router();
const Prayer = require("../models/Prayer");
const Friendship = require("../models/Friendship");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Not authenticated" });
};

// Create a prayer request
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    const prayer = new Prayer({
      user: req.user._id,
      content,
      isAnonymous: isAnonymous || false,
    });

    await prayer.save();
    res.json({ success: true, prayer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get prayer feed (friends' prayers + own prayers)
router.get("/feed", isAuthenticated, async (req, res) => {
  try {
    // Get friend IDs
    const friendships = await Friendship.find({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
      status: "accepted",
    });

    const friendIds = friendships.map((f) =>
      f.requester.toString() === req.user._id.toString()
        ? f.recipient
        : f.requester
    );

    // Include self
    friendIds.push(req.user._id);

    const prayers = await Prayer.find({
      user: { $in: friendIds },
    })
      .populate("user", "name avatar")
      .populate("prayedBy", "name avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    // Hide user info for anonymous prayers (except own)
    const sanitizedPrayers = prayers.map((p) => {
      const prayer = p.toObject();
      if (prayer.isAnonymous && prayer.user._id.toString() !== req.user._id.toString()) {
        prayer.user = { name: "Anonymous", avatar: null };
      }
      prayer.prayerCount = prayer.prayedBy.length;
      prayer.hasPrayed = prayer.prayedBy.some(
        (u) => u._id.toString() === req.user._id.toString()
      );
      return prayer;
    });

    res.json({ success: true, prayers: sanitizedPrayers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get own prayers
router.get("/mine", isAuthenticated, async (req, res) => {
  try {
    const prayers = await Prayer.find({ user: req.user._id })
      .populate("prayedBy", "name avatar")
      .sort({ createdAt: -1 });

    const sanitizedPrayers = prayers.map((p) => {
      const prayer = p.toObject();
      prayer.prayerCount = prayer.prayedBy.length;
      return prayer;
    });

    res.json({ success: true, prayers: sanitizedPrayers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Pray for someone (add to prayedBy)
router.post("/pray/:prayerId", isAuthenticated, async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.prayerId);

    if (!prayer) {
      return res.status(404).json({ success: false, message: "Prayer not found" });
    }

    // Check if already prayed
    if (prayer.prayedBy.includes(req.user._id)) {
      return res.json({ success: true, message: "Already prayed" });
    }

    prayer.prayedBy.push(req.user._id);
    await prayer.save();

    res.json({ success: true, prayerCount: prayer.prayedBy.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark prayer as answered
router.post("/answered/:prayerId", isAuthenticated, async (req, res) => {
  try {
    const prayer = await Prayer.findOne({
      _id: req.params.prayerId,
      user: req.user._id,
    });

    if (!prayer) {
      return res.status(404).json({ success: false, message: "Prayer not found" });
    }

    prayer.answered = true;
    prayer.answeredAt = new Date();
    await prayer.save();

    res.json({ success: true, prayer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete prayer
router.delete("/:prayerId", isAuthenticated, async (req, res) => {
  try {
    await Prayer.findOneAndDelete({
      _id: req.params.prayerId,
      user: req.user._id,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
