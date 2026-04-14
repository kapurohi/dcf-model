const SUPPORTED_CURRENCIES = new Set(["USD", "GBP", "INR", "EUR", "JPY", "AUD", "SGD", "HKD"]);

function normalizeCurrencyCode(currency) {
  const normalized = String(currency || "USD").trim().toUpperCase();
  return SUPPORTED_CURRENCIES.has(normalized) ? normalized : "USD";
}

export function formatCurrency(value, digits = 0, currency = "USD") {
  if (value == null || Number.isNaN(Number(value))) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalizeCurrencyCode(currency),
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number(value));
}

export function formatCompactCurrency(value, currency = "USD") {
  if (value == null || Number.isNaN(Number(value))) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalizeCurrencyCode(currency),
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value));
}

export function formatPercent(value, digits = 1) {
  if (value == null || Number.isNaN(Number(value))) return "--";
  return `${(Number(value) * 100).toFixed(digits)}%`;
}

export function formatSignedPercent(value, digits = 1) {
  if (value == null || Number.isNaN(Number(value))) return "--";
  const numeric = Number(value);
  const prefix = numeric > 0 ? "+" : "";
  return `${prefix}${(numeric * 100).toFixed(digits)}%`;
}

export function formatPlainNumber(value, digits = 0) {
  if (value == null || Number.isNaN(Number(value))) return "--";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number(value));
}
