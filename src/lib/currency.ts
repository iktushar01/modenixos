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

const CURRENCY_LOCALES: Record<string, string> = {
  USD: "en-US",
  EUR: "en-IE",
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

const PRICE_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  numberingSystem: "latn",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

function buildPriceFormatter(currency: string): Intl.NumberFormat {
  const code = normalizeCurrencyCode(currency);
  const locale = CURRENCY_LOCALES[code] ?? "en-US";

  try {
    return new Intl.NumberFormat(locale, {
      ...PRICE_FORMAT_OPTIONS,
      style: "currency",
      currency: code,
    });
  } catch {
    return new Intl.NumberFormat("en-US", {
      ...PRICE_FORMAT_OPTIONS,
      style: "currency",
      currency: "USD",
    });
  }
}

function normalizeFormattedPrice(formatted: string, currency: string): string {
  const code = normalizeCurrencyCode(currency);
  if (code === "BDT") {
    const trailing = formatted.match(/^([\d,]+(?:\.\d+)?)৳$/);
    if (trailing) return `৳${trailing[1]}`;
  }
  return formatted.replace(/\u200f|\u200e/g, "").trim();
}

export function formatPrice(amount: number, currency = "USD"): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";

  try {
    const code = normalizeCurrencyCode(currency || "USD");
    return normalizeFormattedPrice(buildPriceFormatter(code).format(value), code);
  } catch {
    const code = normalizeCurrencyCode(currency || "USD");
    return `${code} ${value.toFixed(2)}`;
  }
}

export function formatPriceSample(currency: string): string {
  return formatPrice(1234.5, currency);
}
