"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function CheckinPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [verseReference, setVerseReference] = useState("");
  const [reflection, setReflection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/devotions/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ verseReference, reflection }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/community"), 1500);
      }
    } catch (error) {
      console.error("Error checking in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  if (success) {
    return (
      <main className="figtree min-h-screen flex flex-col items-center justify-center px-5 bg-gradient-main texture-overlay">
        <div className="text-center opacity-0 animate-fade-in-up">
          <svg className="w-16 h-16 mx-auto mb-4 text-walnut" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.75 2.25c0 4.5-3 6.75-3 10.5a3 3 0 106 0c0-1.5-.75-3-1.5-4.5.75 3 .75 6 0 7.5a4.5 4.5 0 01-3 1.5 4.5 4.5 0 01-4.5-4.5c0-3 1.5-6 4.5-9a13.5 13.5 0 011.5-1.5z"/>
            <path d="M15.75 12.75c0 2.25-1.5 4.5-3.75 4.5s-3.75-2.25-3.75-4.5c0-2.25 1.5-5.25 3.75-7.5 2.25 2.25 3.75 5.25 3.75 7.5z" fillOpacity="0.3"/>
          </svg>
          <h1 className="nanum-pen-script-regular text-4xl text-walnut mb-2">
            You&apos;re on fire!
          </h1>
          <p className="figtree-regular text-sm text-olive">
            Keep the streak going!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="figtree min-h-screen px-5 py-10 bg-gradient-main texture-overlay relative overflow-hidden">
      <div className="decorative-circle w-64 h-64 bg-pine/20 -top-32 -right-32 animate-pulse-soft" />
      <div className="decorative-circle w-48 h-48 bg-olive/15 -bottom-24 -left-24 animate-pulse-soft" style={{ animationDelay: "1s" }} />

      <div className="max-w-md mx-auto relative z-10">
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
            Daily Check-in
          </h1>
          <p className="reenie-beanie-regular text-2xl text-pine">
            What&apos;s God teaching you today?
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 opacity-0 animate-fade-in-up stagger-2">
          <div className="glass-card rounded-2xl p-6">
            <label className="block figtree-medium text-sm text-dark-teal mb-2">
              Today&apos;s verse (optional)
            </label>
            <input
              type="text"
              value={verseReference}
              onChange={(e) => setVerseReference(e.target.value)}
              placeholder="e.g., John 3:16"
              className="figtree-regular w-full px-4 py-3 rounded-xl border-2 border-olive/20
                         bg-white/70 backdrop-blur-sm
                         focus:outline-none focus:border-pine focus:bg-white/90
                         placeholder:text-olive/40 text-sm text-dark-teal
                         transition-all duration-300 input-glow"
            />
          </div>

          <div className="glass-card rounded-2xl p-6">
            <label className="block figtree-medium text-sm text-dark-teal mb-2">
              Reflection (optional)
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What's on your heart today? What is God teaching you?"
              rows={4}
              className="figtree-regular w-full px-4 py-3 rounded-xl border-2 border-olive/20
                         bg-white/70 backdrop-blur-sm resize-none
                         focus:outline-none focus:border-pine focus:bg-white/90
                         placeholder:text-olive/40 text-sm text-dark-teal
                         transition-all duration-300 input-glow"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="figtree-medium w-full px-6 py-4 rounded-2xl bg-pine hover:bg-dark-teal
                       text-white text-sm shadow-lg btn-primary disabled:opacity-50"
          >
            {isSubmitting ? "Checking in..." : "Check in"}
          </button>
        </form>

        <p className="text-center figtree-light text-xs text-olive/60 mt-6 opacity-0 animate-fade-in stagger-3">
          Even a simple check-in keeps your streak alive
        </p>
      </div>
    </main>
  );
}
