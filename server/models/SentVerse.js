const mongoose = require("mongoose");

const sentVerseSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
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
    note: {
      type: String,
      default: "",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SentVerse", sentVerseSchema);
