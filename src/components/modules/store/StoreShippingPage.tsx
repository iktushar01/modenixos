"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import { StoreShippingConfig } from "@/types/store.types";
import { getCurrencyName } from "@/lib/currency";
import { useDashboardReady } from "@/components/shared/DashboardRouteTemplate";

const defaultShipping: StoreShippingConfig = {
  deliveryPolicy: "",
  insideRate: undefined,
  outsideRate: undefined,
};

export default function StoreShippingPage() {
  const { data: store, refetch, isLoading } = useMyStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StoreShippingConfig>(defaultShipping);

  useEffect(() => {
    if (store?.shipping) {
      const s = store.shipping as StoreShippingConfig;
      setForm({
        deliveryPolicy: s.deliveryPolicy ?? "",
        insideRate: s.insideRate,
        outsideRate: s.outsideRate,
      });
    }
  }, [store]);

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    try {
      await updateStoreAction(store.id, {
        shipping: {
          deliveryPolicy: form.deliveryPolicy,
          ...(form.insideRate !== undefined && form.insideRate !== null
            ? { insideRate: Number(form.insideRate) }
            : {}),
          ...(form.outsideRate !== undefined && form.outsideRate !== null
            ? { outsideRate: Number(form.outsideRate) }
            : {}),
        },
      });
      toast.success("Shipping settings saved");
      refetch();
    } catch {
      toast.error("Failed to save shipping settings");
    } finally {
      setSaving(false);
    }
  };

  useDashboardReady(!isLoading);

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipping & delivery"
        description="Delivery policy shown on every product page under the Delivery Options tab."
      />

      <Card>
        <CardHeader>
          <CardTitle>Delivery policy</CardTitle>
          <CardDescription>
            Write your delivery zones, charges, and timelines. Supports Bengali, English, or any language.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryPolicy">Delivery options text</Label>
            <Textarea
              id="deliveryPolicy"
              rows={10}
              value={form.deliveryPolicy ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, deliveryPolicy: e.target.value }))}
              placeholder={"Inside Dhaka City: Home delivery 70 TK...\nOutside Dhaka: Courier 150 TK..."}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery rates (optional)</CardTitle>
          <CardDescription>For future checkout integration. Not used on checkout yet.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="insideRate">
              Inside city rate ({store?.currency ?? "USD"} — {getCurrencyName(store?.currency ?? "USD")})
            </Label>
            <Input
              id="insideRate"
              type="number"
              min="0"
              step="0.01"
              value={form.insideRate ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  insideRate: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="outsideRate">
              Outside city rate ({store?.currency ?? "USD"} — {getCurrencyName(store?.currency ?? "USD")})
            </Label>
            <Input
              id="outsideRate"
              type="number"
              min="0"
              step="0.01"
              value={form.outsideRate ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  outsideRate: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save shipping settings
      </Button>
    </div>
  );
}
