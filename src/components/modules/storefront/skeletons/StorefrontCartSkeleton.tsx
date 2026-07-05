import { StorefrontLoadingShell } from "./StorefrontLoadingShell";

export function StorefrontCartSkeleton() {
  return (
    <StorefrontLoadingShell>
      <main className="sf-section w-full py-12 md:py-16">
        <div className="sf-skeleton mb-10 h-4 w-36" />
        <div className="mb-12 flex items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="sf-skeleton h-3 w-16" />
            <div className="sf-skeleton h-10 w-56" />
          </div>
          <div className="sf-skeleton hidden h-3 w-20 sm:block" />
        </div>
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="sf-editorial-card flex gap-5 p-5 md:gap-6 md:p-6">
                <div className="sf-skeleton h-28 w-24 shrink-0 md:h-32 md:w-28" />
                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="sf-skeleton h-5 w-3/4" />
                    <div className="sf-skeleton h-3 w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="sf-skeleton h-9 w-28 rounded-full" />
                    <div className="sf-skeleton hidden h-4 w-16 sm:block" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sf-editorial-card h-fit space-y-4 p-8">
            <div className="sf-skeleton h-6 w-36" />
            <div className="sf-skeleton h-3 w-44" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="sf-skeleton h-3 w-16" />
                  <div className="sf-skeleton h-3 w-14" />
                </div>
              ))}
            </div>
            <div className="sf-skeleton mt-6 h-12 w-full rounded-full" />
          </div>
        </div>
      </main>
    </StorefrontLoadingShell>
  );
}
