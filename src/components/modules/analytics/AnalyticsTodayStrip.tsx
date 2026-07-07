"use client";

import { Eye, Percent, Receipt, ShoppingCart } from "lucide-react";
import type { AnalyticsOverview } from "@/types/store.types";
import { formatPrice } from "@/lib/currency";
import { AnalyticsKpiCard } from "./AnalyticsKpiCard";

interface AnalyticsTodayStripProps {
  overview: AnalyticsOverview;
  currency: string;
}

export function AnalyticsTodayStrip({ overview, currency }: AnalyticsTodayStripProps) {
  const today = overview.today;

  const kpis = [
    {
      label: "Today's revenue",
      value: formatPrice(today.revenue, currency),
      icon: Receipt,
      variant: "warm" as const,
    },
    {
      label: "Today's orders",
      value: today.orders,
      icon: ShoppingCart,
      variant: "violet" as const,
    },
    {
      label: "Visitors today",
      value: today.visitors ?? 0,
      icon: Eye,
      variant: "sky" as const,
    },
    {
      label: "Conversion today",
      value: today.conversionRate != null ? `${today.conversionRate}%` : "—",
      icon: Percent,
      variant: "emerald" as const,
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Today at a glance</h2>
        <p className="text-sm text-muted-foreground">Live performance since midnight</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <AnalyticsKpiCard key={kpi.label} {...kpi} />
        ))}
      </div>
    </section>
  );
}
