"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatPriceSample,
  getCurrencyName,
  isKnownCurrency,
  normalizeCurrencyCode,
  STORE_CURRENCIES,
} from "@/lib/currency";

interface CurrencySelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  showPreview?: boolean;
}

export function CurrencySelect({ id = "currency", value, onChange, showPreview = true }: CurrencySelectProps) {
  const normalized = normalizeCurrencyCode(value || "USD");
  const presetValue = isKnownCurrency(normalized) ? normalized : "custom";

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Store currency</Label>
      <Select
        value={presetValue}
        onValueChange={(next) => {
          if (next === "custom") {
            onChange(isKnownCurrency(normalized) ? "" : normalized);
            return;
          }
          onChange(next);
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {STORE_CURRENCIES.map((item) => (
            <SelectItem key={item.code} value={item.code}>
              {item.code} — {item.name}
            </SelectItem>
          ))}
          <SelectItem value="custom">Other (3-letter code)</SelectItem>
        </SelectContent>
      </Select>

      {presetValue === "custom" && (
        <Input
          value={value}
          onChange={(e) => onChange(normalizeCurrencyCode(e.target.value))}
          placeholder="e.g. NOK"
          maxLength={3}
          className="uppercase"
        />
      )}

      {showPreview && normalized.length === 3 && (
        <p className="text-xs text-muted-foreground">
          Storefront preview: {formatPriceSample(normalized)} ({getCurrencyName(normalized)})
        </p>
      )}
    </div>
  );
}
