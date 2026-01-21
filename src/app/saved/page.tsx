"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthButton from "@/components/AuthButton";

interface SavedVerse {
  _id: string;
  reference: string;
  book: string;
  chapter: string;
  verse: string;
  text: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedVerses();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchSavedVerses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/verses/saved`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSavedVerses(data.savedVerses);
      }
    } catch (error) {
      console.error("Error fetching saved verses:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeVerse = async (reference: string) => {
    try {
      await fetch(`${API_URL}/api/verses/save`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reference }),
      });
      setSavedVerses((prev) => prev.filter((v) => v.reference !== reference));
    } catch (error) {
      console.error("Error removing verse:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="figtree min-h-screen flex flex-col items-center justify-center px-5 bg-gradient-main texture-overlay">
        <div className="animate-float">
          <div className="w-8 h-8 border-2 border-pine/30 border-t-pine rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="figtree min-h-screen flex flex-col items-center justify-center px-5 bg-gradient-main texture-overlay relative overflow-hidden">
        <div className="decorative-circle w-64 h-64 bg-olive/20 -top-32 -right-32" />
        <div className="decorative-circle w-48 h-48 bg-pine/15 -bottom-24 -left-24" />

        <div className="max-w-sm w-full text-center relative z-10 opacity-0 animate-fade-in-up">
          <h1 className="nanum-pen-script-regular text-5xl text-walnut mb-4 drop-shadow-sm">
            Your Saved Verses
          </h1>
          <p className="figtree-regular text-sm text-olive mb-8">
            Sign in to save and collect verses that speak to your heart
          </p>
          <div className="mb-8">
            <AuthButton />
          </div>
          <Link
            href="/"
            className="figtree-regular text-xs text-olive hover:text-walnut transition-colors link-underline"
          >
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="figtree min-h-screen px-5 py-10 bg-gradient-main texture-overlay relative overflow-hidden">
      {/* Decorative elements */}
      <div className="decorative-circle w-72 h-72 bg-pine/20 -top-36 -right-36 animate-pulse-soft" />
      <div className="decorative-circle w-56 h-56 bg-olive/15 -bottom-28 -left-28 animate-pulse-soft" style={{ animationDelay: "1s" }} />
      <div className="decorative-circle w-32 h-32 bg-walnut/10 top-1/2 -right-16 animate-float" />

      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 opacity-0 animate-fade-in">
          <Link
            href="/"
            className="figtree-regular inline-flex items-center gap-2 text-xs text-olive hover:text-walnut transition-colors link-underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </Link>
          <AuthButton />
        </div>

        {/* Title */}
        <div className="text-center mb-10 opacity-0 animate-fade-in-up stagger-1">
          <h1 className="nanum-pen-script-regular text-5xl text-walnut mb-3 drop-shadow-sm">
            Saved Verses
          </h1>
          <p className="reenie-beanie-regular text-2xl text-pine">
            Treasures of the heart
          </p>
        </div>

        {/* Content */}
        {savedVerses.length === 0 ? (
          <div className="text-center py-16 opacity-0 animate-fade-in-up stagger-2">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-olive/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="figtree-regular text-sm text-olive mb-6">
              No saved verses yet
            </p>
            <Link
              href="/"
              className="figtree-medium px-6 py-3 rounded-2xl bg-pine hover:bg-dark-teal
                         text-white text-sm shadow-lg btn-primary inline-block"
            >
              Discover verses to save
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedVerses.map((verse, index) => (
              <div
                key={verse._id}
                className="glass-card rounded-2xl p-5 transition-all duration-500 opacity-0 animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.08}s` }}
              >
                <Link href={`/verse/${verse.book}/${verse.chapter}/${verse.verse}`}>
                  <h3 className="nanum-pen-script-regular text-2xl text-walnut mb-2 hover:text-pine transition-colors duration-300">
                    {verse.reference}
                  </h3>
                </Link>
                <p className="figtree-regular text-sm text-dark-teal/80 leading-relaxed mb-4 line-clamp-3">
                  {verse.text}
                </p>
                <div className="flex items-center justify-between">
                  <span className="figtree-light text-xs text-olive">
                    Saved {new Date(verse.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => removeVerse(verse.reference)}
                    className="figtree-medium text-xs text-olive/60 hover:text-walnut transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
