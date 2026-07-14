"use client";

import { useState } from "react";
import SaveVerseButton from "./SaveVerseButton";
import SendVerseButton from "./SendVerseButton";

interface VerseActionsProps {
  reference: string;
  book: string;
  chapter: string;
  verse: string;
  text: string;
}

function CopyButton({ reference, text }: { reference: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(`${reference} — ${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="group flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full
                 transition-all duration-300 backdrop-blur-sm
                 bg-white/50 text-olive border border-olive/20 hover:bg-white/70 hover:border-pine/30 hover:text-pine tag-hover"
    >
      <svg className="w-4 h-4 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {copied
          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        }
      </svg>
      <span className="figtree-medium text-sm">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export default function VerseActions({
  reference,
  book,
  chapter,
  verse,
  text,
}: VerseActionsProps) {
  return (
    <div>
      <p className="figtree-light text-xs text-olive/50 text-center mb-4 tracking-wide">like this passage?</p>
      <div className="flex justify-center gap-3 flex-wrap">
      <CopyButton reference={reference} text={text} />
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
    </div>
  );
}
