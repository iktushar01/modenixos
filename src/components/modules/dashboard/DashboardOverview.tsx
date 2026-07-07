"use client";

import { useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
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
import { Progress } from "@/components/ui/progress";
import { formatPrice, getCurrencyName } from "@/lib/currency";
import {
  getAnalyticsOverviewAction,
  getCategoriesAction,
} from "@/actions/catalog.actions";
import { useDashboardQuery } from "@/hooks/useDashboardQuery";
import { DashboardAsyncContent } from "@/components/shared/DashboardAsyncContent";
import { DashboardOverviewSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { DashboardStatCard } from "@/components/shared/DashboardStatCard";
import { useMyStore } from "@/hooks/useMyStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StoreShippingConfig } from "@/types/store.types";
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
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
        <Check className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold text-primary">
      {step}
    </span>
  );
}

export default function DashboardOverview() {
  const { data: store, isLoading: storeLoading } = useMyStore();

  const { data: overview, isPending: overviewPending } = useDashboardQuery({
    queryKey: ["analytics-overview", "30d"],
    queryFn: () => getAnalyticsOverviewAction("30d"),
  });

  const { data: categoriesRes } = useDashboardQuery({
    queryKey: ["dashboard-categories-count"],
    queryFn: () => getCategoriesAction({ limit: 200, sortBy: "sortOrder", sortOrder: "asc" }),
  });

  const showPlaceholder =
    (storeLoading && !store) || (overviewPending && overview === undefined);

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

  const welcomeName = store?.brandName ?? "there";

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
      variant: "warm" as const,
    },
    { label: "Orders", value: overview?.orders ?? 0, icon: ShoppingCart, variant: "violet" as const },
    { label: "Products", value: productCount, icon: Package, variant: "sky" as const },
    { label: "Customers", value: overview?.customers ?? 0, icon: Users, variant: "emerald" as const },
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
    <DashboardAsyncContent
      showPlaceholder={showPlaceholder}
      skeleton={<DashboardOverviewSkeleton />}
    >
      <div className="dashboard-page">
        {/* Welcome header */}
        <div className="space-y-1">
          <p className="admin-section-label">Overview</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {welcomeName}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Let&apos;s set up your shop in a few simple steps
          </p>
        </div>

        {/* Progress */}
        <div className="dashboard-progress-track">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium">
              {completedCount} of {setupSteps.length} completed
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {progressPercent}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-2.5" />
        </div>

        {/* Setup cards */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Step 1 — Online store */}
          <div className="dashboard-panel dashboard-panel-hover">
            <div className="space-y-4 p-5 sm:p-6">
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
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5">
                  <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {storefrontPath}
                  </span>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-primary/10" onClick={copyStoreUrl}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-primary/10" asChild>
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
            </div>
          </div>

          {/* Step 2 — Products & categories */}
          <div
            className={cn(
              "dashboard-panel dashboard-panel-hover",
              !setupSteps[1].done && completedCount >= 1 && "ring-2 ring-primary/15",
            )}
          >
            <div className="space-y-4 p-5 sm:p-6">
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
                <Link href="/dashboard/products/new" className="dashboard-action-tile">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Shirt className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium">Add Product</span>
                </Link>
                <Link href="/dashboard/categories" className="dashboard-action-tile">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
            </div>
          </div>

          {/* Step 3 — Fulfillment */}
          <div className="dashboard-panel dashboard-panel-hover">
            <div className="space-y-4 p-5 sm:p-6">
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
                  <Link key={item.label} href={item.href} className="dashboard-list-item group">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                        item.done ? "border-emerald-500 bg-emerald-500" : "border-muted-foreground/30",
                      )}
                    >
                      {item.done && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <Button asChild size="lg" className="dashboard-cta">
          <Link href={nextAction.href}>
            {nextAction.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>

        {/* Performance snapshot */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">Store performance</h2>
            {store?.currency && (
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                {store.currency} · {getCurrencyName(store.currency)}
              </Badge>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <DashboardStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                variant={stat.variant}
              />
            ))}
          </div>
        </div>

        {overview?.recentOrders && overview.recentOrders.length > 0 && (
          <div className="dashboard-panel">
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Recent orders</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/orders">View all</Link>
                </Button>
              </div>
              <div className="space-y-1">
                {overview.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href="/dashboard/orders"
                    className="dashboard-list-item group justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="truncate text-sm text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <Badge variant="outline" className="border-border/60">
                        {order.status}
                      </Badge>
                      <p className="mt-1 text-sm font-semibold">
                        {formatPrice(order.total, store?.currency ?? "USD")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardAsyncContent>
  );
}
