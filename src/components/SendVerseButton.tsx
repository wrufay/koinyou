"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface Friend {
  _id: string;
  name: string;
  avatar: string;
}

interface SendVerseButtonProps {
  reference: string;
  book: string;
  chapter: string;
  verse: string;
  text: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function SendVerseButton({
  reference,
  book,
  chapter,
  verse,
  text,
}: SendVerseButtonProps) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (showModal && user) {
      fetchFriends();
    }
  }, [showModal, user]);

  const fetchFriends = async () => {
    try {
      const res = await fetch(`${API_URL}/api/friends`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setFriends(data.friends);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const sendVerse = async () => {
    if (!selectedFriend) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          recipientId: selectedFriend._id,
          reference,
          book,
          chapter,
          verse,
          text,
          note,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSent(true);
        setTimeout(() => {
          setShowModal(false);
          setSent(false);
          setSelectedFriend(null);
          setNote("");
        }, 1500);
      }
    } catch (error) {
      console.error("Error sending verse:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full
                   transition-all duration-300 backdrop-blur-sm
                   bg-white/50 text-olive border border-olive/20
                   hover:bg-white/70 hover:border-pine/30 hover:text-pine
                   tag-hover"
        title="Send to friend"
      >
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
        <span className="figtree-medium text-xs">Send</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-dark-teal/50 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-card rounded-3xl p-6 max-w-sm w-full opacity-0 animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {sent ? (
              <div className="text-center py-8">
                <svg className="w-10 h-10 mx-auto mb-4 text-pine" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
                <p className="nanum-pen-script-regular text-2xl text-walnut">
                  Sent!
                </p>
              </div>
            ) : (
              <>
                <h2 className="nanum-pen-script-regular text-2xl text-walnut mb-1 text-center">
                  Send verse
                </h2>
                <p className="figtree-regular text-xs text-olive text-center mb-6">
                  {reference}
                </p>

                {friends.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="figtree-regular text-sm text-olive mb-2">
                      No friends yet
                    </p>
                    <p className="figtree-light text-xs text-olive/70">
                      Add friends to send them verses
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block figtree-medium text-xs text-dark-teal mb-2">
                        Send to
                      </label>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {friends.map((friend) => (
                          <button
                            key={friend._id}
                            onClick={() => setSelectedFriend(friend)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                                       ${selectedFriend?._id === friend._id
                                         ? "bg-pine/20 border-2 border-pine"
                                         : "bg-white/50 border-2 border-transparent hover:bg-white/70"}`}
                          >
                            {friend.avatar ? (
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-pine/20 flex items-center justify-center">
                                <span className="figtree-medium text-pine text-sm">
                                  {friend.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <span className="figtree-medium text-sm text-dark-teal">
                              {friend.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block figtree-medium text-xs text-dark-teal mb-2">
                        Add a note (optional)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Thinking of you..."
                        rows={2}
                        className="figtree-regular w-full px-4 py-3 rounded-xl border-2 border-olive/20
                                   bg-white/70 backdrop-blur-sm resize-none
                                   focus:outline-none focus:border-pine focus:bg-white/90
                                   placeholder:text-olive/40 text-sm text-dark-teal
                                   transition-all duration-300"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={sendVerse}
                        disabled={!selectedFriend || loading}
                        className="flex-1 figtree-medium px-4 py-3 rounded-xl bg-pine hover:bg-dark-teal
                                   text-white text-sm btn-primary disabled:opacity-50"
                      >
                        {loading ? "Sending..." : "Send"}
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="figtree-medium px-4 py-3 rounded-xl border-2 border-olive/20
                                   text-olive hover:text-dark-teal text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
