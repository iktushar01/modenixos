import { StorefrontLoadingShell } from "./StorefrontLoadingShell";

export function StorefrontCheckoutSkeleton() {
  return (
    <StorefrontLoadingShell>
      <main className="sf-section w-full py-12 md:py-16">
        <div className="mb-12 flex items-center justify-center gap-4 md:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-4">
              <div className="sf-skeleton h-8 w-8 rounded-full" />
              <div className="sf-skeleton hidden h-3 w-14 sm:block" />
              {i < 2 && <div className="sf-skeleton hidden h-px w-8 md:block" />}
            </div>
          ))}
        </div>
        <div className="sf-skeleton mb-10 h-10 w-40" />
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div className="space-y-10">
            <section className="space-y-4">
              <div className="sf-skeleton h-3 w-16" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sf-skeleton h-10 w-full" />
                <div className="sf-skeleton h-10 w-full" />
              </div>
              <div className="sf-skeleton h-10 w-full" />
            </section>
            <section className="space-y-4">
              <div className="sf-skeleton h-3 w-20" />
              <div className="sf-skeleton h-10 w-full" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sf-skeleton h-10 w-full" />
                <div className="sf-skeleton h-10 w-full" />
              </div>
            </section>
            <section className="space-y-4">
              <div className="sf-skeleton h-3 w-20" />
              <div className="sf-skeleton h-12 w-44" />
            </section>
            <div className="sf-skeleton h-12 w-full rounded-full sm:w-48" />
          </div>
          <aside className="sf-editorial-card h-fit space-y-4 p-8">
            <div className="sf-skeleton h-6 w-36" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <div className="sf-skeleton h-3 flex-1" />
                  <div className="sf-skeleton h-3 w-12 shrink-0" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <div className="sf-skeleton h-10 flex-1" />
              <div className="sf-skeleton h-10 w-16" />
            </div>
            <div className="space-y-2 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="sf-skeleton h-3 w-16" />
                  <div className="sf-skeleton h-3 w-14" />
                </div>
              ))}
            </div>
            <div className="sf-border flex justify-between border-t pt-5">
              <div className="sf-skeleton h-4 w-12" />
              <div className="sf-skeleton h-6 w-20" />
            </div>
          </aside>
        </div>
      </main>
    </StorefrontLoadingShell>
  );
}
