import { StorefrontLoadingShell } from "./StorefrontLoadingShell";

interface StorefrontAuthSkeletonProps {
  fieldCount?: number;
}

export function StorefrontAuthSkeleton({ fieldCount = 2 }: StorefrontAuthSkeletonProps) {
  return (
    <StorefrontLoadingShell>
      <main className="sf-section w-full py-12 md:py-16">
        <div className="sf-border sf-card mx-auto w-full max-w-md overflow-hidden border p-8 md:p-10">
          <div className="sf-skeleton h-8 w-36" />
          <div className="sf-skeleton mt-3 h-4 w-full max-w-xs" />
          <div className="mt-8 space-y-4">
            {Array.from({ length: fieldCount }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="sf-skeleton h-3 w-16" />
                <div className="sf-skeleton h-10 w-full" />
              </div>
            ))}
            <div className="sf-skeleton h-11 w-full rounded-full" />
          </div>
          <div className="sf-skeleton mx-auto mt-6 h-4 w-48" />
        </div>
      </main>
    </StorefrontLoadingShell>
  );
}
