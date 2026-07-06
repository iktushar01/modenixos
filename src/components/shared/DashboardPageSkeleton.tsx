import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardSkeletonVariant } from "@/lib/dashboard/navigation";

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading page">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-full sm:w-44" />
      </div>
      <div className="space-y-2 rounded-lg border p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Skeleton className="h-36 w-full rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

export function DashboardAnalyticsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading analytics">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[300px] w-full rounded-xl" />
    </div>
  );
}

export function DashboardFormSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-6" role="status" aria-label="Loading form">
      {!compact && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      )}
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
      {!compact && <Skeleton className="h-40 w-full rounded-xl" />}
    </div>
  );
}

export function getDashboardSkeletonForPath(pathname: string) {
  const variant = getDashboardSkeletonVariant(pathname);
  switch (variant) {
    case "overview":
      return <DashboardOverviewSkeleton />;
    case "analytics":
      return <DashboardAnalyticsSkeleton />;
    case "form-compact":
      return <DashboardFormSkeleton compact />;
    case "form":
      return <DashboardFormSkeleton />;
    default:
      return <DashboardPageSkeleton />;
  }
}
