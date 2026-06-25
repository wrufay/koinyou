import { Suspense } from "react";
import Link from "next/link";
import VerseActions from "@/components/VerseActions";
import { OpenBook } from "@/components/Illustration";
import TranslationPicker from "@/components/TranslationPicker"
import { TRANSLATIONS } from "@/lib/translations";

interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleResponse {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translation_name: string;
}

interface PageProps {
  params: Promise<{ book: string; chapter: string }>;
  searchParams: Promise<{ translation?: string }>;
}

async function getChapter(
  book: string,
  chapter: string,
  translation: string
): Promise<BibleResponse | null> {
  try {
    const res = await fetch(
      `https://bible-api.com/${book}+${chapter}?translation=${translation}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ChapterPage({ params, searchParams }: PageProps) {
  const { book, chapter } = await params;
  const { translation = "web" } = await searchParams;

  const data = await getChapter(book, chapter, translation);

  if (!data || !data.verses?.length) {
    return (
      <main className="g-page min-h-screen flex flex-col items-center justify-center px-5">
        <div
          className="g-card p-10 text-center"
          style={{ maxWidth: "24rem", width: "100%" }}
        >
          <p className="g-tag mb-3" style={{ justifyContent: "center" }}>☆</p>
          <h1 className="fredoka mb-3" style={{ fontSize: "2rem", color: "var(--cream-text)" }}>
            Chapter not found
          </h1>
          <p className="nunito text-sm mb-6" style={{ color: "var(--cream-muted)", fontWeight: 600 }}>
            Check the reference and try again.
          </p>
          <Link href="/" className="g-btn g-btn-primary">Back to search</Link>
        </div>
      </main>
    );
  }

  const fullText = data.verses.map((v) => v.text).join(" ");
  const translationName =
    TRANSLATIONS.find((t) => t.id === translation)?.name ||
    data.translation_name ||
    "World English Bible";

  const transParam = translation !== "web" ? `?translation=${translation}` : "";

  return (
    <main className="g-page min-h-screen flex flex-col">
      <div className="g-grain" />

      {/* Header */}
      <header className="g-header">
        <div className="g-header-inner">
          <Link href="/" className="g-back-link">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Search
          </Link>
          <span className="g-logo">koinYOU</span>
        </div>
      </header>

      <div className="g-container py-10 flex-1" style={{ maxWidth: "36rem" }}>

        {/* Title */}
        <div className="mb-8 flex items-end gap-4">
          <div className="flex-1">
            <p className="g-tag mb-2">☆ &nbsp; full chapter</p>
            <h1
              className="fredoka"
              style={{
                fontSize: "clamp(2.2rem, 8vw, 3.5rem)",
                fontWeight: 700,
                color: "var(--cream)",
                lineHeight: 1.05,
              }}
            >
              {data.reference}
            </h1>
            <p className="reenie mt-1" style={{ fontSize: "1.3rem", color: "rgba(244,234,200,0.4)" }}>
              {data.verses.length} verses · {translationName}
            </p>
          </div>
          <OpenBook className="w-20 h-16 opacity-50 shrink-0" />
        </div>

        {/* Verse list */}
        <div
          className="g-card p-6 sm:p-8 mb-5"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {data.verses.map((v, i) => (
              <div
                key={v.verse}
                className="opacity-0"
                style={{
                  display: "flex",
                  gap: "0.85rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  className="fredoka shrink-0"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--rust)",
                    background: "rgba(200,90,40,0.1)",
                    borderRadius: "999px",
                    padding: "0.2rem 0.55rem",
                    marginTop: "0.22rem",
                    minWidth: "2rem",
                    textAlign: "center",
                  }}
                >
                  {v.verse}
                </span>
                <p
                  className="nunito"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "var(--cream-mid)",
                    lineHeight: 1.75,
                  }}
                >
                  {v.text}
                </p>
              </div>
            ))}
          </div>

          {/* Translation + save/send */}
          <div
            style={{
              borderTop: "1.5px solid rgba(42,28,12,0.08)",
              marginTop: "2rem",
              paddingTop: "1.5rem",
            }}
          >
            <div className="flex justify-center mb-5">
              <Suspense
                fallback={
                  <span className="reenie" style={{ fontSize: "1.3rem", color: "var(--cream-hint)" }}>
                    {translationName}
                  </span>
                }
              >
                <TranslationPicker current={translation} translationName={translationName} />
              </Suspense>
            </div>

            <VerseActions
              reference={data.reference}
              book={book}
              chapter={chapter}
              verse="1"
              text={fullText}
            />
          </div>
        </div>

        {/* Jump to verse */}
        <div className="g-card p-5 mb-5">
          <p className="g-label-cream mb-3">Jump to verse</p>
          <div className="flex flex-wrap gap-2">
            {data.verses.slice(0, 30).map((v) => (
              <Link
                key={v.verse}
                href={`/verse/${book}/${chapter}/${v.verse}${transParam}`}
                className="g-chip-cream"
              >
                {v.verse}
              </Link>
            ))}
            {data.verses.length > 30 && (
              <span
                className="nunito text-xs"
                style={{ color: "var(--cream-hint)", fontWeight: 600, alignSelf: "center" }}
              >
                +{data.verses.length - 30} more
              </span>
            )}
          </div>
        </div>

        {/* Chapter nav */}
        <div className="g-card p-5 mb-5">
          <p className="g-label-cream mb-3">Navigate chapters</p>
          <div className="flex flex-wrap gap-2">
            {parseInt(chapter) > 1 && (
              <Link
                href={`/verse/${book}/${parseInt(chapter) - 1}${transParam}`}
                className="g-btn-ghost-cream"
              >
                ← Ch. {parseInt(chapter) - 1}
              </Link>
            )}
            <Link
              href={`/verse/${book}/${parseInt(chapter) + 1}${transParam}`}
              className="g-btn-ghost-cream"
            >
              Ch. {parseInt(chapter) + 1} →
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="g-chip">Search another passage</Link>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { book, chapter } = await params;
  const { translation = "web" } = await searchParams;
  const t = TRANSLATIONS.find((t) => t.id === translation);
  return {
    title: `${book} ${chapter}${t ? ` (${t.short})` : ""} — koinYOU`,
    description: `Read ${book} chapter ${chapter}`,
  };
}
