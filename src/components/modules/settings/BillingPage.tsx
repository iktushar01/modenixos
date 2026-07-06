"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Crown,
  Loader2,
  Receipt,
  Sparkles,
  XCircle,
} from "lucide-react";

import {
  cancelBillingSubscriptionAction,
  createBillingCheckoutAction,
  createBillingPortalAction,
  getBillingOverviewAction,
  getBillingPlansAction,
} from "@/actions/billing.actions";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    if (checkout === "success") toast.success("Subscription updated successfully.");
    if (checkout === "cancelled") toast.message("Checkout cancelled.");
  }, [searchParams]);

  const checkoutMutation = useMutation({
    mutationFn: () => createBillingCheckoutAction("PRO"),
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url;
      else toast.error("Could not start checkout. Check Stripe configuration.");
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
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
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

      {!overview?.stripeConfigured && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-start gap-3 pt-6 text-sm text-muted-foreground">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-600" />
            Stripe is not configured on the server yet. Plan display and admin overrides work; live checkout requires STRIPE_SECRET_KEY and STRIPE_PRICE_PRO_MONTHLY.
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
            {overview?.paymentMethods?.[0] ? (
              <p className="text-sm">
                {(overview.paymentMethods[0].brand ?? "Card").toUpperCase()} •••• {overview.paymentMethods[0].last4}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No card on file</p>
            )}
            <Button
              className="mt-3"
              size="sm"
              variant="outline"
              disabled={!overview?.stripeConfigured || portalMutation.isPending}
              onClick={() => portalMutation.mutate()}
            >
              {portalMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Manage payment"}
            </Button>
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
                    disabled={!overview?.stripeConfigured || checkoutMutation.isPending}
                    onClick={() => checkoutMutation.mutate()}
                  >
                    {checkoutMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Upgrade to Growth"}
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

      {currentPlan !== "FREE" && overview?.subscription?.stripeSubscriptionId && (
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
                      ${Number(inv.amount).toFixed(2)} {inv.currency.toUpperCase()}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
