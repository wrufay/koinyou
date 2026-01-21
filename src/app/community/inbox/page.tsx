"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface SentVerse {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  reference: string;
  book: string;
  chapter: string;
  verse: string;
  text: string;
  note: string;
  read: boolean;
  createdAt: string;
}

export default function InboxPage() {
  const { user } = useAuth();
  const [verses, setVerses] = useState<SentVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<SentVerse | null>(null);

  useEffect(() => {
    if (user) {
      fetchInbox();
    }
  }, [user]);

  const fetchInbox = async () => {
    try {
      const res = await fetch(`${API_URL}/api/send/inbox`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setVerses(data.verses);
      }
    } catch (error) {
      console.error("Error fetching inbox:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (verseId: string) => {
    try {
      await fetch(`${API_URL}/api/send/read/${verseId}`, {
        method: "POST",
        credentials: "include",
      });
      setVerses((prev) =>
        prev.map((v) => (v._id === verseId ? { ...v, read: true } : v))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const openVerse = (verse: SentVerse) => {
    setSelectedVerse(verse);
    if (!verse.read) {
      markAsRead(verse._id);
    }
  };

  if (!user) return null;

  return (
    <main className="figtree min-h-screen px-5 py-10 bg-gradient-main texture-overlay relative overflow-hidden">
      <div className="decorative-circle w-64 h-64 bg-pine/20 -top-32 -right-32 animate-pulse-soft" />
      <div className="decorative-circle w-48 h-48 bg-olive/15 -bottom-24 -left-24 animate-pulse-soft" />

      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <Link
          href="/community"
          className="figtree-regular inline-flex items-center gap-2 text-xs text-olive hover:text-walnut
                     mb-10 transition-colors duration-300 link-underline opacity-0 animate-fade-in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to community</span>
        </Link>

        {/* Title */}
        <div className="text-center mb-8 opacity-0 animate-fade-in-up stagger-1">
          <h1 className="nanum-pen-script-regular text-5xl text-walnut mb-2 drop-shadow-sm">
            Inbox
          </h1>
          <p className="reenie-beanie-regular text-2xl text-pine">
            Verses from friends
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-pine/30 border-t-pine rounded-full animate-spin" />
          </div>
        ) : verses.length === 0 ? (
          <div className="text-center py-12 opacity-0 animate-fade-in-up stagger-2">
            <svg className="w-10 h-10 mx-auto mb-4 text-olive" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <p className="figtree-regular text-sm text-olive mb-2">
              No verses yet
            </p>
            <p className="figtree-light text-xs text-olive/70">
              When friends send you verses, they&apos;ll appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4 opacity-0 animate-fade-in-up stagger-2">
            {verses.map((verse, index) => (
              <button
                key={verse._id}
                onClick={() => openVerse(verse)}
                className={`w-full text-left glass-card rounded-2xl p-5 transition-all duration-300
                           ${!verse.read ? "border-l-4 border-l-pine" : ""}`}
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  {verse.sender.avatar ? (
                    <img
                      src={verse.sender.avatar}
                      alt={verse.sender.name}
                      className="w-10 h-10 rounded-full border-2 border-white/50"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-pine/20 flex items-center justify-center">
                      <span className="figtree-medium text-pine text-sm">
                        {verse.sender.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="figtree-medium text-sm text-dark-teal">
                        {verse.sender.name}
                      </p>
                      <span className="figtree-light text-xs text-olive">
                        {new Date(verse.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="nanum-pen-script-regular text-xl text-walnut mb-1">
                      {verse.reference}
                    </p>
                    {verse.note && (
                      <p className="figtree-light text-xs text-olive truncate">
                        &ldquo;{verse.note}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Verse Modal */}
      {selectedVerse && (
        <div
          className="fixed inset-0 bg-dark-teal/50 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setSelectedVerse(null)}
        >
          <div
            className="glass-card rounded-3xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto opacity-0 animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              {selectedVerse.sender.avatar ? (
                <img
                  src={selectedVerse.sender.avatar}
                  alt={selectedVerse.sender.name}
                  className="w-12 h-12 rounded-full border-2 border-white/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-pine/20 flex items-center justify-center">
                  <span className="figtree-medium text-pine">
                    {selectedVerse.sender.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="figtree-medium text-dark-teal">
                  {selectedVerse.sender.name}
                </p>
                <p className="figtree-light text-xs text-olive">
                  {new Date(selectedVerse.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h2 className="nanum-pen-script-regular text-3xl text-walnut mb-4">
              {selectedVerse.reference}
            </h2>

            <p className="figtree-regular text-sm text-dark-teal/90 leading-relaxed mb-6">
              {selectedVerse.text}
            </p>

            {selectedVerse.note && (
              <div className="bg-olive/10 rounded-xl p-4 mb-6">
                <p className="figtree-light text-xs text-olive mb-1">Note:</p>
                <p className="figtree-regular text-sm text-dark-teal italic">
                  &ldquo;{selectedVerse.note}&rdquo;
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href={`/verse/${selectedVerse.book}/${selectedVerse.chapter}/${selectedVerse.verse}`}
                className="flex-1 figtree-medium px-4 py-3 rounded-xl bg-pine hover:bg-dark-teal
                           text-white text-sm text-center btn-primary"
              >
                View verse
              </Link>
              <button
                onClick={() => setSelectedVerse(null)}
                className="figtree-medium px-4 py-3 rounded-xl border-2 border-olive/20
                           text-olive hover:text-dark-teal text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center z-10 opacity-0 animate-fade-in stagger-5">
        <p className="figtree-light text-xs text-olive/60">
          koinYOU © 2026
        </p>
      </footer>
    </main>
  );
}
