export default function StoreLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-black">
      <div className="h-16 border-b border-white/10 bg-zinc-900/50" />
      <div className="min-h-[85vh] bg-zinc-900/30" />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-20 md:px-6">
        <div className="h-8 w-48 rounded bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
