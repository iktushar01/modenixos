/** Content-only skeleton — header/footer stay mounted via StorefrontInnerLayout. */
export function StorefrontStaticPageSkeleton() {
  return (
    <main className="sf-section w-full animate-pulse py-12 md:py-16">
      <div className="sf-skeleton mb-8 h-3 w-20" />
      <div className="sf-skeleton mb-4 h-10 w-56 max-w-full" />
      <div className="sf-skeleton mb-8 h-4 w-full max-w-xl" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="sf-editorial-card h-24 rounded-lg" />
        ))}
      </div>
    </main>
  );
}
