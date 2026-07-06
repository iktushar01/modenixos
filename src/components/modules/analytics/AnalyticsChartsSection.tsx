"use client";

import { useId } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AnalyticsCharts, AnalyticsOverview } from "@/types/store.types";
import { formatPrice } from "@/lib/currency";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "./analytics.utils";

interface AnalyticsChartsSectionProps {
  charts: AnalyticsCharts;
  overview: AnalyticsOverview;
  currency: string;
}

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
};

const ordersChartConfig = {
  orders: { label: "Orders", color: "var(--chart-2)" },
};

const dailyChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-3)" },
};

function TrendChart({
  data,
  dataKey,
  xKey,
  color,
  currency,
  config,
  heightClass = "h-[300px]",
  xInterval,
}: {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  xKey: string;
  color: string;
  currency: string;
  config: Record<string, { label: string; color: string }>;
  heightClass?: string;
  xInterval?: number | "preserveStartEnd";
}) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <ChartContainer config={config} className={`w-full ${heightClass}`}>
      <ComposedChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          interval={xInterval ?? "preserveStartEnd"}
          minTickGap={20}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatPrice(v, currency)}
          width={76}
          domain={[0, "auto"]}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent formatter={(value) => formatPrice(Number(value), currency)} />
          }
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          fill={`url(#${gradientId})`}
          stroke="none"
          isAnimationActive
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          dot={{ r: 3.5, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 5.5, fill: color, stroke: "var(--background)", strokeWidth: 2 }}
          isAnimationActive
        />
      </ComposedChart>
    </ChartContainer>
  );
}

export function AnalyticsChartsSection({ charts, overview, currency }: AnalyticsChartsSectionProps) {
  const statusData = overview.orderStatusBreakdown
    .filter((item) => item.count > 0)
    .map((item) => ({
      status: item.status,
      label: ORDER_STATUS_LABELS[item.status],
      count: item.count,
      fill: ORDER_STATUS_COLORS[item.status],
    }));

  const statusChartConfig = Object.fromEntries(
    statusData.map((item) => [item.status, { label: item.label, color: item.fill }]),
  );

  const bestSellerData = overview.bestSellers.slice(0, 6).map((item) => ({
    name: item.name.length > 22 ? `${item.name.slice(0, 22)}…` : item.name,
    revenue: item.revenue,
    quantity: item.quantity,
  }));

  const bestSellerConfig = {
    revenue: { label: "Revenue", color: "var(--chart-1)" },
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {charts.monthlyRevenue.length > 0 && (
          <Card className="dashboard-panel dashboard-panel-hover border-0 bg-transparent shadow-none">
            <CardHeader className="pb-2">
              <CardTitle>Monthly revenue</CardTitle>
              <CardDescription>Revenue trend over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart
                data={charts.monthlyRevenue}
                dataKey="revenue"
                xKey="label"
                color="var(--chart-1)"
                currency={currency}
                config={revenueChartConfig}
              />
            </CardContent>
          </Card>
        )}

        {charts.monthlyOrders.length > 0 && (
          <Card className="dashboard-panel dashboard-panel-hover border-0 bg-transparent shadow-none">
            <CardHeader className="pb-2">
              <CardTitle>Monthly orders</CardTitle>
              <CardDescription>Order volume by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={ordersChartConfig} className="h-[300px] w-full">
                <BarChart data={charts.monthlyOrders} margin={{ left: 4, right: 4 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill="var(--color-orders)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {charts.dailyRevenue.length > 0 && (
          <Card className="dashboard-panel dashboard-panel-hover border-0 bg-transparent shadow-none xl:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Daily revenue</CardTitle>
              <CardDescription>Daily revenue wave for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart
                data={charts.dailyRevenue}
                dataKey="revenue"
                xKey="label"
                color="var(--chart-3)"
                currency={currency}
                config={dailyChartConfig}
                heightClass="h-[280px]"
                xInterval={4}
              />
            </CardContent>
          </Card>
        )}

        {statusData.length > 0 && (
          <Card className="dashboard-panel dashboard-panel-hover border-0 bg-transparent shadow-none">
            <CardHeader className="pb-2">
              <CardTitle>Orders by status</CardTitle>
              <CardDescription>All-time fulfillment mix</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={statusChartConfig} className="mx-auto h-[280px] w-full max-w-[280px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.status} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="label" />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {bestSellerData.length > 0 && (
        <Card className="dashboard-panel dashboard-panel-hover border-0 bg-transparent shadow-none">
          <CardHeader className="pb-2">
            <CardTitle>Top products by revenue</CardTitle>
            <CardDescription>Best performers in the last 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={bestSellerConfig} className="h-[260px] w-full">
              <BarChart data={bestSellerData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatPrice(v, currency)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) =>
                        name === "revenue"
                          ? formatPrice(Number(value), currency)
                          : String(value)
                      }
                    />
                  }
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
