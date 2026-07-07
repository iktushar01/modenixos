"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsFunnel } from "@/types/store.types";
import { AnalyticsUpgradePanel } from "./AnalyticsUpgradePanel";

interface AnalyticsFunnelSectionProps {
  funnel: AnalyticsFunnel | null;
  advancedAnalytics: boolean;
}

const STEPS: Array<{ key: keyof AnalyticsFunnel; label: string }> = [
  { key: "visitors", label: "Visitors" },
  { key: "productViews", label: "Product views" },
  { key: "addToCart", label: "Add to cart" },
  { key: "checkoutStarted", label: "Checkout started" },
  { key: "purchases", label: "Purchases" },
];

export function AnalyticsFunnelSection({ funnel, advancedAnalytics }: AnalyticsFunnelSectionProps) {
  if (!advancedAnalytics) {
    return <AnalyticsUpgradePanel />;
  }

  if (!funnel) return null;

  const maxValue = Math.max(...STEPS.map((step) => Number(funnel[step.key]) || 0), 1);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Conversion funnel</h3>
        <p className="text-sm text-muted-foreground">
          Storefront journey from visit to purchase
          {funnel.conversionRate != null ? ` · ${funnel.conversionRate}% overall conversion` : ""}
        </p>
      </div>

      <Card className="dashboard-panel border-0 bg-transparent shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Funnel steps</CardTitle>
          <CardDescription>Counts for the selected date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {STEPS.map((step, index) => {
            const value = Number(funnel[step.key]) || 0;
            const width = Math.max(8, Math.round((value / maxValue) * 100));
            const prevValue = index > 0 ? Number(funnel[STEPS[index - 1]!.key]) || 0 : null;
            const stepRate =
              prevValue && prevValue > 0 ? Math.round((value / prevValue) * 1000) / 10 : null;

            return (
              <div key={step.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{step.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {value.toLocaleString()}
                    {stepRate != null ? ` · ${stepRate}% of previous` : ""}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
