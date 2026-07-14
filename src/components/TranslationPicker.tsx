"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { BibleTranslation } from "@/lib/bible";

interface Props {
  current: string;
  bibles: BibleTranslation[];
}

export default function TranslationPicker({ current, bibles }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentName = bibles.find((b) => b.id === current)?.name ?? "New International Version";

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return q
      ? bibles.filter((b) => b.name.toLowerCase().includes(q) || b.abbreviation.toLowerCase().includes(q) || b.language.toLowerCase().includes(q))
      : bibles;
  }, [bibles, query]);

  const select = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("t", id);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="reenie-beanie-regular text-xl text-olive hover:text-pine transition-colors duration-200 inline-flex items-center gap-1"
      >
        {currentName}
        <svg
          className="w-3 h-3 opacity-50 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#e8ede8] rounded-2xl p-2 w-64 shadow-lg border border-olive/20">
            <div className="px-2 pb-2 pt-1">
              <input
                autoFocus
                type="text"
                placeholder="Search translations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full figtree-regular text-sm text-dark-teal bg-white rounded-xl px-3 py-2
                           border border-olive/20 focus:outline-none focus:border-pine/40 placeholder:text-olive/40"
              />
            </div>
            <div className="overflow-y-auto max-h-56">
              {filtered.length === 0 && (
                <p className="figtree-light text-xs text-olive/50 text-center py-4">No results</p>
              )}
              {filtered.map((b) => {
                const active = b.id === current;
                return (
                  <button
                    key={b.id}
                    onClick={() => select(b.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-3 transition-colors duration-150
                      ${active ? "bg-pine/10 text-pine" : "text-dark-teal/70 hover:bg-olive/10"}`}
                  >
                    <span className="figtree-regular text-sm truncate">{b.name}</span>
                    <span className={`figtree-semibold text-xs px-2 py-0.5 rounded-full shrink-0 ${active ? "bg-pine/15 text-pine" : "bg-olive/10 text-olive"}`}>
                      {b.abbreviation}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
