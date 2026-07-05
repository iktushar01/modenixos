"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { getCookie } from "cookies-next";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  DollarSign,
  ExternalLink,
  Eye,
  LayoutGrid,
  Package,
  Plus,
  ShoppingCart,
  Shirt,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPrice, getCurrencyName } from "@/lib/currency";
import {
  getAnalyticsOverviewAction,
  getCategoriesAction,
} from "@/actions/catalog.actions";
import { useMyStore } from "@/hooks/useMyStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StoreShippingConfig } from "@/types/store.types";
import type { UserFromCookie } from "@/types/auth.types";
import { cn } from "@/lib/utils";

function StepBadge({
  done,
  step,
}: {
  done: boolean;
  step: number;
}) {
  if (done) {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
      {step}
    </span>
  );
}

export default function DashboardOverview() {
  const { data: store } = useMyStore();
  const [user] = useState<UserFromCookie | null>(() => {
    const cookie = getCookie("user");
    if (!cookie) return null;
    try {
      return JSON.parse(cookie as string) as UserFromCookie;
    } catch {
      return null;
    }
  });

  const { data: overview, isLoading } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: getAnalyticsOverviewAction,
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["dashboard-categories-count"],
    queryFn: () => getCategoriesAction({ limit: 200 }),
  });

  const categoryCount = categoriesRes?.meta?.total ?? categoriesRes?.data?.length ?? 0;
  const productCount = overview?.products ?? 0;

  const shipping = (store?.shipping ?? {}) as StoreShippingConfig;
  const hasShipping =
    Boolean(shipping.deliveryPolicy?.trim()) ||
    shipping.insideRate != null ||
    shipping.outsideRate != null;

  const setupSteps = useMemo(
    () => [
      {
        id: "store",
        label: "Online store",
        done: Boolean(store?.slug),
      },
      {
        id: "catalog",
        label: "Products & categories",
        done: productCount > 0 && categoryCount > 0,
      },
      {
        id: "fulfillment",
        label: "Shipping setup",
        done: hasShipping,
      },
      {
        id: "publish",
        label: "Publish storefront",
        done: Boolean(store?.isPublished),
      },
    ],
    [store, productCount, categoryCount, hasShipping],
  );

  const completedCount = setupSteps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedCount / setupSteps.length) * 100);
  const storefrontPath = store?.slug ? `/store/${store.slug}` : "";

  const welcomeName = store?.brandName ?? user?.name?.split(" ")[0] ?? "there";

  const copyStoreUrl = async () => {
    if (!store?.slug) return;
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${storefrontPath}`
        : storefrontPath;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Store URL copied");
    } catch {
      toast.error("Could not copy URL");
    }
  };

  const stats = [
    {
      label: "Revenue",
      value: formatPrice(overview?.revenue ?? 0, store?.currency ?? "USD"),
      icon: DollarSign,
    },
    { label: "Orders", value: overview?.orders ?? 0, icon: ShoppingCart },
    { label: "Products", value: productCount, icon: Package },
    { label: "Customers", value: overview?.customers ?? 0, icon: Users },
  ];

  const nextAction =
    productCount === 0
      ? { href: "/dashboard/products/new", label: "Add your first product to continue" }
      : categoryCount === 0
        ? { href: "/dashboard/categories", label: "Add a category to continue" }
        : !hasShipping
          ? { href: "/dashboard/store/shipping", label: "Set up shipping to continue" }
          : !store?.isPublished
            ? { href: "/dashboard/store", label: "Publish your storefront to continue" }
            : { href: "/dashboard/products", label: "Go to products" };

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome {welcomeName} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Let&apos;s set up your shop in a few simple steps
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium">
            {completedCount} of {setupSteps.length} completed
          </span>
          <span className="text-muted-foreground">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Setup cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Step 1 — Online store */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              <StepBadge done={setupSteps[0].done} step={1} />
              <div>
                <h2 className="font-semibold">Online store</h2>
                <p className="text-sm text-muted-foreground">
                  Connect or view your online store
                </p>
              </div>
            </div>

            {store?.slug && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {storefrontPath}
                </span>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={copyStoreUrl}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
                  <Link href={storefrontPath} target="_blank">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5">
                <Link href={storefrontPath || "#"} target="_blank">
                  <Eye className="h-3.5 w-3.5" />
                  Visit
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/dashboard/store">Manage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 — Products & categories */}
        <Card
          className={cn(
            "rounded-xl shadow-sm",
            !setupSteps[1].done && completedCount >= 1 && "ring-1 ring-primary/20",
          )}
        >
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              <StepBadge done={setupSteps[1].done} step={2} />
              <div>
                <h2 className="font-semibold">Add products &amp; categories</h2>
                <p className="text-sm text-muted-foreground">
                  Add a product and organize it with categories
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard/products/new"
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shirt className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">Add Product</span>
              </Link>
              <Link
                href="/dashboard/categories"
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LayoutGrid className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">Add Category</span>
              </Link>
            </div>

            <Button asChild className="w-full gap-1.5">
              <Link href="/dashboard/products/new">
                <Plus className="h-4 w-4" />
                Add your own
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Step 3 — Fulfillment */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              <StepBadge done={setupSteps[2].done && setupSteps[3].done} step={3} />
              <div>
                <h2 className="font-semibold">Setup fulfillment</h2>
                <p className="text-sm text-muted-foreground">
                  Complete these to start selling
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                {
                  href: "/dashboard/store/shipping",
                  icon: Truck,
                  label: "Enable courier & charge",
                  done: hasShipping,
                },
                {
                  href: "/dashboard/store",
                  label: "Publish storefront",
                  icon: Store,
                  done: Boolean(store?.isPublished),
                },
                {
                  href: "/dashboard/store",
                  label: "Manage shop",
                  icon: CreditCard,
                  done: Boolean(store?.description?.trim()),
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      item.done ? "border-emerald-500 bg-emerald-500" : "border-muted-foreground/30",
                    )}
                  >
                    {item.done && <Check className="h-3 w-3 text-white" />}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary CTA */}
      <Button asChild size="lg" className="h-12 w-full gap-2 text-base shadow-sm">
        <Link href={nextAction.href}>
          {nextAction.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>

      {/* Performance snapshot */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Store performance</h2>
          {store?.currency && (
            <Badge variant="outline">
              {store.currency} · {getCurrencyName(store.currency)}
            </Badge>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="rounded-xl shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">
                    {isLoading ? "…" : stat.value}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {overview?.recentOrders && overview.recentOrders.length > 0 && (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent orders</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/orders">View all</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {overview.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{order.status}</Badge>
                    <p className="mt-1 text-sm font-medium">
                      {formatPrice(order.total, store?.currency ?? "USD")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
