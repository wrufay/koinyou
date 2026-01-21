"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Parse input like "John 3:16" or "1 John 3:16" into /verse/john/3/16
      const input = query.trim().toLowerCase();
      // Match: optional number + book name, chapter, verse(s)
      const match = input.match(/^(\d?\s*[a-z]+)\s+(\d+):(.+)$/i);
      if (match) {
        const [, book, chapter, verse] = match;
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
    { ref: "Philippians 4:13", path: "philippians/4/13" },
  ];

  return (
    <main className="figtree min-h-screen flex flex-col items-center justify-center px-6 bg-ash relative">
      <div className="absolute top-6 right-6">
        <AuthButton />
      </div>

      <div className="max-w-xl w-full text-center">
        <h1 className="nanum-pen-script-regular text-8xl text-walnut mb-2">
          Bible Search
        </h1>
        <p className="reenie-beanie-regular text-3xl text-olive mb-12">
          Find comfort in His words
        </p>

        <form onSubmit={handleSearch} className="mb-14">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a verse (e.g., John 3:16)"
              className="figtree-regular flex-1 px-5 py-4 rounded-2xl border-2 border-pine/40 bg-white/70
                         focus:outline-none focus:border-dark-teal focus:bg-white/90
                         placeholder:text-olive/50 text-lg text-dark-teal transition-all shadow-sm"
            />
            <button
              type="submit"
              className="figtree-semibold px-8 py-4 rounded-2xl bg-pine hover:bg-dark-teal
                         text-white text-lg transition-all shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <p className="figtree-medium text-sm text-olive/70 uppercase tracking-widest">
            Popular verses
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {exampleVerses.map((verse) => (
              <Link
                key={verse.path}
                href={`/verse/${verse.path}`}
                className="figtree-medium px-5 py-2.5 rounded-full bg-dark-teal/15 hover:bg-pine/30
                           text-dark-teal text-sm transition-all hover:shadow-sm"
              >
                {verse.ref}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer className="reenie-beanie-regular absolute bottom-6 text-xl text-olive/60">
        Powered by bible-api.com
      </footer>
    </main>
  );
}
