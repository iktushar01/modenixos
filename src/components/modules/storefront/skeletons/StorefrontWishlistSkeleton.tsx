import { StorefrontLoadingShell } from "./StorefrontLoadingShell";

export function StorefrontWishlistSkeleton() {
  return (
    <StorefrontLoadingShell>
      <main className="sf-section w-full py-12 md:py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="sf-skeleton h-3 w-12" />
            <div className="sf-skeleton h-10 w-48" />
            <div className="sf-skeleton h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <div className="sf-skeleton h-10 w-24 rounded-full" />
            <div className="sf-skeleton h-10 w-36 rounded-full" />
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <article key={i} className="sf-editorial-card overflow-hidden">
              <div className="sf-skeleton aspect-[3/4] w-full" />
              <div className="space-y-2 p-4">
                <div className="sf-skeleton h-4 w-full" />
                <div className="sf-skeleton h-4 w-2/3" />
                <div className="sf-skeleton h-4 w-16" />
              </div>
            </article>
          ))}
        </div>
      </main>
    </StorefrontLoadingShell>
  );
}
