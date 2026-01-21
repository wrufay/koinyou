"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface SaveVerseButtonProps {
  reference: string;
  book: string;
  chapter: string;
  verse: string;
  text: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function SaveVerseButton({
  reference,
  book,
  chapter,
  verse,
  text,
}: SaveVerseButtonProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfSaved();
    }
  }, [user, reference]);

  const checkIfSaved = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/verses/is-saved/${encodeURIComponent(reference)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setIsSaved(data.isSaved);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const toggleSave = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      if (isSaved) {
        await fetch(`${API_URL}/api/verses/save`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reference }),
        });
        setIsSaved(false);
        setJustSaved(false);
      } else {
        await fetch(`${API_URL}/api/verses/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reference, book, chapter, verse, text }),
        });
        setIsSaved(true);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 600);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleSave}
      disabled={isLoading}
      className={`group flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full
                  transition-all duration-300 backdrop-blur-sm
                  ${
                    isSaved
                      ? "bg-walnut/15 text-walnut border border-walnut/20"
                      : "bg-white/50 text-olive border border-olive/20 hover:bg-white/70 hover:border-pine/30 hover:text-pine"
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                  ${!isLoading && !isSaved ? "tag-hover" : ""}`}
      title={isSaved ? "Remove from saved" : "Save verse"}
    >
      <svg
        className={`w-4 h-4 transition-all duration-300
                    ${justSaved ? "heart-saved" : ""}
                    ${isSaved ? "" : "group-hover:scale-110"}`}
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={isSaved ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span className="figtree-medium text-xs">
        {isSaved ? "Saved" : "Save"}
      </span>
    </button>
  );
}
