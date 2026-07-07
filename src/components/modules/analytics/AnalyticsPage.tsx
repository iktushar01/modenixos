"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  DollarSign,
  Eye,
  Percent,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAnalyticsOverviewAction, getAnalyticsChartsAction } from "@/actions/catalog.actions";
import { formatPrice, getCurrencyName } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { DashboardAnalyticsSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { DashboardAsyncContent } from "@/components/shared/DashboardAsyncContent";
import { useDashboardQuery } from "@/hooks/useDashboardQuery";
import type { AnalyticsRangeKey } from "@/types/store.types";
import { cn } from "@/lib/utils";
import { AnalyticsKpiCard } from "./AnalyticsKpiCard";
import { AnalyticsChartsSection } from "./AnalyticsChartsSection";
import { AnalyticsTablesSection } from "./AnalyticsTablesSection";
import { AnalyticsRangePicker } from "./AnalyticsRangePicker";
import { AnalyticsTodayStrip } from "./AnalyticsTodayStrip";
import { AnalyticsCustomersSection } from "./AnalyticsCustomersSection";
import { AnalyticsSalesInsights } from "./AnalyticsSalesInsights";
import { AnalyticsMarketingSection } from "./AnalyticsMarketingSection";
import { AnalyticsFunnelSection } from "./AnalyticsFunnelSection";

type AnalyticsTab = "overview" | "sales" | "customers" | "products" | "marketing" | "funnel";

const TABS: Array<{ id: AnalyticsTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "sales", label: "Sales" },
  { id: "customers", label: "Customers" },
  { id: "products", label: "Products" },
  { id: "marketing", label: "Marketing" },
  { id: "funnel", label: "Funnel" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRangeKey>("30d");
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";
  const advancedAnalytics =
    store?.plan === "PRO_PLUS" || store?.plan === "ULTRA";

  const { data: overview, isPending: overviewPending } = useDashboardQuery({
    queryKey: ["analytics-overview", range],
    queryFn: () => getAnalyticsOverviewAction(range),
  });

  const { data: charts, isPending: chartsPending, isError: chartsError } = useDashboardQuery({
    queryKey: ["analytics-charts", range],
    queryFn: () => getAnalyticsChartsAction(range),
  });

  const showPlaceholder = overviewPending && overview === undefined;
  const periodLabel = overview?.period.label ?? "Selected period";

  const periodKpis = [
    {
      label: `Revenue (${periodLabel.toLowerCase()})`,
      value: formatPrice(overview?.period.revenue ?? 0, currency),
      icon: DollarSign,
      variant: "warm" as const,
      change: overview?.changes.revenue,
    },
    {
      label: `Orders (${periodLabel.toLowerCase()})`,
      value: overview?.period.orders ?? 0,
      icon: ShoppingCart,
      variant: "violet" as const,
      change: overview?.changes.orders,
    },
    {
      label: "Visitors",
      value: overview?.period.visitors ?? 0,
      icon: Eye,
      variant: "sky" as const,
      change: overview?.changes.visitors,
    },
    {
      label: "Conversion rate",
      value:
        overview?.period.conversionRate != null ? `${overview.period.conversionRate}%` : "—",
      icon: Percent,
      variant: "emerald" as const,
      change: overview?.changes.conversionRate,
    },
    {
      label: "New customers",
      value: overview?.period.newCustomers ?? 0,
      icon: Users,
      variant: "emerald" as const,
      change: overview?.changes.newCustomers,
    },
    {
      label: "Avg. order value",
      value: formatPrice(overview?.period.aov ?? overview?.aov ?? 0, currency),
      icon: Receipt,
      variant: "sky" as const,
      change: overview?.changes.aov,
    },
  ];

  const lifetimeKpis = [
    {
      label: "Lifetime revenue",
      value: formatPrice(overview?.revenue ?? 0, currency),
      icon: TrendingUp,
      variant: "warm" as const,
    },
    {
      label: "Total orders",
      value: overview?.orders ?? 0,
      icon: ShoppingCart,
      variant: "violet" as const,
    },
    {
      label: "Total customers",
      value: overview?.customers ?? 0,
      icon: Users,
      variant: "emerald" as const,
    },
    {
      label: "Lifetime AOV",
      value: formatPrice(overview?.aov ?? 0, currency),
      icon: Receipt,
      variant: "sky" as const,
    },
  ];

  return (
    <div className="dashboard-page">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Revenue, visitors, conversion, and marketing performance for your store."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {store?.currency && (
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                {store.currency} · {getCurrencyName(store.currency)}
              </Badge>
            )}
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/dashboard/orders">
                <BarChart3 className="h-3.5 w-3.5" />
                All orders
              </Link>
            </Button>
          </div>
        }
      />

      <DashboardAsyncContent
        showPlaceholder={showPlaceholder}
        skeleton={<DashboardAnalyticsSkeleton />}
      >
        <div className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1 rounded-xl border border-border/60 bg-muted/20 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <AnalyticsRangePicker
              value={range}
              onChange={setRange}
              advancedAnalytics={advancedAnalytics}
            />
          </div>

          {overview && <AnalyticsTodayStrip overview={overview} currency={currency} />}

          {activeTab === "overview" && (
            <>
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">{periodLabel}</h2>
                  <p className="text-sm text-muted-foreground">
                    Compared to {overview?.previousPeriod.label.toLowerCase() ?? "the prior period"}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {periodKpis.map((kpi) => (
                    <AnalyticsKpiCard key={kpi.label} {...kpi} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">Lifetime totals</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {lifetimeKpis.map((kpi) => (
                    <AnalyticsKpiCard key={kpi.label} {...kpi} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Performance charts</h2>
                  <p className="text-sm text-muted-foreground">
                    Revenue and order trends for {periodLabel.toLowerCase()}
                  </p>
                </div>

                {chartsPending && !charts ? (
                  <Card className="dashboard-panel">
                    <CardContent className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
                      Loading charts…
                    </CardContent>
                  </Card>
                ) : chartsError ? (
                  <Card className="dashboard-panel">
                    <CardContent className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                      Could not load charts. Refresh the page to try again.
                    </CardContent>
                  </Card>
                ) : charts && overview ? (
                  <AnalyticsChartsSection charts={charts} overview={overview} currency={currency} />
                ) : null}
              </section>
            </>
          )}

          {activeTab === "sales" && overview && (
            <AnalyticsSalesInsights overview={overview} currency={currency} />
          )}

          {activeTab === "customers" && overview && (
            <AnalyticsCustomersSection overview={overview} currency={currency} />
          )}

          {activeTab === "products" && overview && (
            <AnalyticsTablesSection overview={overview} currency={currency} />
          )}

          {activeTab === "marketing" && overview && (
            <AnalyticsMarketingSection overview={overview} currency={currency} />
          )}

          {activeTab === "funnel" && overview && (
            <AnalyticsFunnelSection
              funnel={overview.funnel}
              advancedAnalytics={advancedAnalytics}
            />
          )}
        </div>
      </DashboardAsyncContent>
    </div>
  );
}
