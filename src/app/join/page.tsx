"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function JoinPage() {
  return (
    <main className="figtree min-h-screen flex flex-col items-center justify-center px-5 bg-gradient-main texture-overlay relative overflow-hidden">
      {/* Decorative elements */}
      <div className="decorative-circle w-72 h-72 bg-pine/25 -top-36 -right-36 animate-pulse-soft" />
      <div className="decorative-circle w-56 h-56 bg-olive/15 -bottom-28 -left-28 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

      <div className="max-w-md w-full text-center relative z-10">
        {/* Back link */}
        <Link href="/" className="text-olive hover:text-walnut transition-colors duration-200 mb-12 opacity-0 animate-fade-in inline-block">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>

        {/* Main content */}
        <div className="opacity-0 animate-fade-in-up stagger-1">
          <h1 className="nanum-pen-script-regular text-5xl sm:text-6xl text-walnut mb-6 drop-shadow-sm">
            Why you?
          </h1>

          <div className="space-y-6 figtree-regular text-dark-teal/90 text-sm leading-relaxed mb-10">
            <p>
              Because Jesus didn&apos;t call us to walk alone.
            </p>

            <p className="reenie-beanie-regular text-2xl text-pine">
              &ldquo;For where two or three gather in my name,<br />
              there am I with them.&rdquo;
              <span className="block mt-1 figtree-medium text-xs text-olive">— Matthew 18:20</span>
            </p>

            <p>
              You were made for community. For late-night conversations about faith.
              For holding each other accountable. For sharing the verses that hit different
              at 2am when you needed them most.
            </p>

            <p>
              The world is loud. But His word is living.
            </p>

            <p className="figtree-medium text-walnut">
              Join us. Bring your friends. Let&apos;s grow together.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 z-10 opacity-0 animate-fade-in stagger-5">
        <p className="figtree-light text-xs text-olive/60">
          koinYOU © 2026
        </p>
      </footer>
    </main>
  );
}
