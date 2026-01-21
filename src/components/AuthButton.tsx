"use client";

import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Helper to get full avatar URL
const getAvatarUrl = (avatar: string) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `${API_URL}${avatar}`;
};

export default function AuthButton() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="figtree-regular px-3 py-1.5 text-olive/40 text-xs">
        <div className="w-4 h-4 border border-olive/30 border-t-olive/60 rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.avatar && (
          <img
            src={getAvatarUrl(user.avatar)}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-white/50 shadow-md
                       transition-transform duration-300 hover:scale-105"
          />
        )}
        <button
          onClick={logout}
          className="figtree-regular px-3 py-1.5 rounded-lg text-olive/60 hover:text-walnut
                     text-xs transition-colors duration-300 link-underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="figtree-medium px-4 py-2.5 rounded-xl
                 bg-white/60 hover:bg-white/80 backdrop-blur-sm
                 text-dark-teal text-xs
                 transition-all duration-300
                 flex items-center gap-2
                 border border-olive/15 hover:border-pine/30
                 tag-hover"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Sign in
    </button>
  );
}
