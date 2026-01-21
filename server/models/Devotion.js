const mongoose = require("mongoose");

const devotionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD format
      required: true,
    },
    verseReference: {
      type: String,
    },
    reflection: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// One devotion per user per day
devotionSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Devotion", devotionSchema);
