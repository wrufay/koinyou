import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CacheMetric from "@/lib/models/CacheMetric";
import BibleCache from "@/lib/models/BibleCache";

function since(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

async function countsSince(date: Date) {
  const rows = await CacheMetric.aggregate([
    { $match: { createdAt: { $gte: date } } },
    { $group: { _id: "$outcome", count: { $sum: 1 } } },
  ]);
  const hits = rows.find((r) => r._id === "hit")?.count || 0;
  const misses = rows.find((r) => r._id === "miss")?.count || 0;
  const total = hits + misses;
  return {
    hits,
    misses,
    total,
    hitRate: total ? Math.round((hits / total) * 1000) / 10 : null,
  };
}

export async function GET() {
  try {
    await connectDB();
    const [last24h, last7d, allTime, cachedEntries] = await Promise.all([
      countsSince(since(24)),
      countsSince(since(24 * 7)),
      countsSince(new Date(0)),
      BibleCache.countDocuments(),
    ]);

    return NextResponse.json({
      cachedEntries,
      last24h,
      last7d,
      allTime,
      note: "misses = actual calls made to api.bible; hits = served from our own Mongo cache",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
