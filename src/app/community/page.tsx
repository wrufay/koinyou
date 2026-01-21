"use client";

import { useState, useEffect } from "react";
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

interface StreakData {
  streak: number;
  checkedInToday: boolean;
}

interface FriendStreak {
  friend: {
    _id: string;
    name: string;
    avatar: string;
  };
  streak: number;
  checkedInToday: boolean;
}

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [friendStreaks, setFriendStreaks] = useState<FriendStreak[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [friendRequests, setFriendRequests] = useState(0);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [streakRes, friendsRes, unreadRes, requestsRes] = await Promise.all([
        fetch(`${API_URL}/api/devotions/streak`, { credentials: "include" }),
        fetch(`${API_URL}/api/devotions/friends-streaks`, { credentials: "include" }),
        fetch(`${API_URL}/api/send/unread-count`, { credentials: "include" }),
        fetch(`${API_URL}/api/friends/requests`, { credentials: "include" }),
      ]);

      const [streakData, friendsData, unreadData, requestsData] = await Promise.all([
        streakRes.json(),
        friendsRes.json(),
        unreadRes.json(),
        requestsRes.json(),
      ]);

      if (streakData.success) setStreakData(streakData);
      if (friendsData.success) setFriendStreaks(friendsData.friends);
      if (unreadData.success) setUnreadCount(unreadData.count);
      if (requestsData.success) setFriendRequests(requestsData.requests.length);
    } catch (error) {
      console.error("Error fetching data:", error);
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
            Community
          </h1>
          <p className="figtree-regular text-sm text-olive mb-8">
            Sign in to connect with friends and grow together
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

      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in">
          <Link
            href="/"
            className="figtree-regular inline-flex items-center gap-2 text-xs text-olive hover:text-walnut transition-colors link-underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="figtree-regular inline-flex items-center gap-1.5 text-xs text-olive hover:text-walnut transition-colors"
            >
              {user?.avatar ? (
                <img src={getAvatarUrl(user.avatar)} alt={user.name} className="w-6 h-6 rounded-full border border-white/50 object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-pine/20 flex items-center justify-center">
                  <span className="figtree-medium text-pine text-xs">{user?.name?.charAt(0)}</span>
                </div>
              )}
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <AuthButton />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10 opacity-0 animate-fade-in-up stagger-1">
          <h1 className="nanum-pen-script-regular text-5xl text-walnut mb-2 drop-shadow-sm">
            Your Circle
          </h1>
          <p className="reenie-beanie-regular text-2xl text-pine">
            Walk together in faith
          </p>
        </div>

        {/* Streak Card */}
        <div className="glass-card rounded-2xl p-6 mb-6 text-center opacity-0 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-8 h-8 text-walnut" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.75 2.25c0 4.5-3 6.75-3 10.5a3 3 0 106 0c0-1.5-.75-3-1.5-4.5.75 3 .75 6 0 7.5a4.5 4.5 0 01-3 1.5 4.5 4.5 0 01-4.5-4.5c0-3 1.5-6 4.5-9a13.5 13.5 0 011.5-1.5z"/>
              <path d="M15.75 12.75c0 2.25-1.5 4.5-3.75 4.5s-3.75-2.25-3.75-4.5c0-2.25 1.5-5.25 3.75-7.5 2.25 2.25 3.75 5.25 3.75 7.5z" fillOpacity="0.3"/>
            </svg>
            <span className="nanum-pen-script-regular text-4xl text-walnut">
              {streakData?.streak || 0}
            </span>
          </div>
          <p className="figtree-regular text-sm text-olive mb-4">day streak</p>

          {!streakData?.checkedInToday ? (
            <Link
              href="/community/checkin"
              className="figtree-medium px-6 py-3 rounded-xl bg-pine hover:bg-dark-teal
                         text-white text-sm shadow-lg btn-primary inline-block"
            >
              Check in today
            </Link>
          ) : (
            <p className="figtree-medium text-xs text-pine flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Checked in today
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8 opacity-0 animate-fade-in-up stagger-3">
          <Link href="/community/inbox" className="glass-card rounded-2xl p-5 text-center tag-hover relative">
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-walnut text-white text-xs rounded-full flex items-center justify-center figtree-medium">
                {unreadCount}
              </span>
            )}
            <svg className="w-6 h-6 mx-auto mb-2 text-pine" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <p className="figtree-medium text-sm text-dark-teal">Inbox</p>
            <p className="figtree-light text-xs text-olive">Verses from friends</p>
          </Link>

          <Link href="/community/prayers" className="glass-card rounded-2xl p-5 text-center tag-hover">
            <svg className="w-6 h-6 mx-auto mb-2 text-pine" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <p className="figtree-medium text-sm text-dark-teal">Prayers</p>
            <p className="figtree-light text-xs text-olive">Pray together</p>
          </Link>

          <Link href="/community/friends" className="glass-card rounded-2xl p-5 text-center tag-hover relative">
            {friendRequests > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-pine text-white text-xs rounded-full flex items-center justify-center figtree-medium">
                {friendRequests}
              </span>
            )}
            <svg className="w-6 h-6 mx-auto mb-2 text-pine" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p className="figtree-medium text-sm text-dark-teal">Friends</p>
            <p className="figtree-light text-xs text-olive">Your circle</p>
          </Link>

          <Link href="/saved" className="glass-card rounded-2xl p-5 text-center tag-hover">
            <svg className="w-6 h-6 mx-auto mb-2 text-pine" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <p className="figtree-medium text-sm text-dark-teal">Saved</p>
            <p className="figtree-light text-xs text-olive">Your verses</p>
          </Link>
        </div>

        {/* Friends Streaks */}
        {friendStreaks.length > 0 && (
          <div className="opacity-0 animate-fade-in-up stagger-4">
            <h2 className="figtree-medium text-xs text-olive uppercase tracking-widest mb-4">
              Friends&apos; Streaks
            </h2>
            <div className="space-y-3">
              {friendStreaks.slice(0, 5).map((fs, index) => (
                <div
                  key={fs.friend._id}
                  className="glass-card rounded-xl p-4 flex items-center gap-4"
                  style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                >
                  {fs.friend.avatar ? (
                    <img
                      src={getAvatarUrl(fs.friend.avatar)}
                      alt={fs.friend.name}
                      className="w-10 h-10 rounded-full border-2 border-white/50 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-pine/20 flex items-center justify-center">
                      <span className="figtree-medium text-pine text-sm">
                        {fs.friend.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="figtree-medium text-sm text-dark-teal">{fs.friend.name}</p>
                    <p className="figtree-light text-xs text-olive">
                      {fs.checkedInToday ? "Checked in today" : "Not checked in yet"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-walnut" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.75 2.25c0 4.5-3 6.75-3 10.5a3 3 0 106 0c0-1.5-.75-3-1.5-4.5.75 3 .75 6 0 7.5a4.5 4.5 0 01-3 1.5 4.5 4.5 0 01-4.5-4.5c0-3 1.5-6 4.5-9a13.5 13.5 0 011.5-1.5z"/>
                    </svg>
                    <span className="figtree-semibold text-walnut">{fs.streak}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {friendStreaks.length === 0 && (
          <div className="text-center py-8 opacity-0 animate-fade-in-up stagger-4">
            <p className="figtree-regular text-sm text-olive mb-4">
              Add friends to see their streaks and grow together
            </p>
            <Link
              href="/community/friends"
              className="figtree-medium text-sm text-pine hover:text-dark-teal transition-colors link-underline"
            >
              Find friends
            </Link>
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
