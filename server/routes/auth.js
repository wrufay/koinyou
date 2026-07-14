const express = require("express");
const passport = require("passport");
const router = express.Router();
const { signToken, cookieOptions } = require("../config/jwt");

const isProduction = process.env.NODE_ENV === "production";

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.cookie("token", token, cookieOptions(isProduction));
    res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
  }
);

router.get("/user", (req, res) => {
  if (!req.user) return res.json({ success: false, user: null });
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    },
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions(isProduction));
  res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
});

module.exports = router;
