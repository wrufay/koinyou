"use client";

import SaveVerseButton from "./SaveVerseButton";
import SendVerseButton from "./SendVerseButton";

interface VerseActionsProps {
  reference: string;
  book: string;
  chapter: string;
  verse: string;
  text: string;
}

export default function VerseActions({
  reference,
  book,
  chapter,
  verse,
  text,
}: VerseActionsProps) {
  return (
    <div className="flex justify-center gap-3 flex-wrap">
      <SaveVerseButton
        reference={reference}
        book={book}
        chapter={chapter}
        verse={verse}
        text={text}
      />
      <SendVerseButton
        reference={reference}
        book={book}
        chapter={chapter}
        verse={verse}
        text={text}
      />
    </div>
  );
}
