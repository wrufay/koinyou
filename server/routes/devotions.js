const express = require("express");
const router = express.Router();
const Devotion = require("../models/Devotion");
const Friendship = require("../models/Friendship");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Not authenticated" });
};

// Get today's date in YYYY-MM-DD format
const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

// Check in for today
router.post("/checkin", isAuthenticated, async (req, res) => {
  try {
    const { verseReference, reflection } = req.body;
    const today = getToday();

    let devotion = await Devotion.findOne({
      user: req.user._id,
      date: today,
    });

    if (devotion) {
      // Update existing
      devotion.verseReference = verseReference || devotion.verseReference;
      devotion.reflection = reflection || devotion.reflection;
      await devotion.save();
    } else {
      // Create new
      devotion = new Devotion({
        user: req.user._id,
        date: today,
        verseReference,
        reflection,
      });
      await devotion.save();
    }

    res.json({ success: true, devotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get own streak
router.get("/streak", isAuthenticated, async (req, res) => {
  try {
    const devotions = await Devotion.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(365);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];

      const found = devotions.find((d) => d.date === dateStr);
      if (found) {
        streak++;
      } else if (i > 0) {
        // Allow today to be missing (hasn't checked in yet)
        break;
      }
    }

    // Check if checked in today
    const checkedInToday = devotions.some((d) => d.date === getToday());

    res.json({ success: true, streak, checkedInToday });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get friends' streaks
router.get("/friends-streaks", isAuthenticated, async (req, res) => {
  try {
    // Get friend IDs
    const friendships = await Friendship.find({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
      status: "accepted",
    })
      .populate("requester", "name avatar")
      .populate("recipient", "name avatar");

    const today = getToday();

    const friendsData = await Promise.all(
      friendships.map(async (f) => {
        const friend =
          f.requester._id.toString() === req.user._id.toString()
            ? f.recipient
            : f.requester;

        // Get friend's devotions
        const devotions = await Devotion.find({ user: friend._id })
          .sort({ date: -1 })
          .limit(30);

        // Calculate streak
        let streak = 0;
        const checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < 30; i++) {
          const d = new Date(checkDate);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];

          if (devotions.find((dev) => dev.date === dateStr)) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }

        const checkedInToday = devotions.some((d) => d.date === today);

        return {
          friend: {
            _id: friend._id,
            name: friend.name,
            avatar: friend.avatar,
          },
          streak,
          checkedInToday,
        };
      })
    );

    // Sort by streak
    friendsData.sort((a, b) => b.streak - a.streak);

    res.json({ success: true, friends: friendsData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get devotion history
router.get("/history", isAuthenticated, async (req, res) => {
  try {
    const devotions = await Devotion.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    res.json({ success: true, devotions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
