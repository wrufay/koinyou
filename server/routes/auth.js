const express = require("express");
const passport = require("passport");
const router = express.Router();

// @route   GET /auth/google
// @desc    Auth with Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @route   GET /auth/google/callback
// @desc    Google auth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
  }
);

// @route   GET /auth/user
// @desc    Get current user
router.get("/user", async (req, res) => {
  if (req.user) {
    // Fetch fresh user data from database to ensure avatar is up-to-date
    const User = require("../models/User");
    const freshUser = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        id: freshUser._id,
        name: freshUser.name,
        email: freshUser.email,
        avatar: freshUser.avatar,
      },
    });
  } else {
    res.json({ success: false, user: null });
  }
});

// @route   GET /auth/logout
// @desc    Logout user
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
  });
});

module.exports = router;
