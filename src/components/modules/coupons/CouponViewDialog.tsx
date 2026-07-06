"use client";

import { Calendar, Pencil, Ticket, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/currency";
import { Coupon } from "@/types/store.types";
import { cn } from "@/lib/utils";

function activeBadgeClass(isActive: boolean) {
  return isActive
    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
    : "border-muted bg-muted text-muted-foreground";
}

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1 rounded-xl border border-border/55 bg-muted/20 p-4">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

type CouponViewDialogProps = {
  coupon: Coupon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  onEdit?: (coupon: Coupon) => void;
};

export function CouponViewDialog({
  coupon,
  open,
  onOpenChange,
  currency,
  onEdit,
}: CouponViewDialogProps) {
  const isExpired = coupon?.expiresAt ? new Date(coupon.expiresAt) < new Date() : false;
  const usageLabel = coupon
    ? `${coupon.usedCount}${coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}`
    : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2 pr-8">
            {coupon ? (
              <Badge variant="outline" className={activeBadgeClass(coupon.isActive)}>
                {coupon.isActive ? "Active" : "Inactive"}
              </Badge>
            ) : null}
            {isExpired ? <Badge variant="destructive">Expired</Badge> : null}
            {coupon?.type === "PERCENT" ? (
              <Badge variant="secondary">Percentage</Badge>
            ) : coupon ? (
              <Badge variant="secondary">Fixed amount</Badge>
            ) : null}
          </div>
          <DialogTitle className="font-mono text-xl tracking-wide">
            {coupon?.code ?? "Promo code"}
          </DialogTitle>
          <DialogDescription>Discount rules and redemption stats for this coupon.</DialogDescription>
        </DialogHeader>

        <DialogBody>
          {coupon ? (
            <div className="space-y-5">
              <div className="dashboard-panel overflow-hidden p-0">
                <div className="bg-gradient-to-br from-primary/8 via-card to-[var(--admin-accent-soft)] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl border border-border/55 bg-background/80">
                      <Ticket className="size-5 text-[var(--admin-accent-strong)]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Discount value</p>
                      <p className="text-2xl font-bold tracking-tight">
                        {coupon.type === "PERCENT"
                          ? `${coupon.value}% off`
                          : formatPrice(coupon.value, currency)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetaItem
                  label="Min purchase"
                  value={coupon.minOrder > 0 ? formatPrice(coupon.minOrder, currency) : "No minimum"}
                />
                <MetaItem label="Times used" value={usageLabel} />
                <MetaItem
                  label="Usage limit"
                  value={coupon.usageLimit ?? "Unlimited"}
                />
                <MetaItem
                  label="Expires"
                  value={
                    coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "No expiry"
                  }
                />
              </div>

              <div className="dashboard-panel space-y-3 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="size-4 text-[var(--admin-accent-strong)]" />
                  Redemption summary
                </div>
                <p className="text-sm text-muted-foreground">
                  {coupon.usedCount === 0
                    ? "This code has not been used yet."
                    : `Redeemed ${coupon.usedCount} time${coupon.usedCount === 1 ? "" : "s"}.`}
                  {coupon.usageLimit
                    ? ` ${Math.max(coupon.usageLimit - coupon.usedCount, 0)} redemption${coupon.usageLimit - coupon.usedCount === 1 ? "" : "s"} remaining.`
                    : ""}
                </p>
                {coupon.expiresAt ? (
                  <p className={cn("flex items-center gap-2 text-sm", isExpired && "text-destructive")}>
                    <Calendar className="size-3.5" />
                    {isExpired ? "Expired on " : "Valid until "}
                    {new Date(coupon.expiresAt).toLocaleDateString()}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogBody>

        <DialogFooter showCloseButton>
          {coupon && onEdit ? (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(coupon);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit coupon
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
