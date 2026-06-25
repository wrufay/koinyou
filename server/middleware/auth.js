const User = require("../models/User");
const { verifyToken } = require("../config/jwt");

// Attaches req.user from JWT cookie — runs on every request.
// Protected routes call isAuthenticated() which just checks req.user exists.
const attachUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return next();

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (user) req.user = user;
  } catch {
    // Expired / invalid token → req.user stays null, protected routes return 401
  }
  next();
};

module.exports = { attachUser };
