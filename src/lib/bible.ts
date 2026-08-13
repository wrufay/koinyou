import { connectDB } from "./db";
import BibleCache from "./models/BibleCache";
import CacheMetric from "./models/CacheMetric";

const BOOK_MAP: Record<string, string> = {
  // Old Testament
  genesis: "GEN", gen: "GEN",
  exodus: "EXO", exo: "EXO", ex: "EXO",
  leviticus: "LEV", lev: "LEV",
  numbers: "NUM", num: "NUM",
  deuteronomy: "DEU", deu: "DEU", deut: "DEU",
  joshua: "JOS", jos: "JOS", josh: "JOS",
  judges: "JDG", jdg: "JDG", judg: "JDG",
  ruth: "RUT", rut: "RUT",
  "1samuel": "1SA", "1sam": "1SA", "1sa": "1SA",
  "2samuel": "2SA", "2sam": "2SA", "2sa": "2SA",
  "1kings": "1KI", "1ki": "1KI", "1kgs": "1KI",
  "2kings": "2KI", "2ki": "2KI", "2kgs": "2KI",
  "1chronicles": "1CH", "1ch": "1CH", "1chr": "1CH",
  "2chronicles": "2CH", "2ch": "2CH", "2chr": "2CH",
  ezra: "EZR", ezr: "EZR",
  nehemiah: "NEH", neh: "NEH",
  esther: "EST", est: "EST", esth: "EST",
  job: "JOB",
  psalm: "PSA", psalms: "PSA", psa: "PSA", ps: "PSA",
  proverbs: "PRO", pro: "PRO", prov: "PRO",
  ecclesiastes: "ECC", ecc: "ECC", eccl: "ECC",
  songofsolomon: "SNG", song: "SNG", sos: "SNG",
  isaiah: "ISA", isa: "ISA",
  jeremiah: "JER", jer: "JER",
  lamentations: "LAM", lam: "LAM",
  ezekiel: "EZK", ezk: "EZK", ezek: "EZK",
  daniel: "DAN", dan: "DAN",
  hosea: "HOS", hos: "HOS",
  joel: "JOL", jol: "JOL",
  amos: "AMO", amo: "AMO",
  obadiah: "OBA", oba: "OBA", obad: "OBA",
  jonah: "JON", jon: "JON",
  micah: "MIC", mic: "MIC",
  nahum: "NAH", nah: "NAH",
  habakkuk: "HAB", hab: "HAB",
  zephaniah: "ZEP", zep: "ZEP", zeph: "ZEP",
  haggai: "HAG", hag: "HAG",
  zechariah: "ZEC", zec: "ZEC", zech: "ZEC",
  malachi: "MAL", mal: "MAL",
  // New Testament
  matthew: "MAT", mat: "MAT", matt: "MAT",
  mark: "MRK", mrk: "MRK", mk: "MRK",
  luke: "LUK", luk: "LUK", lk: "LUK",
  john: "JHN", jhn: "JHN", jn: "JHN",
  acts: "ACT", act: "ACT",
  romans: "ROM", rom: "ROM",
  "1corinthians": "1CO", "1co": "1CO", "1cor": "1CO",
  "2corinthians": "2CO", "2co": "2CO", "2cor": "2CO",
  galatians: "GAL", gal: "GAL",
  ephesians: "EPH", eph: "EPH",
  philippians: "PHP", php: "PHP", phil: "PHP",
  colossians: "COL", col: "COL",
  "1thessalonians": "1TH", "1th": "1TH", "1thess": "1TH",
  "2thessalonians": "2TH", "2th": "2TH", "2thess": "2TH",
  "1timothy": "1TI", "1ti": "1TI", "1tim": "1TI",
  "2timothy": "2TI", "2ti": "2TI", "2tim": "2TI",
  titus: "TIT", tit: "TIT",
  philemon: "PHM", phm: "PHM",
  hebrews: "HEB", heb: "HEB",
  james: "JAS", jas: "JAS", jam: "JAS",
  "1peter": "1PE", "1pe": "1PE", "1pet": "1PE",
  "2peter": "2PE", "2pe": "2PE", "2pet": "2PE",
  "1john": "1JN", "1jn": "1JN",
  "2john": "2JN", "2jn": "2JN",
  "3john": "3JN", "3jn": "3JN",
  jude: "JUD", jud: "JUD",
  revelation: "REV", rev: "REV",
};

export function toBookId(bookName: string): string {
  const key = bookName.toLowerCase().replace(/\s+/g, "");
  return BOOK_MAP[key] || bookName.toUpperCase().slice(0, 3);
}

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface ChapterData {
  reference: string;
  verses: BibleVerse[];
}

export interface VerseData {
  reference: string;
  text: string;
  verses?: BibleVerse[];
}

const BASE = "https://api.scripture.api.bible/v1";

function bibleId(override?: string) {
  return override || process.env.NIV_ID || "78a9f6124f344018-01";
}

function apiHeaders(): HeadersInit {
  return { "api-key": process.env.BIBLE_API_KEY || "" };
}

type CacheKind = "chapter" | "verse" | "bibles";

async function getCached<T>(key: string): Promise<T | null> {
  try {
    await connectDB();
    const doc = await BibleCache.findOne({ key }).lean<{ data: T }>();
    return doc ? doc.data : null;
  } catch {
    return null;
  }
}

async function setCached(key: string, kind: CacheKind, data: unknown): Promise<void> {
  try {
    await connectDB();
    await BibleCache.updateOne({ key }, { key, kind, data }, { upsert: true });
  } catch {
    // Cache write failure shouldn't break the response — we just refetch next time.
  }
}

async function logMetric(outcome: "hit" | "miss", kind: CacheKind): Promise<void> {
  try {
    await connectDB();
    await CacheMetric.create({ outcome, kind });
  } catch {
    // Metrics are best-effort — never block the page on this.
  }
}

export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

export async function fetchBibles(): Promise<BibleTranslation[]> {
  const cacheKey = "bibles:list";
  const cached = await getCached<BibleTranslation[]>(cacheKey);
  if (cached) {
    await logMetric("hit", "bibles");
    return cached;
  }

  try {
    const res = await fetch(`${BASE}/bibles`, {
      headers: apiHeaders(),
      next: { revalidate: 31536000 },
    });
    if (!res.ok) return [];
    const { data } = await res.json();
    const bibles = (data as Array<{ id: string; name: string; abbreviation: string; language: { name: string } }>).map((b) => ({
      id: b.id,
      name: b.name,
      abbreviation: b.abbreviation,
      language: b.language?.name ?? "Unknown",
    }));
    await Promise.all([logMetric("miss", "bibles"), setCached(cacheKey, "bibles", bibles)]);
    return bibles;
  } catch {
    return [];
  }
}

function cleanText(text: string): string {
  // Strip leading "Book Chapter " prefix the API sometimes injects (e.g. "Psalm 23 The Lord...")
  return text.replace(/^[A-Za-z\s]+\d+\s+/, "").trim();
}

function parseVerses(content: string): BibleVerse[] {
  // split with capture group gives: [preamble, verseNum, text, verseNum, text, ...]
  const parts = content.split(/\[(\d+)\]/);
  const verses: BibleVerse[] = [];
  for (let i = 1; i < parts.length - 1; i += 2) {
    const num = parseInt(parts[i]);
    const text = parts[i + 1]?.trim();
    if (!isNaN(num) && text) verses.push({ verse: num, text });
  }
  return verses;
}

export async function fetchChapter(
  bookId: string,
  chapter: string,
  translationId?: string
): Promise<ChapterData | null> {
  const resolvedBibleId = bibleId(translationId);
  const cacheKey = `chapter:${resolvedBibleId}:${bookId}.${chapter}`;
  const cached = await getCached<ChapterData>(cacheKey);
  if (cached) {
    await logMetric("hit", "chapter");
    return cached;
  }

  try {
    const res = await fetch(
      `${BASE}/bibles/${resolvedBibleId}/chapters/${bookId}.${chapter}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
      { headers: apiHeaders(), next: { revalidate: 31536000 } }
    );
    if (!res.ok) return null;
    const { data } = await res.json();
    const chapterData: ChapterData = {
      reference: data.reference,
      verses: parseVerses(data.content || ""),
    };
    if (chapterData.verses.length) {
      await Promise.all([logMetric("miss", "chapter"), setCached(cacheKey, "chapter", chapterData)]);
    }
    return chapterData;
  } catch {
    return null;
  }
}

export async function fetchVerse(
  bookId: string,
  chapter: string,
  verse: string,
  translationId?: string
): Promise<VerseData | null> {
  const resolvedBibleId = bibleId(translationId);
  const cacheKey = `verse:${resolvedBibleId}:${bookId}.${chapter}.${verse}`;
  const cached = await getCached<VerseData>(cacheKey);
  if (cached) {
    await logMetric("hit", "verse");
    return cached;
  }

  try {
    let url: string;
    const isRange = verse.includes("-");
    if (isRange) {
      const [start, end] = verse.split("-");
      const passageId = `${bookId}.${chapter}.${start}-${bookId}.${chapter}.${end}`;
      url = `${BASE}/bibles/${resolvedBibleId}/passages/${passageId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true`;
    } else {
      url = `${BASE}/bibles/${resolvedBibleId}/verses/${bookId}.${chapter}.${verse}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`;
    }
    const res = await fetch(url, {
      headers: apiHeaders(),
      next: { revalidate: 31536000 },
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    const content = cleanText(data.content || "");
    const verseData: VerseData = isRange
      ? { reference: data.reference, text: content, verses: parseVerses(data.content || "") }
      : { reference: data.reference, text: content };
    if (verseData.text) {
      await Promise.all([logMetric("miss", "verse"), setCached(cacheKey, "verse", verseData)]);
    }
    return verseData;
  } catch {
    return null;
  }
}
