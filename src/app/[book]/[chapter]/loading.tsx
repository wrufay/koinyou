export default function ChapterLoading() {
  return (
    <main className="figtree min-h-screen flex items-center justify-center px-5 bg-gradient-main texture-overlay relative overflow-hidden">
      <div className="decorative-circle w-80 h-80 bg-pine/25 -top-40 -right-40 animate-pulse-soft" />
      <div className="decorative-circle w-64 h-64 bg-olive/15 -bottom-32 -left-32 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
      <div className="flex flex-col items-center gap-3 relative z-10">
        <div className="w-6 h-6 border-2 border-pine/30 border-t-pine rounded-full animate-spin" />
        <p className="figtree-regular text-xs text-olive">Fetching chapter...</p>
      </div>
    </main>
  );
}
