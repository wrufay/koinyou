"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TRANSLATIONS } from "@/lib/translations";

interface Props {
  current: string;
  translationName: string;
}

export default function TranslationPicker({ current, translationName }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const select = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("translation", id);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Clickable translation label */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="reenie"
        style={{
          fontSize: "1.3rem",
          color: "var(--cream-hint)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0.3rem 0.6rem",
          borderRadius: "10px",
          transition: "background 0.18s, color 0.18s",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(200,90,40,0.08)";
          (e.currentTarget as HTMLElement).style.color = "var(--rust)";
        }}
        onMouseOut={(e) => {
          if (!open) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--cream-hint)";
          }
        }}
      >
        {translationName}
        <svg
          style={{
            width: "0.75rem",
            height: "0.75rem",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            opacity: 0.5,
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />

          {/* Panel — opens upward */}
          <div
            className="g-card"
            style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
              minWidth: "220px",
              padding: "0.5rem",
              overflowY: "auto",
              maxHeight: "340px",
            }}
          >
            <p
              className="g-label-cream"
              style={{ padding: "0.4rem 0.85rem 0.5rem", marginBottom: 0 }}
            >
              Translation
            </p>

            {TRANSLATIONS.map((t) => {
              const active = t.id === current;
              return (
                <button
                  key={t.id}
                  onClick={() => select(t.id)}
                  className="nunito"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.62rem 0.85rem",
                    borderRadius: "12px",
                    border: "none",
                    background: active ? "rgba(200,90,40,0.1)" : "transparent",
                    color: active ? "var(--rust)" : "var(--cream-mid)",
                    fontWeight: active ? 800 : 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                  onMouseOver={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(42,28,12,0.05)";
                  }}
                  onMouseOut={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <span>{t.name}</span>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: active ? "var(--rust)" : "var(--cream-hint)",
                      background: active ? "rgba(200,90,40,0.12)" : "rgba(42,28,12,0.06)",
                      padding: "0.12rem 0.5rem",
                      borderRadius: "999px",
                      flexShrink: 0,
                    }}
                  >
                    {t.short}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
