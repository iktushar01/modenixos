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
  Timer,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  cancelBillingSubscriptionAction,
  createBillingCheckoutAction,
  createBillingPortalAction,
  getBillingOverviewAction,
  getBillingPlansAction,
  startBillingTrialAction,
  type BillingInterval,
  type BillingProvider,
  type PaidPlanId,
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
import { BillingComparisonTable } from "./BillingComparisonTable";

const planLabels: Record<string, string> = {
  FREE: "Free",
  PRO: "Pro",
  PRO_PLUS: "Pro+",
  ULTRA: "Ultra Pro+",
  ENTERPRISE: "Ultra Pro+",
};

const statusVariant = (status: string) => {
  if (status === "ACTIVE" || status === "TRIALING") return "default" as const;
  if (status === "PAST_DUE") return "destructive" as const;
  return "outline" as const;
};

const formatPrice = (plan: { monthlyUsd: number; yearlyUsd: number }, yearly: boolean) => {
  if (plan.monthlyUsd === 0) return "$0";
  return yearly ? `$${plan.yearlyUsd}/yr` : `$${plan.monthlyUsd}/mo`;
};

export default function BillingPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [paymentProvider, setPaymentProvider] = useState<BillingProvider>("STRIPE");
  const [interval, setInterval] = useState<BillingInterval>("MONTHLY");
  const [upgradingPlan, setUpgradingPlan] = useState<PaidPlanId | null>(null);

  const yearly = interval === "YEARLY";

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
    mutationFn: (plan: PaidPlanId) =>
      createBillingCheckoutAction(plan, paymentProvider, interval),
    onMutate: (plan) => setUpgradingPlan(plan),
    onSettled: () => setUpgradingPlan(null),
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url;
      else toast.error("Could not start checkout. Check payment gateway configuration.");
    },
    onError: (error: Error) => toast.error(error.message || "Failed to start checkout."),
  });

  const trialMutation = useMutation({
    mutationFn: startBillingTrialAction,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Trial started!");
      queryClient.invalidateQueries({ queryKey: ["billing-overview"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not start trial."),
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
    onSuccess: (data) => {
      toast.success(data?.message ?? "Subscription updated.");
      queryClient.invalidateQueries({ queryKey: ["billing-overview"] });
    },
    onError: () => toast.error("Failed to cancel subscription."),
  });

  if (isLoading) {
    return <DashboardFormSkeleton />;
  }

  const entitlements = overview?.entitlements;
  const currentPlan = entitlements?.plan ?? "FREE";
  const limits = overview?.limits ?? entitlements?.limits;
  const productCount = overview?.usage.productCount ?? 0;
  const maxProducts = limits?.maxProducts ?? 25;
  const usagePercent = Number.isFinite(maxProducts) ? Math.min(100, (productCount / maxProducts) * 100) : 0;
  const paymentReady =
    (paymentProvider === "STRIPE" && overview?.stripeConfigured) ||
    (paymentProvider === "SSLCOMMERZ" && overview?.sslConfigured);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing & subscription"
        description="Simple plans from $1/month. Start with a 14-day Pro+ trial — no credit card required."
      />

      {entitlements?.isTrialing && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Timer className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-semibold">Free trial active</p>
                <p className="text-sm text-muted-foreground">
                  {entitlements.trialDaysLeft ?? 0} days left on Pro+ · No card required yet
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => checkoutMutation.mutate("PRO_PLUS")} disabled={!paymentReady}>
              Add payment to keep Pro+
            </Button>
          </CardContent>
        </Card>
      )}

      {entitlements?.canStartTrial && (
        <Card className="border-dashed border-primary/40">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Try Pro+ free for 14 days</p>
              <p className="text-sm text-muted-foreground">
                Full Pro+ features · No credit card · Cancel anytime
              </p>
            </div>
            <Button
              onClick={() => trialMutation.mutate()}
              disabled={trialMutation.isPending}
              className="gap-1.5"
            >
              {trialMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Start free trial
            </Button>
          </CardContent>
        </Card>
      )}

      {!overview?.stripeConfigured && !overview?.sslConfigured && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-start gap-3 pt-6 text-sm text-muted-foreground">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-600" />
            No payment gateway is configured yet. Add Stripe or SSLCommerz credentials on the server to enable paid upgrades.
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
            <Badge variant={statusVariant(entitlements?.status ?? "ACTIVE")}>
              {entitlements?.isTrialing ? "TRIALING" : entitlements?.status ?? "ACTIVE"}
            </Badge>
            {entitlements?.currentPeriodEnd && !entitlements.isTrialing && (
              <p className="text-sm text-muted-foreground">
                Renews {new Date(entitlements.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
            {entitlements?.cancelAtPeriodEnd && (
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
            {entitlements?.billingProvider === "SSLCOMMERZ" ? (
              <p className="text-sm">SSLCommerz · bKash, Nagad & local cards</p>
            ) : overview?.paymentMethods?.[0] ? (
              <p className="text-sm">
                {(overview.paymentMethods[0].brand ?? "Card").toUpperCase()} ••••{" "}
                {overview.paymentMethods[0].last4}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No card on file</p>
            )}
            {entitlements?.billingProvider === "STRIPE" && (
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

      <Card>
        <CardHeader>
          <CardTitle>Choose billing cycle</CardTitle>
          <CardDescription>Yearly plans save about 17%</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setInterval("MONTHLY")}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              interval === "MONTHLY"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval("YEARLY")}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              interval === "YEARLY"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground",
            )}
          >
            Yearly <span className="text-emerald-600">· Save ~17%</span>
          </button>
        </CardContent>
      </Card>

      {(overview?.stripeConfigured || overview?.sslConfigured) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Payment provider</CardTitle>
            <CardDescription>Choose how you pay when upgrading</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={!overview?.stripeConfigured}
              onClick={() => setPaymentProvider("STRIPE")}
              data-selected={paymentProvider === "STRIPE"}
              className={cn(
                "dashboard-option-card",
                paymentProvider === "STRIPE" && "ring-2 ring-primary",
                !overview?.stripeConfigured && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                <CreditCard className="size-4" />
                Stripe
              </div>
              <p className="mt-1 text-sm text-muted-foreground">International cards · recurring billing</p>
            </button>
            <button
              type="button"
              disabled={!overview?.sslConfigured}
              onClick={() => setPaymentProvider("SSLCOMMERZ")}
              data-selected={paymentProvider === "SSLCOMMERZ"}
              className={cn(
                "dashboard-option-card",
                paymentProvider === "SSLCOMMERZ" && "ring-2 ring-primary",
                !overview?.sslConfigured && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                <Wallet className="size-4" />
                SSLCommerz
              </div>
              <p className="mt-1 text-sm text-muted-foreground">bKash, Nagad, local cards (BDT)</p>
            </button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = plan.plan === currentPlan;
          const isPaid = plan.plan !== "FREE";

          return (
            <Card key={plan.plan} className={cn(isCurrent && "ring-2 ring-primary")}>
              <CardHeader>
                <CardTitle>{plan.label}</CardTitle>
                <CardDescription>{formatPrice(plan, yearly)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.comparisonFeatures.slice(0, 5).map((feature) => (
                    <li key={feature}>· {feature}</li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Badge>Current plan</Badge>
                ) : isPaid ? (
                  <Button
                    className="w-full"
                    disabled={!paymentReady || checkoutMutation.isPending}
                    onClick={() => checkoutMutation.mutate(plan.plan as PaidPlanId)}
                  >
                    {checkoutMutation.isPending && upgradingPlan === plan.plan ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      `Upgrade to ${plan.label}`
                    )}
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {overview && overview.comparisonRows.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Compare plans</h2>
            <p className="text-sm text-muted-foreground">See exactly what you get at each tier</p>
          </div>
          <BillingComparisonTable
            rows={overview.comparisonRows}
            overview={overview}
            yearly={yearly}
            onUpgrade={(plan) => checkoutMutation.mutate(plan)}
            upgradingPlan={upgradingPlan}
            paymentReady={Boolean(paymentReady)}
          />
        </section>
      )}

      {currentPlan !== "FREE" &&
        (entitlements?.isTrialing ||
          overview?.subscription?.stripeSubscriptionId ||
          overview?.subscription?.billingProvider === "SSLCOMMERZ") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <XCircle className="size-4" />
              {entitlements?.isTrialing ? "End trial" : "Cancel subscription"}
            </CardTitle>
            <CardDescription>
              {entitlements?.isTrialing
                ? "End your trial and return to the free plan immediately."
                : "Your store will move to the free plan at the end of the billing period."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              disabled={cancelMutation.isPending || entitlements?.cancelAtPeriodEnd}
              onClick={() => cancelMutation.mutate()}
            >
              {entitlements?.cancelAtPeriodEnd
                ? "Cancellation scheduled"
                : entitlements?.isTrialing
                  ? "End trial now"
                  : "Cancel at period end"}
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
                          <a
                            className="text-sm text-primary underline"
                            href={inv.invoiceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
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
