export default function Loading() {
  return (
    <main className="figtree min-h-screen flex flex-col items-center justify-center px-5 py-12 bg-gradient-main texture-overlay relative overflow-hidden">
      <div className="decorative-circle w-80 h-80 bg-pine/25 -top-40 -right-40 animate-pulse-soft" />
      <div className="decorative-circle w-64 h-64 bg-olive/15 -bottom-32 -left-32 animate-pulse-soft" />

      <div className="max-w-lg w-full relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-10 animate-pulse">
          <div className="h-10 bg-olive/20 rounded-2xl w-48 mx-auto mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-olive/15 rounded-full w-full" />
            <div className="h-4 bg-olive/15 rounded-full w-5/6 mx-auto" />
            <div className="h-4 bg-olive/15 rounded-full w-4/6 mx-auto" />
          </div>
        </div>
      </div>
    </main>
  );
}
