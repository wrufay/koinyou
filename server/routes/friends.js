const express = require("express");
const router = express.Router();
const Friendship = require("../models/Friendship");
const User = require("../models/User");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Not authenticated" });
};

// Search users by email or name
router.get("/search", isAuthenticated, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, users: [] });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    })
      .select("name email avatar")
      .limit(10);

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send friend request
router.post("/request", isAuthenticated, async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot add yourself" });
    }

    // Check if friendship already exists
    const existing = await Friendship.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id },
      ],
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Friend request already exists" });
    }

    const friendship = new Friendship({
      requester: req.user._id,
      recipient: recipientId,
    });

    await friendship.save();
    res.json({ success: true, friendship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Accept friend request
router.post("/accept/:friendshipId", isAuthenticated, async (req, res) => {
  try {
    const friendship = await Friendship.findOne({
      _id: req.params.friendshipId,
      recipient: req.user._id,
      status: "pending",
    });

    if (!friendship) {
      return res.status(404).json({ success: false, message: "Friend request not found" });
    }

    friendship.status = "accepted";
    await friendship.save();

    res.json({ success: true, friendship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Decline friend request
router.post("/decline/:friendshipId", isAuthenticated, async (req, res) => {
  try {
    const friendship = await Friendship.findOneAndDelete({
      _id: req.params.friendshipId,
      recipient: req.user._id,
      status: "pending",
    });

    if (!friendship) {
      return res.status(404).json({ success: false, message: "Friend request not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all friends
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const friendships = await Friendship.find({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
      status: "accepted",
    })
      .populate("requester", "name email avatar")
      .populate("recipient", "name email avatar");

    const friends = friendships.map((f) => {
      return f.requester._id.toString() === req.user._id.toString()
        ? f.recipient
        : f.requester;
    });

    res.json({ success: true, friends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pending friend requests (received)
router.get("/requests", isAuthenticated, async (req, res) => {
  try {
    const requests = await Friendship.find({
      recipient: req.user._id,
      status: "pending",
    }).populate("requester", "name email avatar");

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove friend
router.delete("/:friendId", isAuthenticated, async (req, res) => {
  try {
    await Friendship.findOneAndDelete({
      $or: [
        { requester: req.user._id, recipient: req.params.friendId },
        { requester: req.params.friendId, recipient: req.user._id },
      ],
      status: "accepted",
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
