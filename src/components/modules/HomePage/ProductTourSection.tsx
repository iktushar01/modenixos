"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/AnimatedContent";
import { cn } from "@/lib/utils";
import { MarketingSectionHeader } from "./MarketingSectionHeader";

const tabs = [
  {
    id: "dashboard",
    label: "Brand Dashboard",
    icon: LayoutDashboard,
    href: "/register",
    cta: "Start free",
    description:
      "Your command center for products, orders, customers, and revenue. Everything you need to run your brand — in one beautiful dashboard.",
    preview: "dashboard" as const,
  },
  {
    id: "storefront",
    label: "Customer Storefront",
    icon: Store,
    href: "/store/luxe-threads",
    cta: "View live demo",
    description:
      "A premium shopping experience for your customers. Collections, product pages, cart, and checkout — designed for fashion brands.",
    preview: "storefront" as const,
  },
];

function DashboardPreview() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Revenue", value: "$4,280", change: "+12%" },
          { label: "Orders", value: "47", change: "+8" },
          { label: "Products", value: "12", change: "Live" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border/50 bg-card p-3"
          >
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-bold">{stat.value}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{stat.change}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">Revenue this week</span>
          <span className="text-muted-foreground">+18% vs last week</span>
        </div>
        <div className="flex h-24 items-end gap-1.5">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-primary/80 to-primary/40"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border/50 bg-card p-3">
        <p className="text-xs font-medium">Recent orders</p>
        {["Silk Blazer — $189", "Linen Dress — $124", "Cashmere Coat — $298"].map((order) => (
          <div
            key={order}
            className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]"
          >
            <span>{order}</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400">
              Paid
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StorefrontPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-2.5">
        <span className="text-xs font-semibold tracking-wide">LUXE THREADS</span>
        <div className="flex gap-3 text-[10px] text-muted-foreground">
          <span>Shop</span>
          <span>Collections</span>
          <span>Cart (2)</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {["Silk Blazer", "Linen Dress", "Cashmere Coat", "Wide Trousers", "Knit Top", "Leather Bag"].map(
          (name, i) => (
            <div key={name} className="overflow-hidden rounded-lg border border-border/50 bg-card">
              <div
                className={cn(
                  "aspect-[4/5] bg-gradient-to-br",
                  i % 3 === 0 && "from-rose-200/80 to-rose-100/40 dark:from-rose-900/40 dark:to-rose-950/20",
                  i % 3 === 1 && "from-violet-200/80 to-violet-100/40 dark:from-violet-900/40 dark:to-violet-950/20",
                  i % 3 === 2 && "from-slate-200/80 to-slate-100/40 dark:from-slate-800/40 dark:to-slate-900/20"
                )}
              />
              <div className="p-2">
                <p className="truncate text-[11px] font-medium">{name}</p>
                <p className="text-[10px] text-muted-foreground">${(89 + i * 23).toFixed(0)}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function ProductTourSection() {
  const [active, setActive] = useState("dashboard");
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section id="product-tour" className="scroll-mt-28 border-b border-border py-20 md:py-28">
      <div className="mkt-section">
        <AnimatedContent distance={50} duration={0.8}>
          <MarketingSectionHeader
            label="Product preview"
            title="Run your brand. Delight your customers."
            description="A powerful dashboard for you, and a beautiful storefront for every shopper."
          />
        </AnimatedContent>

        <AnimatedContent distance={40} duration={0.75} delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex gap-1 border-b border-border bg-muted/30 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:flex-none",
                    active === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">{current.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {current.description}
                </p>
                <Button asChild className="mt-6 w-fit gap-2 rounded-lg">
                  <Link href={current.href} target={current.id === "storefront" ? "_blank" : undefined}>
                    {current.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                {current.preview === "dashboard" && <DashboardPreview />}
                {current.preview === "storefront" && <StorefrontPreview />}
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
