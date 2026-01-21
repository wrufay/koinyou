import Link from "next/link";

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
      <main className="figtree min-h-screen flex flex-col items-center justify-center px-6 bg-ash">
        <div className="max-w-xl w-full text-center">
          <h1 className="nanum-pen-script-regular text-6xl text-walnut mb-4">
            Verse not found
          </h1>
          <p className="figtree-regular text-olive mb-8">
            We couldn&apos;t find that verse. Please check the reference and try again.
          </p>
          <Link
            href="/"
            className="figtree-medium px-6 py-3 rounded-full bg-pine hover:bg-dark-teal
                       text-white transition-all shadow-md hover:shadow-lg"
          >
            Go back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="figtree min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-ash">
      <div className="max-w-2xl w-full">
        <Link
          href="/"
          className="figtree-regular inline-flex items-center gap-2 text-dark-teal/60 hover:text-dark-teal
                     mb-8 transition-colors"
        >
          <span>&larr;</span>
          <span>Back to search</span>
        </Link>

        <div className="bg-white/80 rounded-3xl p-8 sm:p-12 shadow-lg border border-pine/20">
          <h1 className="nanum-pen-script-regular text-6xl sm:text-7xl text-walnut mb-8 text-center">
            {data.reference}
          </h1>

          <div className="space-y-5">
            {data.verses && data.verses.length > 0 ? (
              data.verses.map((v, index) => (
                <p key={index} className="figtree-regular text-lg sm:text-xl leading-relaxed text-dark-teal">
                  <span className="figtree-bold text-olive text-sm align-super mr-1.5">
                    {v.verse}
                  </span>
                  {v.text}
                </p>
              ))
            ) : (
              <p className="figtree-regular text-lg sm:text-xl leading-relaxed text-dark-teal text-center">
                {data.text}
              </p>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-olive/30 text-center">
            <p className="reenie-beanie-regular text-xl text-olive">
              {data.translation_name || "World English Bible"}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="figtree-medium px-6 py-3 rounded-full bg-pine hover:bg-dark-teal
                       text-white transition-all inline-block shadow-md hover:shadow-lg"
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
