import { Suspense } from "react";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

export default function DashboardSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<DashboardPageSkeleton />}>{children}</Suspense>;
}
