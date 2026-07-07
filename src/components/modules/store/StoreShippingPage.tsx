"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import { StoreShippingConfig } from "@/types/store.types";
import { getCurrencyName } from "@/lib/currency";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { StoreSection } from "./StoreSection";
import { StoreSaveBar } from "./StoreSaveBar";

const defaultShipping: StoreShippingConfig = {
  deliveryPolicy: "",
  insideRate: undefined,
  outsideRate: undefined,
  freeShippingMin: undefined,
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
        freeShippingMin: s.freeShippingMin,
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
          ...(form.freeShippingMin !== undefined && form.freeShippingMin !== null
            ? { freeShippingMin: Number(form.freeShippingMin) }
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

  if (isLoading) {
    return <DashboardFormSkeleton compact />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Shipping & delivery"
        description="Delivery policy shown on every product page under the Delivery Options tab."
      />

      <StoreSection
        eyebrow="Policy"
        title="Delivery policy"
        description="Write your delivery zones, charges, and timelines. Supports Bengali, English, or any language."
      >
        <div className="space-y-2">
          <Label htmlFor="deliveryPolicy">Delivery options text</Label>
          <Textarea
            id="deliveryPolicy"
            rows={10}
            value={form.deliveryPolicy ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, deliveryPolicy: e.target.value }))}
            placeholder={"Inside Dhaka City: Home delivery 70 TK...\nOutside Dhaka: Courier 150 TK..."}
            className="min-h-[220px] resize-y"
          />
        </div>
      </StoreSection>

      <StoreSection
        eyebrow="Rates"
        title="Delivery rates (optional)"
        description="Rates apply at checkout based on the customer's country vs your store country."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="insideRate">
              Inside city rate ({store?.currency ?? "USD"} — {getCurrencyName(store?.currency ?? "USD")})
            </Label>
            <Input
              id="insideRate"
              type="number"
              min="0"
              step="0.01"
              className="h-10"
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
              className="h-10"
              value={form.outsideRate ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  outsideRate: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="freeShippingMin">
              Free shipping above ({store?.currency ?? "USD"})
            </Label>
            <Input
              id="freeShippingMin"
              type="number"
              min="0"
              step="0.01"
              className="h-10"
              placeholder="Optional minimum subtotal"
              value={form.freeShippingMin ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  freeShippingMin: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
            />
          </div>
        </div>
      </StoreSection>

      <StoreSaveBar
        label="Save shipping settings"
        onSave={handleSave}
        saving={saving}
        hint="Delivery text appears on every product page."
      />
    </>
  );
}
