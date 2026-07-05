import { StorefrontLoadingShell } from "./StorefrontLoadingShell";

export function StorefrontHomeSkeleton() {
  return (
    <StorefrontLoadingShell>
      <div className="sf-skeleton mx-auto h-[55vh] max-w-none" />
      <div className="sf-section mx-auto w-full py-12 md:py-16">
        <div className="sf-skeleton mx-auto mb-10 h-4 w-32" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="sf-skeleton aspect-square rounded-2xl" />
              <div className="sf-skeleton mx-auto h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="sf-section mx-auto w-full pb-12 md:pb-16">
        <div className="sf-skeleton mb-8 h-10 w-48" />
        <div className="flex gap-8">
          <div className="sf-skeleton hidden h-96 w-64 shrink-0 rounded-2xl lg:block" />
          <div className="grid flex-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="sf-skeleton aspect-[3/4] rounded-2xl" />
                <div className="sf-skeleton h-4 w-3/4" />
                <div className="sf-skeleton h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sf-muted mx-auto w-full py-16">
        <div className="sf-section mx-auto max-w-xl space-y-4 text-center">
          <div className="sf-skeleton mx-auto h-8 w-56" />
          <div className="sf-skeleton mx-auto h-4 w-full max-w-md" />
          <div className="sf-skeleton mx-auto mt-4 h-11 w-72 rounded-full" />
        </div>
      </div>
    </StorefrontLoadingShell>
  );
}
