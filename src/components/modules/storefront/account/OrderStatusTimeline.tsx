"use client";

import { Check, Circle, Package, Truck } from "lucide-react";
import { Order } from "@/types/store.types";
import {
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  isOrderStatusComplete,
} from "@/lib/storefront/orderTracking";
import { cn } from "@/lib/utils";

const STEP_ICONS = [Package, Package, Package, Truck, Check];

export function OrderStatusTimeline({ order }: { order: Order }) {
  const cancelled = order.status === "CANCELLED";

  if (cancelled) {
    return (
      <div className="sf-editorial-card border-dashed p-6">
        <p className="sf-eyebrow text-[var(--sf-destructive)]">Cancelled</p>
        <p className="sf-muted-fg mt-2 text-sm">{ORDER_STATUS_DESCRIPTIONS.CANCELLED}</p>
      </div>
    );
  }

  return (
    <ol className="space-y-0">
      {ORDER_STATUS_FLOW.map((step, index) => {
        const complete = isOrderStatusComplete(order.status, step);
        const current = order.status === step;
        const Icon = STEP_ICONS[index] ?? Circle;

        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            {index < ORDER_STATUS_FLOW.length - 1 && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px",
                  complete ? "bg-[var(--sf-primary)]" : "bg-[var(--sf-border)]",
                )}
              />
            )}
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                complete
                  ? "sf-primary border-transparent"
                  : "sf-border sf-muted bg-[var(--sf-card)]",
                current && "ring-4 ring-[color-mix(in_srgb,var(--sf-primary)_18%,transparent)]",
              )}
            >
              {complete ? <Check className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
            </div>
            <div className="min-w-0 pt-0.5">
              <p className={cn("text-sm font-medium", current ? "sf-fg" : complete ? "sf-fg" : "sf-muted-fg")}>
                {ORDER_STATUS_LABELS[step]}
              </p>
              <p className="sf-muted-fg mt-1 text-sm">
                {current ? ORDER_STATUS_DESCRIPTIONS[step] : complete ? "Completed" : "Upcoming"}
              </p>
              {current && step === "SHIPPED" && order.trackingNumber && (
                <div className="sf-editorial-card mt-3 p-3 text-sm">
                  <p className="sf-eyebrow">Tracking</p>
                  <p className="mt-1 font-medium sf-fg">
                    {order.trackingCarrier ? `${order.trackingCarrier} · ` : ""}
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
