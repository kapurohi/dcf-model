"use client";

import { formatCompactCurrency, formatCurrency, formatPercent, formatSignedPercent } from "@/lib/formatters";

const METRICS = [
  { key: "current_price", label: "Current Price", type: "currency", digits: 2 },
  { key: "enterprise_value", label: "Enterprise Value", type: "compactCurrency" },
  { key: "equity_value", label: "Equity Value", type: "compactCurrency" },
  { key: "implied_share_price", label: "Implied Share Price", type: "currency", digits: 2 },
  { key: "upside_downside", label: "Upside / Downside", type: "percent", digits: 1 },
  { key: "terminal_value_weight", label: "Terminal Value % of EV", type: "percent", digits: 1 },
];

export default function SummaryCards({ summary, currency = "USD" }) {
  return (
    <div className="summary-grid">
      {METRICS.map((metric) => (
        <div className="summary-card" key={metric.key}>
          <div className="summary-label">{metric.label}</div>
          <div className="summary-value">{formatMetric(summary?.[metric.key], metric, currency)}</div>
        </div>
      ))}
    </div>
  );
}

function formatMetric(value, metric, currency) {
  if (metric.type === "currency") return formatCurrency(value, metric.digits ?? 0, currency);
  if (metric.type === "compactCurrency") return formatCompactCurrency(value, currency);
  if (metric.key === "upside_downside") return formatSignedPercent(value, metric.digits ?? 1);
  if (metric.type === "percent") return formatPercent(value, metric.digits ?? 1);
  return value ?? "--";
}
