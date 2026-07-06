import { StorefrontLoadingShell } from "./StorefrontLoadingShell";

export function StorefrontOrdersSkeleton() {
  return (
    <StorefrontLoadingShell>
      <main className="sf-section w-full py-12 md:py-16">
        <div className="mb-8 space-y-3">
          <div className="sf-skeleton h-3 w-16" />
          <div className="sf-skeleton h-10 w-48" />
          <div className="sf-skeleton h-4 w-32" />
        </div>
        <div className="mb-8 flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="sf-skeleton h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="sf-editorial-card space-y-3 p-6">
              <div className="flex justify-between">
                <div className="sf-skeleton h-4 w-28" />
                <div className="sf-skeleton h-4 w-20" />
              </div>
              <div className="sf-skeleton h-3 w-full max-w-md" />
              <div className="sf-skeleton h-9 w-32 rounded-full" />
            </div>
          ))}
        </div>
      </main>
    </StorefrontLoadingShell>
  );
}
