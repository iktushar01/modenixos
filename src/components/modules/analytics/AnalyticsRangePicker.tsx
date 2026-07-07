"use client";

import { cn } from "@/lib/utils";
import type { AnalyticsRangeKey } from "@/types/store.types";

const RANGE_OPTIONS: Array<{ value: AnalyticsRangeKey; label: string; proOnly?: boolean }> = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days", proOnly: true },
];

interface AnalyticsRangePickerProps {
  value: AnalyticsRangeKey;
  onChange: (value: AnalyticsRangeKey) => void;
  advancedAnalytics?: boolean;
}

export function AnalyticsRangePicker({
  value,
  onChange,
  advancedAnalytics = false,
}: AnalyticsRangePickerProps) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-border/60 bg-muted/30 p-1">
      {RANGE_OPTIONS.map((option) => {
        const disabled = option.proOnly && !advancedAnalytics;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              value === option.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              disabled && "cursor-not-allowed opacity-40",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
