"use client";

import { useAuth } from "@/context/AuthContext";

interface Props {
  onClose: () => void;
}

export default function AuthModal({ onClose }: Props) {
  const { login } = useAuth();

  return (
    <div
      className="g-modal-overlay"
      onClick={onClose}
      style={{ zIndex: 200 }}
    >
      <div
        className="g-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "22rem" }}
      >
        <p className="g-tag mb-2">☆ &nbsp; welcome back</p>
        <h2
          className="fredoka mb-6"
          style={{ fontSize: "2rem", fontWeight: 700, color: "var(--rust)", lineHeight: 1 }}
        >
          Sign in
        </h2>
        <button
          onClick={login}
          className="g-btn g-btn-primary"
          style={{ width: "100%" }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
