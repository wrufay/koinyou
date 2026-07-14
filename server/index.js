require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("./config/passport");
const { attachUser } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const versesRoutes = require("./routes/verses");
const friendsRoutes = require("./routes/friends");
const sendRoutes = require("./routes/send");
const prayersRoutes = require("./routes/prayers");
const devotionsRoutes = require("./routes/devotions");
const profileRoutes = require("./routes/profile");

const app = express();

connectDB();

app.set("trust proxy", 1);
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(attachUser);

app.use("/auth", authRoutes);
app.use("/api/verses", versesRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/send", sendRoutes);
app.use("/api/prayers", prayersRoutes);
app.use("/api/devotions", devotionsRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => res.json({ message: "koinYOU API" }));

if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
