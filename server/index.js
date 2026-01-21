require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const versesRoutes = require("./routes/verses");
const friendsRoutes = require("./routes/friends");
const sendRoutes = require("./routes/send");
const prayersRoutes = require("./routes/prayers");
const devotionsRoutes = require("./routes/devotions");
const profileRoutes = require("./routes/profile");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Session
const isProduction = process.env.NODE_ENV === "production";
app.set("trust proxy", 1); // Trust Railway's proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax", // Required for cross-site cookies
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/api/verses", versesRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/send", sendRoutes);
app.use("/api/prayers", prayersRoutes);
app.use("/api/devotions", devotionsRoutes);
app.use("/api/profile", profileRoutes);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Bible Search API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
