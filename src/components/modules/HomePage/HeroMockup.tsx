"use client";

import { motion } from "motion/react";
import { BarChart3, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-lg perspective-[1200px] lg:max-w-none"
    >
      <div className="absolute -inset-4 rounded-md bg-[#7047EB]/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-md border border-border bg-card shadow-xl shadow-black/10 dark:shadow-black/40">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="mx-auto flex h-7 max-w-[220px] flex-1 items-center justify-center rounded-md bg-background/80 px-3 text-[10px] text-muted-foreground sm:max-w-xs sm:text-xs">
            modenixos.com/dashboard
          </div>
        </div>

        {/* Dashboard mock */}
        <div className="flex min-h-[280px] bg-background sm:min-h-[320px]">
          <aside className="hidden w-14 shrink-0 border-r border-border/50 bg-muted/20 py-4 sm:block">
            <div className="mx-auto mb-4 h-8 w-8 rounded-lg bg-primary/10" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mx-auto mb-2 h-6 w-6 rounded-md bg-muted/60" />
            ))}
          </aside>
          <div className="flex-1 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Good morning</p>
                <p className="text-sm font-semibold sm:text-base">Luxe Threads Dashboard</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                Live
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {[
                { label: "Revenue", value: "$4,280", icon: TrendingUp },
                { label: "Orders", value: "47", icon: ShoppingCart },
                { label: "Products", value: "12", icon: Package },
                { label: "Conversion", value: "3.2%", icon: BarChart3 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-md border border-border bg-card/80 p-2.5 sm:p-3"
                >
                  <stat.icon className="mb-1 h-3.5 w-3.5 text-[#7047EB]" />
                  <p className="text-sm font-bold sm:text-base">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-border/50 bg-muted/20 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium">Revenue overview</span>
                <span className="text-muted-foreground">Last 7 days</span>
              </div>
              <div className="flex h-16 items-end gap-1 sm:h-20">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-violet-600/80 to-rose-500/60"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
