// Currency symbols and formatting
const CURRENCY_CONFIG: Record<string, { symbol: string; locale: string }> = {
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
  GBP: { symbol: "£", locale: "en-GB" },
  CAD: { symbol: "CA$", locale: "en-CA" },
  AUD: { symbol: "A$", locale: "en-AU" },
  JPY: { symbol: "¥", locale: "ja-JP" },
};

export function formatCurrency(
  amount: number | null | undefined,
  currency: string = "USD"
): string {
  if (amount == null) return "-";
  
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  
  // For JPY, don't show decimals
  const decimals = currency === "JPY" ? 0 : 2;
  
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function getCurrencySymbol(currency: string = "USD"): string {
  return CURRENCY_CONFIG[currency]?.symbol || "$";
}

export function formatPrice(
  amount: number | null | undefined,
  currency: string = "USD"
): string {
  if (amount == null) return "-";
  
  const symbol = getCurrencySymbol(currency);
  const decimals = currency === "JPY" ? 0 : 2;
  
  return `${symbol}${amount.toFixed(decimals)}`;
}
