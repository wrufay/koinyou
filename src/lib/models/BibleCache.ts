import mongoose, { Schema } from "mongoose";

// Bible text never changes, so cache entries are permanent (no TTL).
const BibleCacheSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    kind: { type: String, enum: ["chapter", "verse", "bibles"], required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.BibleCache || mongoose.model("BibleCache", BibleCacheSchema);