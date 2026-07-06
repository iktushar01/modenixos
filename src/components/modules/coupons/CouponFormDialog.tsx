"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createCouponAction, updateCouponAction } from "@/actions/catalog.actions";
import { Coupon } from "@/types/store.types";

type CouponFormState = {
  code: string;
  amount: string;
  percent: string;
  enableMinPurchase: boolean;
  minOrder: string;
  enableUsageLimit: boolean;
  usageLimit: string;
  expiresAt: string;
  isActive: boolean;
};

const emptyForm: CouponFormState = {
  code: "",
  amount: "",
  percent: "",
  enableMinPurchase: false,
  minOrder: "",
  enableUsageLimit: false,
  usageLimit: "",
  expiresAt: "",
  isActive: true,
};

function couponToForm(coupon: Coupon): CouponFormState {
  return {
    code: coupon.code,
    amount: coupon.type === "FIXED" ? String(coupon.value) : "",
    percent: coupon.type === "PERCENT" ? String(coupon.value) : "",
    enableMinPurchase: coupon.minOrder > 0,
    minOrder: coupon.minOrder > 0 ? String(coupon.minOrder) : "",
    enableUsageLimit: coupon.usageLimit != null,
    usageLimit: coupon.usageLimit != null ? String(coupon.usageLimit) : "",
    expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
    isActive: coupon.isActive,
  };
}

function buildPayload(form: CouponFormState, isEdit = false) {
  const hasAmount = form.amount.trim() !== "";
  const hasPercent = form.percent.trim() !== "";

  if (!form.code.trim()) throw new Error("Promo code is required");
  if (!hasAmount && !hasPercent) throw new Error("Enter an amount or percentage discount");
  if (hasAmount && hasPercent) throw new Error("Use either amount or percentage, not both");

  const type = hasPercent ? "PERCENT" : "FIXED";
  const value = Number(hasPercent ? form.percent : form.amount);
  if (!Number.isFinite(value) || value <= 0) throw new Error("Discount must be greater than zero");
  if (type === "PERCENT" && value > 100) throw new Error("Percentage cannot exceed 100");

  const emptyOptional = isEdit ? null : undefined;

  return {
    code: form.code.trim().toUpperCase(),
    type,
    value,
    minOrder: form.enableMinPurchase ? Number(form.minOrder || 0) : 0,
    usageLimit: form.enableUsageLimit ? Number(form.usageLimit) : emptyOptional,
    expiresAt: form.expiresAt
      ? new Date(`${form.expiresAt}T23:59:59`).toISOString()
      : emptyOptional,
    isActive: form.isActive,
  };
}

type CouponFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
};

export function CouponFormDialog({ open, onOpenChange, coupon }: CouponFormDialogProps) {
  const isEdit = Boolean(coupon);
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CouponFormState>(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(coupon ? couponToForm(coupon) : emptyForm);
    }
  }, [open, coupon]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = buildPayload(form, isEdit);
      if (isEdit && coupon) {
        return updateCouponAction(coupon.id, payload);
      }
      return createCouponAction(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Coupon updated" : "Coupon created");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to save coupon");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit promo code" : "Create promo code"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update discount rules and availability for this code."
              : "Set up a unique code customers can apply at checkout."}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="coupon-code">
              Code name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="coupon-code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="Promo code"
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              Enter a unique promo code. This will help you identify it later.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Discount type (amount / percentage)</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value, percent: "" })}
                placeholder="Amount"
                className="h-10"
              />
              <span className="shrink-0 text-sm text-muted-foreground">Or</span>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.percent}
                onChange={(e) => setForm({ ...form, percent: e.target.value, amount: "" })}
                placeholder="Percentage"
                className="h-10"
              />
            </div>
          </div>

          <div className="dashboard-panel space-y-4 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="min-purchase-toggle">Min purchase</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Set a minimum order total before this coupon can be used.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground">
                  Require a minimum cart value for the discount to apply.
                </p>
              </div>
              <Switch
                id="min-purchase-toggle"
                checked={form.enableMinPurchase}
                onCheckedChange={(enableMinPurchase) => setForm({ ...form, enableMinPurchase })}
              />
            </div>
            {form.enableMinPurchase ? (
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                placeholder="Minimum order amount"
                className="h-10"
              />
            ) : null}
          </div>

          <div className="dashboard-panel space-y-4 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="usage-limit-toggle">Usage limit</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>Limit how many times this code can be redeemed.</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cap total redemptions across all customers.
                </p>
              </div>
              <Switch
                id="usage-limit-toggle"
                checked={form.enableUsageLimit}
                onCheckedChange={(enableUsageLimit) => setForm({ ...form, enableUsageLimit })}
              />
            </div>
            {form.enableUsageLimit ? (
              <Input
                type="number"
                min="1"
                step="1"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="Max redemptions"
                className="h-10"
              />
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coupon-expiry">Expiry date</Label>
            <div className="relative">
              <Input
                id="coupon-expiry"
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="h-10 pr-10"
              />
              <Calendar className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="dashboard-toggle-row">
            <div className="space-y-1">
              <Label htmlFor="coupon-active">Active status</Label>
              <p className="text-xs text-muted-foreground">
                Inactive codes cannot be applied at checkout.
              </p>
            </div>
            <Switch
              id="coupon-active"
              checked={form.isActive}
              onCheckedChange={(isActive) => setForm({ ...form, isActive })}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
