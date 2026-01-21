"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface Prayer {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  isAnonymous: boolean;
  answered: boolean;
  answeredAt: string | null;
  prayerCount: number;
  hasPrayed: boolean;
  createdAt: string;
}

export default function PrayersPage() {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPrayer, setNewPrayer] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tab, setTab] = useState<"feed" | "mine">("feed");

  useEffect(() => {
    if (user) {
      fetchPrayers();
    }
  }, [user, tab]);

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const endpoint = tab === "feed" ? "/api/prayers/feed" : "/api/prayers/mine";
      const res = await fetch(`${API_URL}${endpoint}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPrayers(data.prayers);
      }
    } catch (error) {
      console.error("Error fetching prayers:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/prayers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newPrayer, isAnonymous }),
      });

      const data = await res.json();
      if (data.success) {
        setNewPrayer("");
        setIsAnonymous(false);
        setShowForm(false);
        fetchPrayers();
      }
    } catch (error) {
      console.error("Error submitting prayer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const prayFor = async (prayerId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/prayers/pray/${prayerId}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setPrayers((prev) =>
          prev.map((p) =>
            p._id === prayerId
              ? { ...p, hasPrayed: true, prayerCount: data.prayerCount || p.prayerCount + 1 }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error praying:", error);
    }
  };

  const markAnswered = async (prayerId: string) => {
    try {
      await fetch(`${API_URL}/api/prayers/answered/${prayerId}`, {
        method: "POST",
        credentials: "include",
      });
      fetchPrayers();
    } catch (error) {
      console.error("Error marking answered:", error);
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
        <div className="text-center mb-6 opacity-0 animate-fade-in-up stagger-1">
          <h1 className="nanum-pen-script-regular text-5xl text-walnut mb-2 drop-shadow-sm">
            Prayer Circle
          </h1>
          <p className="reenie-beanie-regular text-2xl text-pine">
            Bear one another&apos;s burdens
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 opacity-0 animate-fade-in-up stagger-2">
          <button
            onClick={() => setTab("feed")}
            className={`flex-1 figtree-medium px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${tab === "feed"
                         ? "bg-pine text-white"
                         : "bg-white/50 text-olive hover:bg-white/70"}`}
          >
            Friends
          </button>
          <button
            onClick={() => setTab("mine")}
            className={`flex-1 figtree-medium px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${tab === "mine"
                         ? "bg-pine text-white"
                         : "bg-white/50 text-olive hover:bg-white/70"}`}
          >
            My Prayers
          </button>
        </div>

        {/* Add Prayer Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full glass-card rounded-2xl p-4 mb-6 text-center transition-all duration-300
                     hover:bg-white/70 opacity-0 animate-fade-in-up stagger-2"
        >
          <span className="figtree-medium text-sm text-pine">
            {showForm ? "Cancel" : "+ Share a prayer request"}
          </span>
        </button>

        {/* Prayer Form */}
        {showForm && (
          <form onSubmit={submitPrayer} className="glass-card rounded-2xl p-6 mb-6 opacity-0 animate-fade-in-scale">
            <textarea
              value={newPrayer}
              onChange={(e) => setNewPrayer(e.target.value)}
              placeholder="What can we pray for you about?"
              rows={3}
              maxLength={500}
              className="figtree-regular w-full px-4 py-3 rounded-xl border-2 border-olive/20
                         bg-white/70 backdrop-blur-sm resize-none
                         focus:outline-none focus:border-pine focus:bg-white/90
                         placeholder:text-olive/40 text-sm text-dark-teal
                         transition-all duration-300 input-glow mb-4"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-olive/30 text-pine focus:ring-pine"
                />
                <span className="figtree-regular text-xs text-olive">Post anonymously</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || !newPrayer.trim()}
                className="figtree-medium px-6 py-2 rounded-xl bg-pine hover:bg-dark-teal
                           text-white text-sm btn-primary disabled:opacity-50"
              >
                {isSubmitting ? "Posting..." : "Share"}
              </button>
            </div>
          </form>
        )}

        {/* Prayers List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-pine/30 border-t-pine rounded-full animate-spin" />
          </div>
        ) : prayers.length === 0 ? (
          <div className="text-center py-12 opacity-0 animate-fade-in-up stagger-3">
            <svg className="w-10 h-10 mx-auto mb-4 text-olive" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <p className="figtree-regular text-sm text-olive mb-2">
              {tab === "feed" ? "No prayers from friends yet" : "You haven't shared any prayers"}
            </p>
            <p className="figtree-light text-xs text-olive/70">
              {tab === "feed" ? "Add friends to see their prayer requests" : "Share a request and let others pray with you"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {prayers.map((prayer, index) => (
              <div
                key={prayer._id}
                className={`glass-card rounded-2xl p-5 opacity-0 animate-slide-up
                           ${prayer.answered ? "border-l-4 border-l-olive/50" : ""}`}
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  {prayer.user.avatar && !prayer.isAnonymous ? (
                    <img
                      src={prayer.user.avatar}
                      alt={prayer.user.name}
                      className="w-10 h-10 rounded-full border-2 border-white/50"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-olive/20 flex items-center justify-center">
                      <span className="figtree-medium text-olive text-sm">
                        {prayer.user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="figtree-medium text-sm text-dark-teal">
                        {prayer.user.name}
                      </p>
                      <span className="figtree-light text-xs text-olive">
                        {new Date(prayer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {prayer.answered && (
                      <span className="inline-block figtree-medium text-xs text-olive bg-olive/10 px-2 py-0.5 rounded mt-1">
                        Answered
                      </span>
                    )}
                  </div>
                </div>

                <p className="figtree-regular text-sm text-dark-teal/90 leading-relaxed mb-4">
                  {prayer.content}
                </p>

                <div className="flex items-center justify-between">
                  <span className="figtree-light text-xs text-olive">
                    {prayer.prayerCount} {prayer.prayerCount === 1 ? "person" : "people"} praying
                  </span>

                  <div className="flex gap-2">
                    {tab === "mine" && !prayer.answered && (
                      <button
                        onClick={() => markAnswered(prayer._id)}
                        className="figtree-medium text-xs text-olive hover:text-pine transition-colors"
                      >
                        Mark answered
                      </button>
                    )}

                    {!prayer.hasPrayed && prayer.user._id !== user?._id && (
                      <button
                        onClick={() => prayFor(prayer._id)}
                        className="figtree-medium px-4 py-1.5 rounded-lg bg-pine/10 hover:bg-pine/20
                                   text-pine text-xs transition-colors"
                      >
                        Pray
                      </button>
                    )}

                    {prayer.hasPrayed && (
                      <span className="figtree-medium px-4 py-1.5 text-pine/60 text-xs">
                        Prayed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center z-10 opacity-0 animate-fade-in stagger-5">
        <p className="figtree-light text-xs text-olive/60">
          koinYOU © 2026
        </p>
      </footer>
    </main>
  );
}
