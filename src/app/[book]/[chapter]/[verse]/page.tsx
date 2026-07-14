import Link from "next/link";
import BackButton from "@/components/BackButton";
import VerseActions from "@/components/VerseActions";
import TranslationPicker from "@/components/TranslationPicker";
import { fetchVerse, fetchBibles, toBookId } from "@/lib/bible";
import { DEFAULT_BIBLE_ID } from "@/lib/translations";

interface PageProps {
  params: Promise<{ book: string; chapter: string; verse: string }>;
  searchParams: Promise<{ t?: string }>;
}

export default async function VersePage({ params, searchParams }: PageProps) {
  const { book, chapter, verse } = await params;
  const { t } = await searchParams;
  const bibleId = t || DEFAULT_BIBLE_ID;
  const [data, bibles] = await Promise.all([
    fetchVerse(toBookId(book), chapter, verse, bibleId),
    fetchBibles(),
  ]);

  if (!data) {
    return (
      <main className="figtree min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-main texture-overlay relative overflow-hidden">
        <div className="decorative-circle w-72 h-72 bg-olive/20 -top-36 -right-36" />
        <div className="decorative-circle w-56 h-56 bg-pine/15 -bottom-28 -left-28" />
        <div className="max-w-md w-full text-center relative z-10 opacity-0 animate-fade-in-up">
          <h1 className="nanum-pen-script-regular text-5xl text-walnut mb-4 drop-shadow-sm">Verse not found</h1>
          <p className="figtree-regular text-sm text-olive mb-8">We couldn&apos;t find that verse. Please check the reference and try again.</p>
          <Link href="/" className="figtree-medium px-6 py-3 rounded-2xl bg-pine hover:bg-dark-teal text-white text-sm shadow-lg btn-primary inline-block">
            Go back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="figtree min-h-screen flex flex-col items-center justify-center px-5 py-12 bg-gradient-main texture-overlay relative overflow-hidden">
      <div className="decorative-circle w-80 h-80 bg-pine/25 -top-40 -right-40 animate-pulse-soft" />
      <div className="decorative-circle w-64 h-64 bg-olive/15 -bottom-32 -left-32 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

      <div className="max-w-lg w-full relative z-10">
        <div className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in">
          <BackButton />
          <span className="text-olive/30 text-xs">·</span>
          <Link href={`/${book}/${chapter}`} className="figtree-regular text-xs text-olive hover:text-walnut transition-colors duration-300 link-underline capitalize">
            {book} {chapter}
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 sm:p-10 opacity-0 animate-fade-in-up stagger-1">
          <h1 className="nanum-pen-script-regular text-4xl sm:text-5xl text-walnut mb-3 text-center drop-shadow-sm">
            {data.reference}
          </h1>

          <div className="text-center mb-6">
            <TranslationPicker current={bibleId} bibles={bibles} />
          </div>

          {data.verses ? (
            <div className="space-y-4 opacity-0 animate-fade-in stagger-2">
              {data.verses.map((v) => (
                <p key={v.verse} className="figtree-regular text-base leading-relaxed text-dark-teal/90">
                  <span className="figtree-semibold text-pine text-xs align-super mr-1.5">{v.verse}</span>
                  {v.text}
                </p>
              ))}
            </div>
          ) : (
            <p className="figtree-regular text-base leading-relaxed text-dark-teal/90 text-center opacity-0 animate-fade-in stagger-2">
              {data.text}
            </p>
          )}

          <div className="mt-10 pt-6 border-t border-olive/15">
            <VerseActions reference={data.reference} book={book} chapter={chapter} verse={verse} text={data.text} />
          </div>
        </div>

      </div>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { book, chapter, verse } = await params;
  return {
    title: `${book} ${chapter}:${verse} — koinYOU`,
    description: `Read ${book} ${chapter}:${verse} from the Bible`,
  };
}
