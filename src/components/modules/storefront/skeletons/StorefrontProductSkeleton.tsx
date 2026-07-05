import { StorefrontLoadingShell } from "./StorefrontLoadingShell";

export function StorefrontProductSkeleton() {
  return (
    <StorefrontLoadingShell>
      <main className="sf-section w-full py-8 md:py-12">
        <div className="mb-8 flex items-center gap-2">
          <div className="sf-skeleton h-3 w-10" />
          <div className="sf-skeleton h-3 w-3" />
          <div className="sf-skeleton h-3 w-16" />
          <div className="sf-skeleton h-3 w-3" />
          <div className="sf-skeleton h-3 w-32" />
        </div>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="sf-skeleton aspect-[4/5] w-full" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="sf-skeleton aspect-square w-20 shrink-0" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="sf-skeleton h-3 w-20" />
              <div className="sf-skeleton h-10 w-4/5" />
              <div className="sf-skeleton h-6 w-28" />
            </div>
            <div className="sf-skeleton h-4 w-full max-w-md" />
            <div className="space-y-3">
              <div className="sf-skeleton h-3 w-12" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="sf-skeleton h-10 w-10 rounded-full" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="sf-skeleton h-3 w-10" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="sf-skeleton h-10 w-12" />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <div className="sf-skeleton h-12 flex-1 rounded-full" />
              <div className="sf-skeleton h-12 w-12 rounded-full" />
            </div>
          </div>
        </div>
        <div className="mt-16 space-y-6">
          <div className="flex gap-6 border-b sf-border pb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="sf-skeleton h-4 w-20" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="sf-skeleton h-3 w-full" />
            <div className="sf-skeleton h-3 w-full max-w-2xl" />
            <div className="sf-skeleton h-3 w-full max-w-xl" />
          </div>
        </div>
        <div className="mt-16">
          <div className="sf-skeleton mb-8 h-8 w-44" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="sf-skeleton aspect-[3/4]" />
                <div className="sf-skeleton h-4 w-3/4" />
                <div className="sf-skeleton h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </StorefrontLoadingShell>
  );
}
