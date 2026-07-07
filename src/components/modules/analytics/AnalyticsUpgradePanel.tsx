import Link from "next/link";
import { BarChart3, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AnalyticsUpgradePanel() {
  return (
    <Card className="dashboard-panel relative overflow-hidden border-dashed">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.08),transparent_50%,hsl(var(--chart-2)/0.06))]"
        aria-hidden
      />
      <CardContent className="relative flex flex-col items-center gap-4 px-6 py-10 text-center sm:py-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="h-5 w-5" />
        </span>
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">Unlock advanced analytics</h3>
          <p className="text-sm text-muted-foreground">
            Conversion funnel, 90-day ranges, and visitor insights are available on Pro+ and
            Ultra Pro+ plans.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button asChild className="gap-1.5">
            <Link href="/dashboard/settings/billing">
              <Sparkles className="h-4 w-4" />
              Upgrade plan
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-1.5">
            <Link href="/dashboard/settings/billing">
              <BarChart3 className="h-4 w-4" />
              Compare plans
            </Link>
          </Button>
        </div>
        <div className="mt-2 grid w-full max-w-lg grid-cols-3 gap-2 opacity-40" aria-hidden>
          {[68, 42, 85, 55, 72, 48, 90, 60, 78].map((h, i) => (
            <div
              key={i}
              className="rounded-md bg-gradient-to-t from-primary/40 to-primary/10"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
