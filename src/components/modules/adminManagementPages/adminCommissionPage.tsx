"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Loader2, Percent, Settings2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import {
  getAdminCommissionAnalyticsAction,
  getAdminCommissionEarningsAction,
  getAdminCommissionSettingsAction,
  updateAdminCommissionSettingsAction,
  type CommissionSettings,
  type PlatformEarning,
} from "@/actions/commission.actions";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const triggerLabels: Record<string, string> = {
  CONFIRMED: "Order confirmed",
  PACKED: "Order packed",
  SHIPPED: "Order shipped",
  DELIVERED: "Order delivered",
};

export default function AdminCommissionPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["admin-commission-settings"],
    queryFn: getAdminCommissionSettingsAction,
  });
  const { data: analytics } = useQuery({
    queryKey: ["admin-commission-analytics"],
    queryFn: getAdminCommissionAnalyticsAction,
  });
  const { data: earningsRes, isLoading: earningsLoading } = useQuery({
    queryKey: ["admin-commission-earnings"],
    queryFn: () => getAdminCommissionEarningsAction({ limit: 50 }),
  });

  const [form, setForm] = useState<Partial<CommissionSettings>>({});

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: updateAdminCommissionSettingsAction,
    onSuccess: () => {
      toast.success("Commission settings saved");
      queryClient.invalidateQueries({ queryKey: ["admin-commission-settings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const earnings = (earningsRes?.data ?? []) as PlatformEarning[];

  const formatMoney = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Platform commission"
        description="Configure how ModenixOS earns commission when store orders are confirmed."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total commission", value: formatMoney(analytics?.totalCommission ?? 0), icon: DollarSign },
          { label: "This month", value: formatMoney(analytics?.commissionThisMonth ?? 0), icon: TrendingUp },
          { label: "Commission orders", value: analytics?.earnedOrderCount ?? 0, icon: Percent },
          { label: "Reversed", value: formatMoney(analytics?.reversedCommission ?? 0), icon: Settings2 },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission rules</CardTitle>
          <CardDescription>
            Commission is recorded when an order reaches the trigger status. Cancelled orders reverse the commission.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {settingsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading settings…
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="commission-enabled">Enable commission</Label>
                  <p className="text-sm text-muted-foreground">Turn platform commission on or off globally.</p>
                </div>
                <Switch
                  id="commission-enabled"
                  checked={form.isEnabled ?? true}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isEnabled: checked }))}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Commission type</Label>
                  <Select
                    value={form.commissionType ?? "PERCENT"}
                    onValueChange={(value: "PERCENT" | "FIXED") =>
                      setForm((prev) => ({ ...prev, commissionType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                      <SelectItem value="FIXED">Fixed amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    {form.commissionType === "FIXED" ? "Fixed amount" : "Percentage rate"}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    step={form.commissionType === "FIXED" ? "1" : "0.1"}
                    value={form.commissionValue ?? 2.5}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, commissionValue: Number(e.target.value) }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Calculate on</Label>
                  <Select
                    value={form.commissionBase ?? "SUBTOTAL"}
                    onValueChange={(value: "SUBTOTAL" | "TOTAL") =>
                      setForm((prev) => ({ ...prev, commissionBase: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUBTOTAL">Subtotal (excl. shipping)</SelectItem>
                      <SelectItem value="TOTAL">Order total</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trigger when</Label>
                  <Select
                    value={form.triggerStatus ?? "CONFIRMED"}
                    onValueChange={(value: CommissionSettings["triggerStatus"]) =>
                      setForm((prev) => ({ ...prev, triggerStatus: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(triggerLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={() => saveMutation.mutate(form)}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save settings
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission ledger</CardTitle>
          <CardDescription>All platform earnings from confirmed store orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {earningsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading earnings…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Base</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No commission recorded yet. Confirm a store order to see earnings here.
                    </TableCell>
                  </TableRow>
                ) : (
                  earnings.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.store?.brandName ?? "—"}</TableCell>
                      <TableCell className="font-mono text-xs">{row.orderNumber}</TableCell>
                      <TableCell>{formatMoney(row.orderAmount, row.currency)}</TableCell>
                      <TableCell>
                        {formatMoney(row.commissionAmount, row.currency)}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({row.commissionType === "PERCENT" ? `${row.commissionRate}%` : "fixed"})
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={row.status === "EARNED" ? "default" : "secondary"}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(row.earnedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
