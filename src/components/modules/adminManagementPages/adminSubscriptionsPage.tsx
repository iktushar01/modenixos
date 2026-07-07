"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { AlertTriangle, Crown, DollarSign, Loader2, TrendingUp } from "lucide-react";

import {
  getAdminBillingAnalyticsAction,
  getAdminFailedPaymentsAction,
  getAdminSubscriptionsAction,
  overrideStorePlanAction,
} from "@/actions/billing.actions";
import { getAdminAnalyticsAction } from "@/actions/catalog.actions";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const planLabels: Record<string, string> = {
  FREE: "Free",
  PRO: "Pro",
  PRO_PLUS: "Pro+",
  ULTRA: "Ultra Pro+",
  ENTERPRISE: "Ultra Pro+",
};

type SubscriptionRow = {
  id: string;
  plan: string;
  status: string;
  mrr: number;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  store: {
    id: string;
    brandName: string;
    slug: string;
    isSuspended: boolean;
    owner: { name: string; email: string };
    _count: { products: number; orders: number };
  };
  paymentMethod?: { brand: string | null; last4: string | null } | null;
};

export default function AdminSubscriptionsPage() {
  const queryClient = useQueryClient();
  const { data: subsRes, isLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: () => getAdminSubscriptionsAction(),
  });
  const { data: billing } = useQuery({
    queryKey: ["admin-billing-analytics"],
    queryFn: getAdminBillingAnalyticsAction,
  });
  const { data: platform } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: getAdminAnalyticsAction,
  });
  const { data: failedPayments = [] } = useQuery({
    queryKey: ["admin-failed-payments"],
    queryFn: getAdminFailedPaymentsAction,
  });

  const overrideMutation = useMutation({
    mutationFn: ({ storeId, plan }: { storeId: string; plan: "FREE" | "PRO" | "PRO_PLUS" | "ULTRA" | "ENTERPRISE" }) =>
      overrideStorePlanAction(storeId, plan),
    onSuccess: () => {
      toast.success("Plan updated");
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
    },
    onError: () => toast.error("Failed to update plan"),
  });

  const subscriptions = (subsRes?.data ?? []) as SubscriptionRow[];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Subscriptions & billing"
        description="Platform revenue, subscription status, and plan management."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "MRR", value: `$${(billing?.mrr ?? platform?.mrr ?? 0).toFixed(0)}`, icon: DollarSign },
          { label: "ARR", value: `$${(billing?.arr ?? 0).toFixed(0)}`, icon: TrendingUp },
          { label: "Active subs", value: billing?.activeSubscriptions ?? 0, icon: Crown },
          { label: "Past due", value: billing?.pastDue ?? 0, icon: AlertTriangle },
          { label: "Billing revenue", value: `$${(billing?.totalRevenue ?? 0).toFixed(2)}`, icon: DollarSign },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Array.isArray(failedPayments) && failedPayments.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="size-4" />
              Failed payments ({failedPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(failedPayments as SubscriptionRow[]).map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.store.brandName}</TableCell>
                    <TableCell>{sub.store.owner.email}</TableCell>
                    <TableCell>{planLabels[sub.plan] ?? sub.plan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Override</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="font-medium">{sub.store.brandName}</div>
                      <div className="text-xs text-muted-foreground">{sub.store.slug}</div>
                    </TableCell>
                    <TableCell>{sub.store.owner.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{planLabels[sub.plan] ?? sub.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.status === "PAST_DUE" ? "destructive" : "outline"}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${sub.mrr}</TableCell>
                    <TableCell>
                      {sub.paymentMethod?.last4
                        ? `${(sub.paymentMethod.brand ?? "card").toUpperCase()} •••• ${sub.paymentMethod.last4}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={sub.plan}
                        onValueChange={(plan) =>
                          overrideMutation.mutate({
                            storeId: sub.store.id,
                            plan: plan as "FREE" | "PRO" | "PRO_PLUS" | "ULTRA" | "ENTERPRISE",
                          })
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FREE">Free</SelectItem>
                          <SelectItem value="PRO">Pro</SelectItem>
                          <SelectItem value="PRO_PLUS">Pro+</SelectItem>
                          <SelectItem value="ULTRA">Ultra Pro+</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/admin/admin-management">Platform management</Link>
        </Button>
      </div>
    </div>
  );
}
