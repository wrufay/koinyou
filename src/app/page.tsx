"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const input = query.trim().toLowerCase();
      // Match patterns like "John 3:16", "1 Corinthians 13:4", "1cor 13:4-7"
      const match = input.match(/^(\d?\s*[a-z]+(?:\s+[a-z]+)?)\s+(\d+):(.+)$/i);
      if (match) {
        const [, book, chapter, verse] = match;
        // Replace spaces with hyphens for URL, handle "1 corinthians" -> "1-corinthians"
        const cleanBook = book.replace(/\s+/g, "-").trim();
        const cleanVerse = verse.trim();
        router.push(`/verse/${cleanBook}/${chapter}/${cleanVerse}`);
      }
    }
  };

  const exampleVerses = [
    { ref: "John 3:16", path: "john/3/16" },
    { ref: "Psalm 23:1", path: "psalm/23/1" },
    { ref: "Romans 8:28", path: "romans/8/28" },
    { ref: "Phil 4:13", path: "philippians/4/13" },
  ];

  return (
    <main className="figtree min-h-screen flex flex-col items-center justify-center px-5 bg-gradient-main texture-overlay relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="decorative-circle w-96 h-96 bg-pine/30 -top-48 -right-48 animate-pulse-soft" />
      <div className="decorative-circle w-72 h-72 bg-olive/20 -bottom-36 -left-36 animate-pulse-soft" style={{ animationDelay: "1s" }} />
      <div className="decorative-circle w-48 h-48 bg-walnut/10 top-1/3 -left-24 animate-float" />

      {/* Header */}
      <div className="absolute top-5 right-5 flex items-center gap-4 z-10">
        {user && (
          <Link
            href="/saved"
            className="figtree-medium text-xs text-olive hover:text-walnut transition-colors link-underline"
          >
            Saved
          </Link>
        )}
        <AuthButton />
      </div>

      {/* Main content */}
      <div className="max-w-md w-full text-center relative z-10">
        <div className="opacity-0 animate-fade-in-up">
          <h1 className="nanum-pen-script-regular text-6xl sm:text-7xl text-walnut mb-3 drop-shadow-sm">
            koinYOU
          </h1>
          <p className="reenie-beanie-regular text-2xl sm:text-3xl text-pine mb-3">
            Live and breathe God&apos;s word, together.
          </p>
          <p className="figtree-light text-xs text-olive/80 mb-12">
            Because there&apos;s no <Link href="/about" className="figtree-semibold text-pine hover:text-dark-teal transition-colors link-underline">koinonia</Link> without <Link href="/join" className="figtree-medium text-walnut hover:text-pine transition-colors link-underline">you</Link>.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-12 opacity-0 animate-fade-in-up stagger-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a verse (e.g., John 3:16)"
              className="figtree-regular flex-1 px-5 py-3.5 rounded-2xl border-2 border-olive/20
                         bg-white/70 backdrop-blur-sm
                         focus:outline-none focus:border-pine focus:bg-white/90
                         placeholder:text-olive/40 text-sm text-dark-teal
                         transition-all duration-300 input-glow"
            />
            <button
              type="submit"
              className="figtree-medium px-7 py-3.5 rounded-2xl bg-pine hover:bg-dark-teal
                         text-white text-sm shadow-lg btn-primary"
            >
              Search
            </button>
          </div>
        </form>

        <div className="space-y-4 opacity-0 animate-fade-in-up stagger-3">
          <p className="figtree-medium text-xs text-olive uppercase tracking-widest">
            Popular verses
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {exampleVerses.map((verse, index) => (
              <Link
                key={verse.path}
                href={`/verse/${verse.path}`}
                className="figtree-medium px-4 py-2 rounded-full
                           bg-white/50 hover:bg-white/80 backdrop-blur-sm
                           border border-pine/20 hover:border-pine/40
                           text-dark-teal text-xs tag-hover
                           opacity-0 animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.08}s` }}
              >
                {verse.ref}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 z-10 opacity-0 animate-fade-in stagger-5">
        <p className="figtree-light text-xs text-olive/60">
          koinYOU © 2026
        </p>
      </footer>
    </main>
  );
}
