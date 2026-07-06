import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatVariant = "warm" | "emerald" | "sky" | "violet";

const variantStyles: Record<StatVariant, { card: string; glow: string; icon: string }> = {
  warm: {
    card: "dashboard-stat-warm",
    glow: "bg-amber-400",
    icon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  emerald: {
    card: "dashboard-stat-emerald",
    glow: "bg-emerald-400",
    icon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  sky: {
    card: "dashboard-stat-sky",
    glow: "bg-sky-400",
    icon: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  },
  violet: {
    card: "dashboard-stat-violet",
    glow: "bg-primary",
    icon: "bg-primary/15 text-primary",
  },
};

interface DashboardStatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  variant?: StatVariant;
  className?: string;
}

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  variant = "violet",
  className,
}: DashboardStatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn("dashboard-stat-card group", styles.card, className)}>
      <span className={cn("dashboard-stat-glow", styles.glow)} aria-hidden />
      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 truncate text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            styles.icon,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
