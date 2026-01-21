const mongoose = require("mongoose");

const savedVerseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    book: {
      type: String,
      required: true,
    },
    chapter: {
      type: String,
      required: true,
    },
    verse: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate saves
savedVerseSchema.index({ userId: 1, reference: 1 }, { unique: true });

module.exports = mongoose.model("SavedVerse", savedVerseSchema);
