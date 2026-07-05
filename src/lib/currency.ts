export const STORE_CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "INR", name: "Indian Rupee" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "THB", name: "Thai Baht" },
] as const;

const CURRENCY_LOCALES: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  BDT: "bn-BD",
  INR: "en-IN",
  PKR: "en-PK",
  AED: "ar-AE",
  SAR: "ar-SA",
  CAD: "en-CA",
  AUD: "en-AU",
  JPY: "ja-JP",
  CNY: "zh-CN",
  SGD: "en-SG",
  MYR: "ms-MY",
  THB: "th-TH",
};

export function normalizeCurrencyCode(code: string): string {
  return code.trim().toUpperCase().slice(0, 3);
}

export function isKnownCurrency(code: string): boolean {
  const normalized = normalizeCurrencyCode(code);
  return STORE_CURRENCIES.some((item) => item.code === normalized);
}

export function getCurrencyName(code: string): string {
  const normalized = normalizeCurrencyCode(code);
  return STORE_CURRENCIES.find((item) => item.code === normalized)?.name ?? normalized;
}

export function formatPrice(amount: number, currency = "USD"): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";

  const code = normalizeCurrencyCode(currency || "USD");
  const locale = CURRENCY_LOCALES[code] ?? "en-US";

  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(value);
  } catch {
    return `${code} ${value.toFixed(2)}`;
  }
}

export function formatPriceSample(currency: string): string {
  return formatPrice(1234.5, currency);
}
