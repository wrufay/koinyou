const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "koinyou-dev-secret-change-in-prod";
const JWT_EXPIRES_IN = "7d";

const signToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

const cookieOptions = (isProduction) => ({
  httpOnly: true,                              // JS cannot read — XSS protection
  secure: isProduction,                        // HTTPS only in prod
  sameSite: isProduction ? "none" : "lax",    // cross-site in prod (Vercel → Railway)
  maxAge: 7 * 24 * 60 * 60 * 1000,           // 7 days in ms
});

module.exports = { signToken, verifyToken, cookieOptions };
