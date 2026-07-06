"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Crown,
  Loader2,
  Receipt,
  Sparkles,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  cancelBillingSubscriptionAction,
  createBillingCheckoutAction,
  createBillingPortalAction,
  getBillingOverviewAction,
  getBillingPlansAction,
  type BillingProvider,
} from "@/actions/billing.actions";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardTable } from "@/components/shared/DashboardTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";

const planLabels: Record<string, string> = {
  FREE: "Starter",
  PRO: "Growth",
  ENTERPRISE: "Scale",
};

const statusVariant = (status: string) => {
  if (status === "ACTIVE" || status === "TRIALING") return "default" as const;
  if (status === "PAST_DUE") return "destructive" as const;
  return "outline" as const;
};

export default function BillingPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [paymentProvider, setPaymentProvider] = useState<BillingProvider>("STRIPE");

  const { data: overview, isLoading } = useQuery({
    queryKey: ["billing-overview"],
    queryFn: getBillingOverviewAction,
  });

  const { data: plans = [] } = useQuery({
    queryKey: ["billing-plans"],
    queryFn: getBillingPlansAction,
  });


  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      toast.success("Subscription updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["billing-overview"] });
    }
    if (checkout === "cancelled") toast.message("Checkout cancelled.");
    if (checkout === "failed") toast.error("Payment failed. Please try again.");
  }, [searchParams, queryClient]);

  useEffect(() => {
    if (!overview) return;
    if (overview.sslConfigured && !overview.stripeConfigured) {
      setPaymentProvider("SSLCOMMERZ");
    }
  }, [overview]);

  const checkoutMutation = useMutation({
    mutationFn: () => createBillingCheckoutAction("PRO", paymentProvider),
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url;
      else toast.error("Could not start checkout. Check payment gateway configuration.");
    },
    onError: (error: Error) => toast.error(error.message || "Failed to start checkout."),
  });

  const portalMutation = useMutation({
    mutationFn: createBillingPortalAction,
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url;
      else toast.error("Could not open billing portal.");
    },
    onError: (error: Error) => toast.error(error.message || "Failed to open billing portal."),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBillingSubscriptionAction,
    onSuccess: () => {
      toast.success("Subscription updated.");
      queryClient.invalidateQueries({ queryKey: ["billing-overview"] });
    },
    onError: () => toast.error("Failed to cancel subscription."),
  });

  if (isLoading) {
    return <DashboardFormSkeleton />;
  }

  const currentPlan = overview?.store.plan ?? "FREE";
  const limits = overview?.limits;
  const productCount = overview?.usage.productCount ?? 0;
  const maxProducts = limits?.maxProducts ?? 50;
  const usagePercent = Number.isFinite(maxProducts) ? Math.min(100, (productCount / maxProducts) * 100) : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing & subscription"
        description="Manage your plan, payment methods, and invoices."
      />

      {!overview?.stripeConfigured && !overview?.sslConfigured && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-start gap-3 pt-6 text-sm text-muted-foreground">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-600" />
            No payment gateway is configured yet. Add Stripe or SSLCommerz credentials on the server to enable live checkout.
          </CardContent>
        </Card>
      )}

      {(overview?.stripeConfigured || overview?.sslConfigured) && currentPlan === "FREE" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Payment method for upgrade</CardTitle>
            <CardDescription>Choose how you want to pay for your Growth plan subscription.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={!overview?.stripeConfigured}
              onClick={() => setPaymentProvider("STRIPE")}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                paymentProvider === "STRIPE" && "border-primary ring-2 ring-primary/20",
                !overview?.stripeConfigured && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                <CreditCard className="size-4" />
                Stripe
              </div>
              <p className="mt-1 text-sm text-muted-foreground">International cards · recurring billing · $29/mo</p>
            </button>
            <button
              type="button"
              disabled={!overview?.sslConfigured}
              onClick={() => setPaymentProvider("SSLCOMMERZ")}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                paymentProvider === "SSLCOMMERZ" && "border-primary ring-2 ring-primary/20",
                !overview?.sslConfigured && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                <Wallet className="size-4" />
                SSLCommerz
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                bKash, Nagad, local cards · ৳{overview?.sslBillingAmountBdt ?? 2900}/mo
              </p>
            </button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Crown className="size-4" />
              Current plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{planLabels[currentPlan] ?? currentPlan}</div>
            <Badge variant={statusVariant(overview?.subscription.status ?? "ACTIVE")}>
              {overview?.subscription.status ?? "ACTIVE"}
            </Badge>
            {overview?.subscription.currentPeriodEnd && (
              <p className="text-sm text-muted-foreground">
                Renews {new Date(overview.subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
            {overview?.subscription.cancelAtPeriodEnd && (
              <p className="text-sm text-amber-600">Cancels at end of billing period</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Product usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold">
              {productCount}
              {Number.isFinite(maxProducts) ? ` / ${maxProducts}` : ""}
            </div>
            {Number.isFinite(maxProducts) && <Progress value={usagePercent} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="size-4" />
              Payment method
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overview?.subscription.billingProvider === "SSLCOMMERZ" ? (
              <p className="text-sm">SSLCommerz · bKash, Nagad & local cards</p>
            ) : overview?.paymentMethods?.[0] ? (
              <p className="text-sm">
                {(overview.paymentMethods[0].brand ?? "Card").toUpperCase()} •••• {overview.paymentMethods[0].last4}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No card on file</p>
            )}
            {overview?.subscription.billingProvider === "STRIPE" && (
              <Button
                className="mt-3"
                size="sm"
                variant="outline"
                disabled={!overview?.stripeConfigured || portalMutation.isPending}
                onClick={() => portalMutation.mutate()}
              >
                {portalMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Manage payment"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.plan === currentPlan;
          const price =
            plan.priceMonthly === null
              ? "Custom"
              : plan.priceMonthly === 0
                ? "$0"
                : `$${plan.priceMonthly}/mo`;

          return (
            <Card key={plan.plan} className={isCurrent ? "ring-2 ring-primary" : ""}>
              <CardHeader>
                <CardTitle>{plan.label}</CardTitle>
                <CardDescription>{price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>{Number.isFinite(plan.maxProducts) ? `Up to ${plan.maxProducts} products` : "Unlimited products"}</li>
                  <li>{plan.coupons ? "Coupons & promotions" : "No coupons"}</li>
                  <li>{plan.advancedAnalytics ? "Advanced analytics" : "Basic analytics"}</li>
                  <li>{plan.customBranding ? "Custom branding" : "Standard branding"}</li>
                </ul>
                {isCurrent ? (
                  <Badge>Current plan</Badge>
                ) : plan.plan === "PRO" ? (
                  <Button
                    className="w-full"
                    disabled={
                      checkoutMutation.isPending ||
                      (paymentProvider === "STRIPE" && !overview?.stripeConfigured) ||
                      (paymentProvider === "SSLCOMMERZ" && !overview?.sslConfigured)
                    }
                    onClick={() => checkoutMutation.mutate()}
                  >
                    {checkoutMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : paymentProvider === "SSLCOMMERZ" ? (
                      "Upgrade via SSLCommerz"
                    ) : (
                      "Upgrade via Stripe"
                    )}
                  </Button>
                ) : plan.plan === "ENTERPRISE" ? (
                  <Button className="w-full" variant="outline" asChild>
                    <a href="mailto:support@modenixos.com">Contact sales</a>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {currentPlan !== "FREE" &&
        (overview?.subscription?.stripeSubscriptionId ||
          overview?.subscription?.billingProvider === "SSLCOMMERZ") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <XCircle className="size-4" />
              Cancel subscription
            </CardTitle>
            <CardDescription>Your store will move to the free Starter plan at the end of the billing period.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              disabled={cancelMutation.isPending || overview.subscription.cancelAtPeriodEnd}
              onClick={() => cancelMutation.mutate()}
            >
              {overview.subscription.cancelAtPeriodEnd ? "Cancellation scheduled" : "Cancel at period end"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="size-4" />
            Invoice history
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(overview?.invoices?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          ) : (
            <DashboardTable label="Invoices" count={overview?.invoices?.length ?? 0}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview?.invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {inv.provider === "SSLCOMMERZ"
                        ? `৳${Number(inv.amount).toFixed(2)} ${inv.currency.toUpperCase()}`
                        : `$${Number(inv.amount).toFixed(2)} ${inv.currency.toUpperCase()}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{inv.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {inv.invoiceUrl ? (
                        <a className="text-sm text-primary underline" href={inv.invoiceUrl} target="_blank" rel="noreferrer">
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </DashboardTable>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
