import mongoose, { Schema } from "mongoose";

// Log of every fetchChapter/fetchVerse/fetchBibles call, so we can measure
// how much the BibleCache is actually cutting down on live api.bible calls.
// Auto-expires after 60 days so the collection doesn't grow forever.
const CacheMetricSchema = new Schema({
  outcome: { type: String, enum: ["hit", "miss"], required: true },
  kind: { type: String, enum: ["chapter", "verse", "bibles"], required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 24 * 60 * 60 },
});

export default mongoose.models.CacheMetric || mongoose.model("CacheMetric", CacheMetricSchema);