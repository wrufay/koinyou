"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onClose: () => void;
}

type Mode = "login" | "register";

export default function AuthModal({ onClose }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const err =
      mode === "login"
        ? await login(email, password)
        : await register(name, email, password);

    setLoading(false);

    if (err) {
      setError(err);
    } else {
      onClose();
    }
  };

  const toggle = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError(null);
  };

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
        {/* Title */}
        <p className="g-tag mb-2">☆ &nbsp; {mode === "login" ? "welcome back" : "join us"}</p>
        <h2
          className="fredoka mb-6"
          style={{ fontSize: "2rem", fontWeight: 700, color: "var(--rust)", lineHeight: 1 }}
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </h2>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {mode === "register" && (
            <div>
              <label className="g-label-cream">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                autoComplete="name"
                className="g-input-cream"
              />
            </div>
          )}

          <div>
            <label className="g-label-cream">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="g-input-cream"
            />
          </div>

          <div>
            <label className="g-label-cream">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="g-input-cream"
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              className="nunito text-xs"
              style={{
                color: "var(--rust)",
                fontWeight: 700,
                background: "rgba(200,90,40,0.08)",
                padding: "0.6rem 0.85rem",
                borderRadius: "10px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="g-btn g-btn-primary"
            style={{ width: "100%", marginTop: "0.25rem" }}
          >
            {loading ? "Just a sec…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        {/* Toggle mode */}
        <p
          className="nunito text-xs text-center mt-5"
          style={{ color: "var(--cream-muted)", fontWeight: 600 }}
        >
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          {" "}
          <button
            onClick={toggle}
            className="nunito"
            style={{
              color: "var(--rust)",
              fontWeight: 800,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "inherit",
            }}
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
