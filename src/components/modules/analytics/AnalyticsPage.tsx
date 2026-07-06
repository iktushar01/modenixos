"use client";

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardStatCard } from "@/components/shared/DashboardStatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsOverviewAction, getAnalyticsChartsAction } from "@/actions/catalog.actions";
import { formatPrice } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { DashboardAnalyticsSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { DashboardAsyncContent } from "@/components/shared/DashboardAsyncContent";
import { useDashboardQuery } from "@/hooks/useDashboardQuery";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export default function AnalyticsPage() {
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";

  const { data: overview, isPending: overviewPending } = useDashboardQuery({
    queryKey: ["analytics-overview"],
    queryFn: getAnalyticsOverviewAction,
  });

  const { data: charts, isPending: chartsPending } = useDashboardQuery({
    queryKey: ["analytics-charts"],
    queryFn: getAnalyticsChartsAction,
  });

  const showPlaceholder =
    (overviewPending && overview === undefined) || (chartsPending && charts === undefined);

  const stats = [
    {
      label: "Revenue",
      value: formatPrice(overview?.revenue ?? 0, currency),
      icon: DollarSign,
      variant: "warm" as const,
    },
    {
      label: "Orders",
      value: overview?.orders ?? 0,
      icon: ShoppingCart,
      variant: "violet" as const,
    },
    {
      label: "Products",
      value: overview?.products ?? 0,
      icon: Package,
      variant: "sky" as const,
    },
    {
      label: "Customers",
      value: overview?.customers ?? 0,
      icon: Users,
      variant: "emerald" as const,
    },
  ];

  return (
    <div className="dashboard-page">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Detailed insights into your store performance."
      />

      <DashboardAsyncContent
        showPlaceholder={showPlaceholder}
        skeleton={<DashboardAnalyticsSkeleton />}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <DashboardStatCard
              key={s.label}
              label={s.label}
              value={s.value}
              icon={s.icon}
              variant={s.variant}
            />
          ))}
        </div>

        {charts?.monthlyRevenue && charts.monthlyRevenue.length > 0 && (
          <Card className="dashboard-panel dashboard-panel-hover mt-2 border-0 bg-transparent shadow-none">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ revenue: { label: "Revenue", color: "hsl(var(--chart-1))" } }}
                className="h-[280px] w-full sm:h-[320px]"
              >
                <BarChart data={charts.monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </DashboardAsyncContent>
    </div>
  );
}
