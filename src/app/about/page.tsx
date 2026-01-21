"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="figtree min-h-screen px-5 py-12 bg-gradient-main texture-overlay relative overflow-hidden">
      {/* Decorative elements */}
      <div className="decorative-circle w-80 h-80 bg-pine/25 -top-40 -right-40 animate-pulse-soft" />
      <div className="decorative-circle w-64 h-64 bg-olive/15 -bottom-32 -left-32 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
      <div className="decorative-circle w-40 h-40 bg-walnut/10 top-1/3 -left-20 animate-float" />

      <div className="max-w-xl mx-auto relative z-10">
        {/* Back link */}
        <Link
          href="/"
          className="figtree-regular inline-flex items-center gap-2 text-xs text-olive hover:text-walnut
                     mb-10 transition-colors duration-300 link-underline opacity-0 animate-fade-in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to home</span>
        </Link>

        {/* Main content */}
        <article className="opacity-0 animate-fade-in-up stagger-1">
          {/* Title */}
          <h1 className="nanum-pen-script-regular text-5xl sm:text-6xl text-walnut mb-4 drop-shadow-sm">
            What is Koinonia?
          </h1>

          <p className="reenie-beanie-regular text-2xl text-pine mb-10">
            κοινωνία — fellowship, community, sharing together
          </p>

          {/* Content card */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 mb-8">
            <div className="space-y-6 figtree-regular text-dark-teal/90 text-sm leading-relaxed">
              <p>
                <span className="figtree-semibold text-walnut">Koinonia</span> is an ancient Greek word
                found throughout the New Testament. It describes a deep, intimate fellowship — not just
                being in the same room, but truly sharing life together. It&apos;s the kind of community
                where believers hold each other up, share their burdens, and grow in faith side by side.
              </p>

              <blockquote className="border-l-2 border-pine/40 pl-5 py-2 my-6 italic text-olive">
                &ldquo;They devoted themselves to the apostles&apos; teaching and to fellowship
                <span className="text-pine font-medium"> (koinonia)</span>, to the breaking of bread
                and to prayer.&rdquo;
                <span className="block mt-2 text-xs not-italic figtree-medium">— Acts 2:42</span>
              </blockquote>

              <p>
                We built <span className="figtree-semibold text-walnut">koinYOU</span> because we were
                tired of social media pulling us away from what matters. Lost in the noise, it became
                hard to see Jesus in everything — even with a community of Christians around us.
              </p>

              <p>
                The truth is, sometimes you just want to live and breathe God&apos;s word, <em>together</em>.
              </p>

              <p>
                With koinYOU, we&apos;re bringing that ancient concept of koinonia into the digital age.
                A space to search scripture, save verses that speak to your heart, keep your friends
                accountable, check up on each other, and share the Gospel with those around you.
              </p>
            </div>
          </div>

          {/* Tagline card */}
          <div className="glass-card rounded-2xl p-6 text-center opacity-0 animate-fade-in stagger-3">
            <p className="reenie-beanie-regular text-2xl text-pine mb-2">
              Because there&apos;s no koinonia without
            </p>
            <p className="nanum-pen-script-regular text-4xl text-walnut">
              you.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center opacity-0 animate-fade-in stagger-4">
            <Link
              href="/"
              className="figtree-medium px-8 py-4 rounded-2xl bg-pine hover:bg-dark-teal
                         text-white text-sm shadow-lg btn-primary inline-block"
            >
              Start exploring scripture
            </Link>
          </div>
        </article>
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
