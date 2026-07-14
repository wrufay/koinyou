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
}

const BASE = "https://api.scripture.api.bible/v1";

function bibleId() {
  // Once you have your api.bible key, find the NIV ID by calling:
  // GET /v1/bibles?abbreviation=NIV with your api-key header
  return process.env.NIV_ID || "de4e12af7f28f599-02"; // KJV fallback
}

function apiHeaders(): HeadersInit {
  return { "api-key": process.env.BIBLE_API_KEY || "" };
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
  chapter: string
): Promise<ChapterData | null> {
  try {
    const res = await fetch(
      `${BASE}/bibles/${bibleId()}/chapters/${bookId}.${chapter}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
      { headers: apiHeaders(), next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const { data } = await res.json();
    return {
      reference: data.reference,
      verses: parseVerses(data.content || ""),
    };
  } catch {
    return null;
  }
}

export async function fetchVerse(
  bookId: string,
  chapter: string,
  verse: string
): Promise<VerseData | null> {
  try {
    let url: string;
    if (verse.includes("-")) {
      const [start, end] = verse.split("-");
      const passageId = `${bookId}.${chapter}.${start}-${bookId}.${chapter}.${end}`;
      url = `${BASE}/bibles/${bibleId()}/passages/${passageId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`;
    } else {
      url = `${BASE}/bibles/${bibleId()}/verses/${bookId}.${chapter}.${verse}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`;
    }
    const res = await fetch(url, {
      headers: apiHeaders(),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return { reference: data.reference, text: data.content?.trim() || "" };
  } catch {
    return null;
  }
}
