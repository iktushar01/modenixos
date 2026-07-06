"use client";

import { motion, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Package, ShoppingCart, TrendingUp } from "lucide-react";
import type { IndustryPreview } from "../landing-data";
import { cn } from "@/lib/utils";

type HeroDashboardProps = {
  industry: IndustryPreview;
};

export function RevenueCard({
  label,
  value,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mkt-glass-card rounded-xl p-2.5 sm:p-3">
      <Icon className="mb-1 h-3.5 w-3.5 text-primary" aria-hidden />
      <p className="text-sm font-bold sm:text-base">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{trend}</p>
      </div>
    </div>
  );
}

export function MiniChart({ heights, accent }: { heights: number[]; accent: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex h-16 items-end gap-1 sm:h-20" role="img" aria-label="Revenue chart">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className={cn("flex-1 rounded-sm bg-gradient-to-t", accent)}
          initial={reduceMotion ? { height: `${h}%` } : { height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.4 + i * 0.06, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function HeroDashboard({ industry }: HeroDashboardProps) {
  const reduceMotion = useReducedMotion();

  const stats = [
    { label: "Revenue", value: industry.revenue, icon: TrendingUp, trend: industry.revenueTrend },
    { label: "Orders", value: industry.orders, icon: ShoppingCart, trend: industry.ordersTrend },
    { label: "Products", value: industry.products, icon: Package, trend: "Live" },
    { label: "Conversion", value: industry.conversion, icon: BarChart3, trend: "+0.6%" },
  ];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-lg lg:max-w-none"
    >
      <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-primary/5 blur-3xl" aria-hidden />

      <div className="mkt-glass-panel relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-3 backdrop-blur-sm">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="mx-auto flex h-7 max-w-[240px] flex-1 items-center justify-center rounded-lg bg-background/60 px-3 text-[10px] text-muted-foreground sm:text-xs">
            app.modenixos.com/dashboard
          </div>
        </div>

        <div className="flex min-h-[320px] bg-background/40 sm:min-h-[360px]">
          <aside className="hidden w-14 shrink-0 border-r border-border/40 bg-muted/10 py-4 sm:block" aria-hidden>
            <div className="mx-auto mb-4 h-8 w-8 rounded-lg bg-primary/15" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn("mx-auto mb-2 h-6 w-6 rounded-md", i === 1 ? "bg-primary/25" : "bg-muted/50")}
              />
            ))}
          </aside>

          <div className="flex-1 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Overview</p>
                <motion.p
                  key={industry.storeName}
                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-semibold sm:text-base"
                >
                  {industry.storeName}
                </motion.p>
              </div>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium", industry.accentMuted)}>
                Store live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {stats.map((stat) => (
                <RevenueCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="mkt-glass-card mt-3 rounded-xl p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium">Weekly revenue</span>
                <span className="text-emerald-600 dark:text-emerald-400">{industry.revenueTrend}</span>
              </div>
              <MiniChart heights={industry.chartHeights} accent={industry.accent} />
            </div>

            <div className="mkt-glass-card mt-3 rounded-xl p-3">
              <p className="text-xs font-medium">Recent activity</p>
              {industry.recentOrders.slice(0, 2).map((order) => (
                <div
                  key={order}
                  className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] first:mt-2 first:border-0 first:pt-0"
                >
                  <span className="truncate text-muted-foreground">{order}</span>
                  <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400">
                    Paid
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: 16, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mkt-glass-panel absolute -bottom-4 -left-2 hidden rounded-xl px-3 py-2 shadow-lg sm:block lg:-left-6"
        role="status"
        aria-live="polite"
      >
        <p className="text-[10px] text-muted-foreground">{industry.notification.title}</p>
        <p className="text-xs font-semibold">{industry.notification.subtitle}</p>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -12, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="mkt-glass-panel absolute -right-2 top-8 hidden rounded-xl px-3 py-2 shadow-lg sm:block lg:-right-6"
        aria-hidden
      >
        <p className="text-[10px] text-muted-foreground">Customers</p>
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+12% this week</p>
      </motion.div>
    </motion.div>
  );
}
