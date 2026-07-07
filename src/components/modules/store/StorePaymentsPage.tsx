"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import { StorePaymentConfig } from "@/types/store.types";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { StoreSection } from "./StoreSection";
import { StoreSaveBar } from "./StoreSaveBar";

const defaultPayments: StorePaymentConfig = {
  codEnabled: true,
  sslEnabled: true,
};

export default function StorePaymentsPage() {
  const { data: store, refetch, isLoading } = useMyStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StorePaymentConfig>(defaultPayments);

  useEffect(() => {
    if (store?.payments) {
      const p = store.payments as StorePaymentConfig;
      setForm({
        codEnabled: p.codEnabled !== false,
        sslEnabled: p.sslEnabled !== false,
        sslStoreId: p.sslStoreId ?? "",
        sslStorePassword: p.sslStorePassword ?? "",
      });
    }
  }, [store]);

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    try {
      await updateStoreAction(store.id, {
        payments: {
          codEnabled: form.codEnabled,
          sslEnabled: form.sslEnabled,
          ...(form.sslStoreId?.trim() ? { sslStoreId: form.sslStoreId.trim() } : {}),
          ...(form.sslStorePassword?.trim() ? { sslStorePassword: form.sslStorePassword.trim() } : {}),
        },
      });
      toast.success("Payment settings saved");
      refetch();
    } catch {
      toast.error("Failed to save payment settings");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <DashboardFormSkeleton compact />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Payments"
        description="Choose which payment methods customers can use at checkout."
      />

      <StoreSection
        eyebrow="Methods"
        title="Checkout payment methods"
        description="Enable cash on delivery and/or SSLCommerz online payments for your storefront."
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="font-medium">Cash on delivery</p>
              <p className="text-sm text-muted-foreground">Customer pays when the order is delivered.</p>
            </div>
            <Switch
              checked={form.codEnabled !== false}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, codEnabled: checked }))}
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="font-medium">SSLCommerz (online)</p>
              <p className="text-sm text-muted-foreground">Cards, bKash, Nagad, and other gateways.</p>
            </div>
            <Switch
              checked={form.sslEnabled !== false}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, sslEnabled: checked }))}
            />
          </div>
        </div>
      </StoreSection>

      <StoreSection
        eyebrow="SSLCommerz"
        title="Store credentials (optional)"
        description="Leave blank to use platform-wide SSLCommerz credentials. Enter your own store ID and password to receive payments directly."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sslStoreId">Store ID</Label>
            <Input
              id="sslStoreId"
              value={form.sslStoreId ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, sslStoreId: e.target.value }))}
              placeholder="yourstorelive"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sslStorePassword">Store password</Label>
            <Input
              id="sslStorePassword"
              type="password"
              value={form.sslStorePassword ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, sslStorePassword: e.target.value }))}
              placeholder="••••••••"
            />
          </div>
        </div>
      </StoreSection>

      <StoreSaveBar saving={saving} onSave={handleSave} />
    </>
  );
}
