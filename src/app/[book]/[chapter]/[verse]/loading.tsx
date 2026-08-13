export default function VerseLoading() {
  return (
    <main className="figtree min-h-screen flex items-center justify-center px-6 bg-gradient-main texture-overlay relative overflow-hidden">
      <div className="decorative-circle w-72 h-72 bg-olive/20 -top-36 -right-36 animate-pulse-soft" />
      <div className="decorative-circle w-56 h-56 bg-pine/15 -bottom-28 -left-28 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
      <div className="flex flex-col items-center gap-3 relative z-10">
        <div className="w-6 h-6 border-2 border-pine/30 border-t-pine rounded-full animate-spin" />
        <p className="figtree-regular text-xs text-olive">Fetching verse...</p>
      </div>
    </main>
  );
}
