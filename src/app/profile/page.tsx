"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthButton from "@/components/AuthButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Helper to get full avatar URL
const getAvatarUrl = (avatar: string) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `${API_URL}${avatar}`;
};

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  favoriteVerse: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [favoriteVerse, setFavoriteVerse] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setName(data.profile.name);
        setBio(data.profile.bio);
        setFavoriteVerse(data.profile.favoriteVerse);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, bio, favoriteVerse }),
      });

      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio);
      setFavoriteVerse(profile.favoriteVerse);
    }
    setEditing(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`${API_URL}/api/profile/avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        await refreshUser(); // Update global user state
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setUploadingPhoto(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (authLoading) {
    return (
      <main className="figtree min-h-screen flex items-center justify-center bg-gradient-main texture-overlay">
        <div className="w-8 h-8 border-2 border-pine/30 border-t-pine rounded-full animate-spin" />
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
            Profile
          </h1>
          <p className="figtree-regular text-sm text-olive mb-8">
            Sign in to view and edit your profile
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
      <div className="decorative-circle w-72 h-72 bg-pine/20 -top-36 -right-36 animate-pulse-soft" />
      <div className="decorative-circle w-56 h-56 bg-olive/15 -bottom-28 -left-28 animate-pulse-soft" style={{ animationDelay: "1s" }} />

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in">
          <Link
            href="/community"
            className="figtree-regular inline-flex items-center gap-2 text-xs text-olive hover:text-walnut transition-colors link-underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Community</span>
          </Link>
          <AuthButton />
        </div>

        {/* Title */}
        <div className="text-center mb-8 opacity-0 animate-fade-in-up stagger-1">
          <h1 className="nanum-pen-script-regular text-5xl text-walnut mb-2 drop-shadow-sm">
            Your Profile
          </h1>
          <p className="reenie-beanie-regular text-2xl text-pine">
            Let others know who you are
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-pine/30 border-t-pine rounded-full animate-spin" />
          </div>
        ) : profile ? (
          <div className="space-y-6 opacity-0 animate-fade-in-up stagger-2">
            {/* Avatar & Name */}
            <div className="glass-card rounded-2xl p-6 text-center">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />

              {/* Clickable avatar */}
              <button
                onClick={handlePhotoClick}
                disabled={uploadingPhoto}
                className="relative group mx-auto mb-4 block"
              >
                {profile.avatar ? (
                  <img
                    src={getAvatarUrl(profile.avatar)}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full border-4 border-white/50 shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-pine/20 flex items-center justify-center border-4 border-white/50">
                    <span className="nanum-pen-script-regular text-4xl text-pine">
                      {profile.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 rounded-full bg-dark-teal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  {uploadingPhoto ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  )}
                </div>
              </button>
              <p className="figtree-light text-xs text-olive/60 mb-4">
                Tap to change photo
              </p>

              {!editing ? (
                <>
                  <h2 className="nanum-pen-script-regular text-3xl text-walnut mb-1">
                    {profile.name}
                  </h2>
                  <p className="figtree-light text-xs text-olive mb-4">
                    {profile.email}
                  </p>
                  <p className="figtree-light text-xs text-olive/60">
                    Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </>
              ) : (
                <div className="mt-2">
                  <label className="block figtree-medium text-xs text-dark-teal mb-2 text-left">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    className="figtree-regular w-full px-4 py-3 rounded-xl border-2 border-olive/20
                               bg-white/70 backdrop-blur-sm
                               focus:outline-none focus:border-pine focus:bg-white/90
                               placeholder:text-olive/40 text-sm text-dark-teal
                               transition-all duration-300 input-glow"
                  />
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="glass-card rounded-2xl p-6">
              <label className="block figtree-medium text-xs text-dark-teal mb-2">
                Bio
              </label>
              {!editing ? (
                <p className="figtree-regular text-sm text-dark-teal/90 leading-relaxed">
                  {profile.bio || <span className="text-olive/50 italic">No bio yet. Tell others about yourself!</span>}
                </p>
              ) : (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a little about yourself and your faith journey..."
                  rows={3}
                  maxLength={200}
                  className="figtree-regular w-full px-4 py-3 rounded-xl border-2 border-olive/20
                             bg-white/70 backdrop-blur-sm resize-none
                             focus:outline-none focus:border-pine focus:bg-white/90
                             placeholder:text-olive/40 text-sm text-dark-teal
                             transition-all duration-300 input-glow"
                />
              )}
              {editing && (
                <p className="figtree-light text-xs text-olive/60 mt-2 text-right">
                  {bio.length}/200
                </p>
              )}
            </div>

            {/* Favorite Verse */}
            <div className="glass-card rounded-2xl p-6">
              <label className="block figtree-medium text-xs text-dark-teal mb-2">
                Favorite Verse
              </label>
              {!editing ? (
                <p className="nanum-pen-script-regular text-xl text-walnut">
                  {profile.favoriteVerse || <span className="figtree-regular text-sm text-olive/50 italic">Add your favorite verse</span>}
                </p>
              ) : (
                <input
                  type="text"
                  value={favoriteVerse}
                  onChange={(e) => setFavoriteVerse(e.target.value)}
                  placeholder="e.g., Philippians 4:13"
                  maxLength={100}
                  className="figtree-regular w-full px-4 py-3 rounded-xl border-2 border-olive/20
                             bg-white/70 backdrop-blur-sm
                             focus:outline-none focus:border-pine focus:bg-white/90
                             placeholder:text-olive/40 text-sm text-dark-teal
                             transition-all duration-300 input-glow"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 figtree-medium px-6 py-3 rounded-xl bg-pine hover:bg-dark-teal
                             text-white text-sm btn-primary"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving || !name.trim()}
                    className="flex-1 figtree-medium px-6 py-3 rounded-xl bg-pine hover:bg-dark-teal
                               text-white text-sm btn-primary disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="figtree-medium px-6 py-3 rounded-xl border-2 border-olive/20
                               text-olive hover:text-dark-teal text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Saved confirmation */}
            {saved && (
              <p className="text-center figtree-medium text-sm text-pine flex items-center justify-center gap-1 opacity-0 animate-fade-in">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Profile saved
              </p>
            )}
          </div>
        ) : null}
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
