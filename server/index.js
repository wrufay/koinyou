require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const cors = require("cors");
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

connectDB();

const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/verses", versesRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/send", sendRoutes);
app.use("/api/prayers", prayersRoutes);
app.use("/api/devotions", devotionsRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.json({ message: "koinYOU API" });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
