import dynamic from "next/dynamic";
import { DashboardAnalyticsSkeleton } from "@/components/shared/DashboardPageSkeleton";

const AnalyticsPage = dynamic(
  () => import("@/components/modules/analytics/AnalyticsPage"),
  {
    loading: () => <DashboardAnalyticsSkeleton />,
    ssr: true,
  },
);

export default function Page() {
  return <AnalyticsPage />;
}
