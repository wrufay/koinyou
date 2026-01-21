const mongoose = require("mongoose");

const prayerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    answered: {
      type: Boolean,
      default: false,
    },
    answeredAt: {
      type: Date,
    },
    prayedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prayer", prayerSchema);
