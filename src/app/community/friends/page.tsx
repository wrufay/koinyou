"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

interface FriendRequest {
  _id: string;
  requester: User;
  createdAt: string;
}

export default function FriendsPage() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [tab, setTab] = useState<"friends" | "requests" | "search">("friends");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        fetch(`${API_URL}/api/friends`, { credentials: "include" }),
        fetch(`${API_URL}/api/friends/requests`, { credentials: "include" }),
      ]);

      const [friendsData, requestsData] = await Promise.all([
        friendsRes.json(),
        requestsRes.json(),
      ]);

      if (friendsData.success) setFriends(friendsData.friends);
      if (requestsData.success) setRequests(requestsData.requests);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    setSearching(true);
    try {
      const res = await fetch(
        `${API_URL}/api/friends/search?q=${encodeURIComponent(searchQuery)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        // Filter out existing friends
        const friendIds = friends.map((f) => f._id);
        setSearchResults(data.users.filter((u: User) => !friendIds.includes(u._id)));
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setSearching(false);
    }
  };

  const sendRequest = async (recipientId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/friends/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ recipientId }),
      });

      const data = await res.json();
      if (data.success) {
        setSearchResults((prev) => prev.filter((u) => u._id !== recipientId));
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const acceptRequest = async (friendshipId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/friends/accept/${friendshipId}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Error accepting:", error);
    }
  };

  const declineRequest = async (friendshipId: string) => {
    try {
      await fetch(`${API_URL}/api/friends/decline/${friendshipId}`, {
        method: "POST",
        credentials: "include",
      });
      setRequests((prev) => prev.filter((r) => r._id !== friendshipId));
    } catch (error) {
      console.error("Error declining:", error);
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      await fetch(`${API_URL}/api/friends/${friendId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
    } catch (error) {
      console.error("Error removing:", error);
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
            Friends
          </h1>
          <p className="reenie-beanie-regular text-2xl text-pine">
            Your circle of faith
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 opacity-0 animate-fade-in-up stagger-2">
          <button
            onClick={() => setTab("friends")}
            className={`flex-1 figtree-medium px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${tab === "friends"
                         ? "bg-pine text-white"
                         : "bg-white/50 text-olive hover:bg-white/70"}`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setTab("requests")}
            className={`flex-1 figtree-medium px-4 py-2 rounded-xl text-sm transition-all duration-300 relative
                       ${tab === "requests"
                         ? "bg-pine text-white"
                         : "bg-white/50 text-olive hover:bg-white/70"}`}
          >
            Requests
            {requests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-walnut text-white text-xs rounded-full flex items-center justify-center">
                {requests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("search")}
            className={`flex-1 figtree-medium px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${tab === "search"
                         ? "bg-pine text-white"
                         : "bg-white/50 text-olive hover:bg-white/70"}`}
          >
            Find
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-pine/30 border-t-pine rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Friends List */}
            {tab === "friends" && (
              <div className="space-y-3 opacity-0 animate-fade-in-up stagger-3">
                {friends.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-10 h-10 mx-auto mb-4 text-olive" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                    <p className="figtree-regular text-sm text-olive mb-2">
                      No friends yet
                    </p>
                    <button
                      onClick={() => setTab("search")}
                      className="figtree-medium text-sm text-pine hover:text-dark-teal transition-colors link-underline"
                    >
                      Find friends to add
                    </button>
                  </div>
                ) : (
                  friends.map((friend, index) => (
                    <div
                      key={friend._id}
                      className="glass-card rounded-xl p-4 flex items-center gap-4"
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      {friend.avatar ? (
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full border-2 border-white/50"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-pine/20 flex items-center justify-center">
                          <span className="figtree-medium text-pine">
                            {friend.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="figtree-medium text-dark-teal">{friend.name}</p>
                        <p className="figtree-light text-xs text-olive truncate">
                          {friend.email}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFriend(friend._id)}
                        className="figtree-regular text-xs text-olive/60 hover:text-walnut transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Requests List */}
            {tab === "requests" && (
              <div className="space-y-3 opacity-0 animate-fade-in-up stagger-3">
                {requests.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-10 h-10 mx-auto mb-4 text-olive" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-17.5 0a2.25 2.25 0 00-2.25 2.25v6a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25m-17.5 0V6A2.25 2.25 0 014.5 3.75h15A2.25 2.25 0 0121.75 6v7.5" />
                    </svg>
                    <p className="figtree-regular text-sm text-olive">
                      No pending requests
                    </p>
                  </div>
                ) : (
                  requests.map((request, index) => (
                    <div
                      key={request._id}
                      className="glass-card rounded-xl p-4 flex items-center gap-4"
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      {request.requester.avatar ? (
                        <img
                          src={request.requester.avatar}
                          alt={request.requester.name}
                          className="w-12 h-12 rounded-full border-2 border-white/50"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-pine/20 flex items-center justify-center">
                          <span className="figtree-medium text-pine">
                            {request.requester.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="figtree-medium text-dark-teal">
                          {request.requester.name}
                        </p>
                        <p className="figtree-light text-xs text-olive">
                          Wants to connect
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptRequest(request._id)}
                          className="figtree-medium px-3 py-1.5 rounded-lg bg-pine hover:bg-dark-teal
                                     text-white text-xs transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineRequest(request._id)}
                          className="figtree-medium px-3 py-1.5 rounded-lg bg-olive/10 hover:bg-olive/20
                                     text-olive text-xs transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Search */}
            {tab === "search" && (
              <div className="opacity-0 animate-fade-in-up stagger-3">
                <div className="glass-card rounded-2xl p-4 mb-6">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="figtree-regular w-full px-4 py-3 rounded-xl border-2 border-olive/20
                               bg-white/70 backdrop-blur-sm
                               focus:outline-none focus:border-pine focus:bg-white/90
                               placeholder:text-olive/40 text-sm text-dark-teal
                               transition-all duration-300 input-glow"
                  />
                </div>

                {searching ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-pine/30 border-t-pine rounded-full animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <div
                        key={result._id}
                        className="glass-card rounded-xl p-4 flex items-center gap-4"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {result.avatar ? (
                          <img
                            src={result.avatar}
                            alt={result.name}
                            className="w-12 h-12 rounded-full border-2 border-white/50"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-pine/20 flex items-center justify-center">
                            <span className="figtree-medium text-pine">
                              {result.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="figtree-medium text-dark-teal">{result.name}</p>
                          <p className="figtree-light text-xs text-olive truncate">
                            {result.email}
                          </p>
                        </div>
                        <button
                          onClick={() => sendRequest(result._id)}
                          className="figtree-medium px-4 py-1.5 rounded-lg bg-pine hover:bg-dark-teal
                                     text-white text-xs transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="text-center py-8">
                    <p className="figtree-regular text-sm text-olive">
                      No users found
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="figtree-light text-sm text-olive/70">
                      Type at least 2 characters to search
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
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
