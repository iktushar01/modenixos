"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Package, ShoppingCart, Store, TrendingUp } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/AnimatedContent";
import { cn } from "@/lib/utils";
import { DEMO_STORE_PATH } from "@/lib/app-config";
import { MarketingSectionHeader } from "../MarketingSectionHeader";
import { StartFreeLink } from "../StartFreeLink";
import { industries, type IndustryPreview } from "../landing-data";
import { MiniChart, RevenueCard } from "./HeroDashboard";

function DashboardPanel({ industry }: { industry: IndustryPreview }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      key={industry.id}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <RevenueCard index={0} label="Revenue" value={industry.revenue} trend={industry.revenueTrend} icon={TrendingUp} />
        <RevenueCard index={1} label="Orders" value={industry.orders} trend={industry.ordersTrend} icon={ShoppingCart} />
        <RevenueCard index={2} label="Products" value={industry.products} trend="Active" icon={Package} />
      </div>
      <div className="mkt-glass-card rounded-xl p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">Revenue trend</span>
          <span className="text-muted-foreground">{industry.revenueTrend} vs last week</span>
        </div>
        <MiniChart heights={industry.chartHeights} accent={industry.accent} />
      </div>
      <div className="mkt-glass-card rounded-xl p-3">
        <p className="text-xs font-medium">Recent orders</p>
        {industry.recentOrders.map((order) => (
          <div
            key={order}
            className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-[11px]"
          >
            <span>{order}</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400">Paid</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StorefrontPanel({ industry }: { industry: IndustryPreview }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      key={`store-${industry.id}`}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/80 px-4 py-2.5 backdrop-blur-sm">
        <span className="text-xs font-semibold tracking-widest">{industry.storeName.toUpperCase()}</span>
        <div className="flex gap-3 text-[10px] text-muted-foreground">
          <span>Shop</span>
          <span>Categories</span>
          <span>Cart</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {industry.storefrontProducts.map((product, i) => (
          <motion.div
            key={product.name}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.08 + i * 0.05 }}
            whileHover={reduceMotion ? undefined : { y: -3 }}
            className="group overflow-hidden rounded-xl border border-border/50 bg-card/80 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className={cn("aspect-[4/5] bg-gradient-to-br transition-transform duration-500 ease-out group-hover:scale-105", product.gradient)} />
            <div className="p-2.5">
              <p className="truncate text-[11px] font-medium">{product.name}</p>
              <p className="text-[10px] text-muted-foreground">{product.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const viewTabs = [
  { id: "dashboard" as const, label: "Operations dashboard", icon: LayoutDashboard },
  { id: "storefront" as const, label: "Customer storefront", icon: Store },
];

const descriptions: Record<"dashboard" | "storefront", string> = {
  dashboard: "Manage products, orders, customers, and revenue from a single command center designed for operators.",
  storefront: "Deliver a premium shopping experience with collections, product pages, cart, and secure checkout.",
};

export default function ProductPreview() {
  const [industryId, setIndustryId] = useState<IndustryPreview["id"]>("fashion");
  const [view, setView] = useState<"dashboard" | "storefront">("dashboard");
  const industry = industries.find((i) => i.id === industryId) ?? industries[0]!;
  const reduceMotion = useReducedMotion();

  return (
    <section id="product-tour" className="scroll-mt-28 border-b border-border/60 py-20 md:py-28">
      <div className="mkt-section">
        <AnimatedContent distance={50} duration={0.8}>
          <MarketingSectionHeader
            label="Product preview"
            title="Built for every industry. Proven across categories."
            description="Switch between business types to see how ModenixOS adapts — same powerful platform, your unique catalog."
          />
        </AnimatedContent>

        <AnimatedContent distance={40} duration={0.75} delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {industries.map((ind) => {
              const isActive = industryId === ind.id;
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setIndustryId(ind.id)}
                  className={cn(
                    "relative rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "border-primary/40 text-primary-foreground shadow-md"
                      : "border-border/60 bg-background/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="product-preview-industry-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-primary"
                      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  {ind.label}
                </button>
              );
            })}
          </div>

          <div className="mkt-glass-panel mt-8 overflow-hidden rounded-2xl">
            <div className="flex flex-col gap-1 border-b border-border/50 bg-muted/20 p-2 sm:flex-row">
              {viewTabs.map((tab) => {
                const isActive = view === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setView(tab.id)}
                    className={cn(
                      "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="product-preview-view-tab"
                        className="absolute inset-0 -z-10 rounded-xl bg-background shadow-sm"
                        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <tab.icon className="h-4 w-4" aria-hidden />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
              <div className="flex flex-col justify-center">
                <p className="mkt-label mb-2">{industry.label}</p>
                <h3 className="text-2xl font-semibold tracking-tight">{industry.storeName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{industry.tagline}</p>
                <div className="relative mt-4 min-h-[2.5rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={view}
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm leading-relaxed text-muted-foreground"
                    >
                      {descriptions[view]}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <Button asChild className="group mt-6 w-fit gap-2 rounded-xl">
                  {view === "storefront" ? (
                    <Link href={DEMO_STORE_PATH} target="_blank">
                      View live demo
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  ) : (
                    <StartFreeLink>
                      Start free
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                    </StartFreeLink>
                  )}
                </Button>
              </div>
              <div className="rounded-2xl border border-border/40 bg-muted/10 p-4 backdrop-blur-sm">
                <AnimatePresence mode="wait" initial={false}>
                  {view === "dashboard" ? (
                    <DashboardPanel key="dashboard" industry={industry} />
                  ) : (
                    <StorefrontPanel key="storefront" industry={industry} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}