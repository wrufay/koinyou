import Link from "next/link";
import VerseActions from "@/components/VerseActions";

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
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

interface PageProps {
  params: Promise<{ book: string; chapter: string; verse: string }>;
}

async function getVerse(
  book: string,
  chapter: string,
  verse: string
): Promise<BibleResponse | null> {
  try {
    const reference = `${book}+${chapter}:${verse}`;
    const res = await fetch(`https://bible-api.com/${reference}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function VersePage({ params }: PageProps) {
  const { book, chapter, verse: verseNum } = await params;
  const data = await getVerse(book, chapter, verseNum);

  if (!data) {
    return (
      <main className="figtree min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-main texture-overlay relative overflow-hidden">
        <div className="decorative-circle w-72 h-72 bg-olive/20 -top-36 -right-36" />
        <div className="decorative-circle w-56 h-56 bg-pine/15 -bottom-28 -left-28" />

        <div className="max-w-md w-full text-center relative z-10 opacity-0 animate-fade-in-up">
          <h1 className="nanum-pen-script-regular text-5xl text-walnut mb-4 drop-shadow-sm">
            Verse not found
          </h1>
          <p className="figtree-regular text-sm text-olive mb-8">
            We couldn&apos;t find that verse. Please check the reference and try again.
          </p>
          <Link
            href="/"
            className="figtree-medium px-6 py-3 rounded-2xl bg-pine hover:bg-dark-teal
                       text-white text-sm shadow-lg btn-primary inline-block"
          >
            Go back home
          </Link>
        </div>
      </main>
    );
  }

  const verseText = data.verses?.map((v) => v.text).join(" ") || data.text;

  return (
    <main className="figtree min-h-screen flex flex-col items-center justify-center px-5 py-12 bg-gradient-main texture-overlay relative overflow-hidden">
      {/* Decorative elements */}
      <div className="decorative-circle w-80 h-80 bg-pine/25 -top-40 -right-40 animate-pulse-soft" />
      <div className="decorative-circle w-64 h-64 bg-olive/15 -bottom-32 -left-32 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
      <div className="decorative-circle w-40 h-40 bg-walnut/10 top-1/4 -right-20 animate-float" />

      <div className="max-w-lg w-full relative z-10">
        {/* Back link */}
        <Link
          href="/"
          className="figtree-regular inline-flex items-center gap-2 text-xs text-olive hover:text-walnut
                     mb-8 transition-colors duration-300 link-underline opacity-0 animate-fade-in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to search</span>
        </Link>

        {/* Main card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 transition-all duration-500 opacity-0 animate-fade-in-up stagger-1">
          {/* Reference title */}
          <h1 className="nanum-pen-script-regular text-4xl sm:text-5xl text-walnut mb-8 text-center drop-shadow-sm">
            {data.reference}
          </h1>

          {/* Verse content */}
          <div className="space-y-4">
            {data.verses && data.verses.length > 0 ? (
              data.verses.map((v, index) => (
                <p
                  key={index}
                  className="figtree-regular text-base leading-relaxed text-dark-teal/90 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <span className="figtree-semibold text-pine text-xs align-super mr-1.5">
                    {v.verse}
                  </span>
                  {v.text}
                </p>
              ))
            ) : (
              <p className="figtree-regular text-base leading-relaxed text-dark-teal/90 text-center">
                {data.text}
              </p>
            )}
          </div>

          {/* Divider and translation */}
          <div className="mt-10 pt-6 border-t border-olive/15">
            <p className="reenie-beanie-regular text-xl text-olive text-center mb-5">
              {data.translation_name || "World English Bible"}
            </p>
            <VerseActions
              reference={data.reference}
              book={book}
              chapter={chapter}
              verse={verseNum}
              text={verseText}
            />
          </div>
        </div>

        {/* Bottom action */}
        <div className="mt-8 text-center opacity-0 animate-fade-in stagger-3">
          <Link
            href="/"
            className="figtree-medium px-5 py-2.5 rounded-full
                       bg-white/50 hover:bg-white/80 backdrop-blur-sm
                       border border-olive/20 hover:border-pine/40
                       text-dark-teal text-xs tag-hover inline-block"
          >
            Search another verse
          </Link>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { book, chapter, verse } = await params;
  const reference = `${book} ${chapter}:${verse}`;

  return {
    title: `${reference} - Bible Search`,
    description: `Read ${reference} from the Bible`,
  };
}
