import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { DashboardStatCard } from "@/components/shared/DashboardStatCard";
import { cn } from "@/lib/utils";
import { formatTrend } from "./analytics.utils";

type StatVariant = "warm" | "emerald" | "sky" | "violet";

interface AnalyticsKpiCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  variant?: StatVariant;
  change?: number | null;
  subtitle?: string;
}

export function AnalyticsKpiCard({
  label,
  value,
  icon,
  variant = "violet",
  change,
  subtitle,
}: AnalyticsKpiCardProps) {
  const trend = formatTrend(change);

  return (
    <div className="space-y-2">
      <DashboardStatCard label={label} value={value} icon={icon} variant={variant} />
      {(change !== undefined || subtitle) && (
        <div className="flex items-center gap-1.5 px-1 text-xs">
          {change !== undefined && trend.positive !== null && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
              )}
            >
              {trend.positive ? (
                <TrendingUp className="h-3 w-3" aria-hidden />
              ) : (
                <TrendingDown className="h-3 w-3" aria-hidden />
              )}
              {trend.label}
            </span>
          )}
          {change !== undefined && trend.positive === null && (
            <span className="text-muted-foreground">{trend.label}</span>
          )}
          {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
