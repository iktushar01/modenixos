"use client";

import { PageHeader } from "@/components/shared/PageHeader";
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

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Detailed insights into your store performance." />

      <DashboardAsyncContent
        showPlaceholder={showPlaceholder}
        skeleton={<DashboardAnalyticsSkeleton />}
      >
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Revenue", value: formatPrice(overview?.revenue ?? 0, currency) },
            { label: "Orders", value: overview?.orders ?? 0 },
            { label: "Products", value: overview?.products ?? 0 },
            { label: "Customers", value: overview?.customers ?? 0 },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{s.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {charts?.monthlyRevenue && charts.monthlyRevenue.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ revenue: { label: "Revenue", color: "hsl(var(--chart-1))" } }}
                className="h-[300px] w-full"
              >
                <BarChart data={charts.monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </DashboardAsyncContent>
    </div>
  );
}
