"use client";

import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BillingOverview, ComparisonRow, PaidPlanId } from "@/actions/billing.actions";

const PLAN_COLUMNS: Array<{ id: "FREE" | "PRO" | "PRO_PLUS" | "ULTRA"; label: string }> = [
  { id: "FREE", label: "Free" },
  { id: "PRO", label: "Pro" },
  { id: "PRO_PLUS", label: "Pro+" },
  { id: "ULTRA", label: "Ultra Pro+" },
];

interface BillingComparisonTableProps {
  rows: ComparisonRow[];
  overview: BillingOverview;
  yearly: boolean;
  onUpgrade: (plan: PaidPlanId) => void;
  upgradingPlan: PaidPlanId | null;
  paymentReady: boolean;
}

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto size-4 text-emerald-600" aria-label="Included" />
    ) : (
      <Minus className="mx-auto size-4 text-muted-foreground/50" aria-label="Not included" />
    );
  }
  return <span className="text-sm">{value}</span>;
}

function rowPriceMonthly(plan: "PRO" | "PRO_PLUS" | "ULTRA" | "FREE") {
  if (plan === "FREE") return "$0";
  const map = { PRO: "$1", PRO_PLUS: "$3", ULTRA: "$5" };
  return map[plan];
}

function rowPriceYearly(plan: "PRO" | "PRO_PLUS" | "ULTRA" | "FREE") {
  if (plan === "FREE") return "$0";
  const map = { PRO: "$10", PRO_PLUS: "$30", ULTRA: "$50" };
  return map[plan];
}

export function BillingComparisonTable({
  rows,
  overview,
  yearly,
  onUpgrade,
  upgradingPlan,
  paymentReady,
}: BillingComparisonTableProps) {
  const currentPlan = overview.entitlements.plan;

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[160px]">Feature</TableHead>
            {PLAN_COLUMNS.map((col) => (
              <TableHead key={col.id} className="min-w-[120px] text-center">
                <div className="flex flex-col items-center gap-1">
                  <span>{col.label}</span>
                  {currentPlan === col.id && (
                    <Badge variant="secondary" className="text-[10px]">
                      Current
                    </Badge>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key}>
              <TableCell className="font-medium">{row.label}</TableCell>
              {PLAN_COLUMNS.map((col) => (
                <TableCell key={col.id} className="text-center">
                  <CellValue value={row.values[col.id]} />
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-medium">{yearly ? "Yearly price" : "Monthly price"}</TableCell>
            {PLAN_COLUMNS.map((col) => (
              <TableCell key={col.id} className="text-center text-sm font-semibold">
                {yearly ? rowPriceYearly(col.id) : rowPriceMonthly(col.id)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell />
            {PLAN_COLUMNS.map((col) => {
              const isCurrent = currentPlan === col.id;
              const isPaid = col.id !== "FREE";
              return (
                <TableCell key={col.id} className="text-center">
                  {isCurrent ? (
                    <Badge>Current</Badge>
                  ) : isPaid ? (
                    <Button
                      size="sm"
                      className="w-full max-w-[120px]"
                      disabled={!paymentReady || upgradingPlan === col.id}
                      onClick={() => onUpgrade(col.id as PaidPlanId)}
                    >
                      {upgradingPlan === col.id ? "…" : "Upgrade"}
                    </Button>
                  ) : null}
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
