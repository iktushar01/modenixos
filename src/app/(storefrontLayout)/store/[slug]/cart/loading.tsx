export default function CartLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-black">
      <div className="h-16 border-b border-white/10 bg-zinc-900/50" />
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="mb-10 h-10 w-48 rounded bg-white/10" />
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/5" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
