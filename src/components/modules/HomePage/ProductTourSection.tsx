"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  LayoutDashboard,
  Shield,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/AnimatedContent";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "dashboard",
    label: "Owner Dashboard",
    icon: LayoutDashboard,
    href: "/login",
    cta: "Open dashboard",
    description: "Manage products, orders, customers, coupons, and analytics from one store-scoped hub.",
    preview: "dashboard" as const,
  },
  {
    id: "storefront",
    label: "Public Storefront",
    icon: Store,
    href: "/store/luxe-threads",
    cta: "Visit demo store",
    description: "A live fashion storefront with cart, guest checkout, collections, and theme customization.",
    preview: "storefront" as const,
  },
  {
    id: "admin",
    label: "Platform Admin",
    icon: Shield,
    href: "/login",
    cta: "Explore admin",
    description: "Super-admin panel to manage all tenants, users, and platform-wide settings.",
    preview: "admin" as const,
  },
];

function DashboardPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {["Revenue $4.2k", "Orders 47", "Top product: Silk Blazer"].map((item) => (
        <div key={item} className="rounded-lg border border-border/50 bg-muted/30 p-4 text-sm font-medium">
          {item}
        </div>
      ))}
      <div className="col-span-full flex h-32 items-end gap-1 rounded-lg border border-border/50 bg-muted/20 p-4">
        {[35, 55, 40, 70, 50, 85, 60].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-violet-600/70 to-rose-500/50"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function StorefrontPreview() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
            <div className="p-2.5">
              <p className="truncate text-xs font-medium">{name}</p>
              <p className="text-[10px] text-muted-foreground">${(89 + i * 23).toFixed(0)}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function AdminPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-border/50">
      <div className="grid grid-cols-3 gap-px bg-border/50 text-[10px] font-medium sm:text-xs">
        <div className="bg-muted/40 p-2.5">Store</div>
        <div className="bg-muted/40 p-2.5">Owner</div>
        <div className="bg-muted/40 p-2.5">Status</div>
        {[
          ["Luxe Threads", "demo@modenixos.com", "Active"],
          ["Urban Edge", "owner@example.com", "Active"],
          ["Nova Atelier", "brand@example.com", "Draft"],
        ].map(([store, owner, status]) => (
          <div key={store} className="contents">
            <div className="bg-card p-2.5">{store}</div>
            <div className="bg-card p-2.5 truncate text-muted-foreground">{owner}</div>
            <div className="bg-card p-2.5">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px]",
                  status === "Active"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductTourSection() {
  const [active, setActive] = useState("dashboard");
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section id="product-tour" className="scroll-mt-20 border-t border-border/60 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <AnimatedContent distance={50} duration={0.8}>
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Product tour
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              One platform, three experiences
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Store owners run their brand, shoppers buy on a public storefront, and admins oversee
              the entire multi-tenant platform.
            </p>
          </div>
        </AnimatedContent>

        <AnimatedContent distance={40} duration={0.75} delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-lg backdrop-blur-sm">
            <div className="flex flex-wrap gap-1 border-b border-border/60 bg-muted/20 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
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
              <div>
                <h3 className="text-xl font-semibold">{current.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {current.description}
                </p>
                <Button asChild className="mt-6 gap-2 rounded-xl">
                  <Link href={current.href} target={current.id === "storefront" ? "_blank" : undefined}>
                    {current.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/80 p-4">
                {current.preview === "dashboard" && <DashboardPreview />}
                {current.preview === "storefront" && <StorefrontPreview />}
                {current.preview === "admin" && <AdminPreview />}
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
