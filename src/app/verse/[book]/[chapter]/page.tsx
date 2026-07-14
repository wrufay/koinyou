import Link from "next/link";
import VerseActions from "@/components/VerseActions";
import { fetchChapter, toBookId } from "@/lib/bible";

interface PageProps {
  params: Promise<{ book: string; chapter: string }>;
}

export default async function ChapterPage({ params }: PageProps) {
  const { book, chapter } = await params;
  const bookId = toBookId(book);
  const data = await fetchChapter(bookId, chapter);

  if (!data || !data.verses?.length) {
    return (
      <main className="figtree min-h-screen flex flex-col items-center justify-center px-5 bg-gradient-main texture-overlay relative overflow-hidden">
        <div className="decorative-circle w-72 h-72 bg-olive/20 -top-36 -right-36" />
        <div className="decorative-circle w-56 h-56 bg-pine/15 -bottom-28 -left-28" />
        <div className="max-w-md w-full text-center relative z-10 opacity-0 animate-fade-in-up">
          <h1 className="nanum-pen-script-regular text-5xl text-walnut mb-4 drop-shadow-sm">Chapter not found</h1>
          <p className="figtree-regular text-sm text-olive mb-8">Check the reference and try again.</p>
          <Link href="/" className="figtree-medium px-6 py-3 rounded-2xl bg-pine hover:bg-dark-teal text-white text-sm shadow-lg btn-primary inline-block">
            Go back home
          </Link>
        </div>
      </main>
    );
  }

  const fullText = data.verses.map((v) => v.text).join(" ");

  return (
    <main className="figtree min-h-screen px-5 py-12 bg-gradient-main texture-overlay relative overflow-hidden">
      <div className="decorative-circle w-80 h-80 bg-pine/25 -top-40 -right-40 animate-pulse-soft" />
      <div className="decorative-circle w-64 h-64 bg-olive/15 -bottom-32 -left-32 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

      <div className="max-w-lg mx-auto relative z-10">
        <Link
          href="/"
          className="figtree-regular inline-flex items-center gap-2 text-xs text-olive hover:text-walnut
                     mb-8 transition-colors duration-300 link-underline opacity-0 animate-fade-in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to search
        </Link>

        {/* Main card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 opacity-0 animate-fade-in-up stagger-1 mb-4">
          <h1 className="nanum-pen-script-regular text-4xl sm:text-5xl text-walnut mb-2 text-center drop-shadow-sm">
            {data.reference}
          </h1>
          <p className="figtree-light text-xs text-olive/60 text-center mb-8">
            {data.verses.length} verses
          </p>

          <div className="space-y-4">
            {data.verses.map((v) => (
              <p key={v.verse} className="figtree-regular text-base leading-relaxed text-dark-teal/90">
                <span className="figtree-semibold text-pine text-xs align-super mr-1.5">{v.verse}</span>
                {v.text}
              </p>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-olive/15">
            <p className="reenie-beanie-regular text-xl text-olive text-center mb-5">New International Version</p>
            <VerseActions reference={data.reference} book={book} chapter={chapter} verse="1" text={fullText} />
          </div>
        </div>

        {/* Jump to verse */}
        <div className="glass-card rounded-3xl p-6 opacity-0 animate-fade-in-up stagger-2 mb-4">
          <p className="figtree-medium text-xs text-olive uppercase tracking-widest mb-3">Jump to verse</p>
          <div className="flex flex-wrap gap-2">
            {data.verses.slice(0, 30).map((v) => (
              <Link
                key={v.verse}
                href={`/verse/${book}/${chapter}/${v.verse}`}
                className="figtree-medium px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80
                           border border-pine/20 hover:border-pine/40 text-dark-teal text-xs tag-hover"
              >
                {v.verse}
              </Link>
            ))}
            {data.verses.length > 30 && (
              <span className="figtree-light text-xs text-olive/60 self-center">
                +{data.verses.length - 30} more
              </span>
            )}
          </div>
        </div>

        {/* Chapter nav */}
        <div className="glass-card rounded-3xl p-6 opacity-0 animate-fade-in-up stagger-3 mb-8">
          <p className="figtree-medium text-xs text-olive uppercase tracking-widest mb-3">Navigate chapters</p>
          <div className="flex gap-2">
            {parseInt(chapter) > 1 && (
              <Link
                href={`/verse/${book}/${parseInt(chapter) - 1}`}
                className="figtree-medium px-4 py-2 rounded-xl bg-white/50 hover:bg-white/80
                           border border-pine/20 hover:border-pine/40 text-dark-teal text-xs tag-hover"
              >
                ← Ch. {parseInt(chapter) - 1}
              </Link>
            )}
            <Link
              href={`/verse/${book}/${parseInt(chapter) + 1}`}
              className="figtree-medium px-4 py-2 rounded-xl bg-white/50 hover:bg-white/80
                         border border-pine/20 hover:border-pine/40 text-dark-teal text-xs tag-hover"
            >
              Ch. {parseInt(chapter) + 1} →
            </Link>
          </div>
        </div>

        <div className="text-center opacity-0 animate-fade-in stagger-4">
          <Link
            href="/"
            className="figtree-medium px-5 py-2.5 rounded-full bg-white/50 hover:bg-white/80
                       backdrop-blur-sm border border-olive/20 hover:border-pine/40
                       text-dark-teal text-xs tag-hover inline-block"
          >
            Search another passage
          </Link>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { book, chapter } = await params;
  return {
    title: `${book} ${chapter} — koinYOU`,
    description: `Read ${book} chapter ${chapter}`,
  };
}
