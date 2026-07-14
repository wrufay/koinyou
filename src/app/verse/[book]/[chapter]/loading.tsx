export default function Loading() {
  return (
    <main className="figtree min-h-screen px-5 py-12 bg-gradient-main texture-overlay relative overflow-hidden">
      <div className="decorative-circle w-80 h-80 bg-pine/25 -top-40 -right-40 animate-pulse-soft" />
      <div className="decorative-circle w-64 h-64 bg-olive/15 -bottom-32 -left-32 animate-pulse-soft" />

      <div className="max-w-lg mx-auto relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-10 animate-pulse mb-4">
          <div className="h-10 bg-olive/20 rounded-2xl w-40 mx-auto mb-2" />
          <div className="h-3 bg-olive/10 rounded-full w-20 mx-auto mb-8" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-olive/15 rounded-full" style={{ width: `${85 + (i % 3) * 5}%` }} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
