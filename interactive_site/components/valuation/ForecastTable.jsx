"use client";

import { formatCompactCurrency, formatPercent } from "@/lib/formatters";

const ROWS = [
  ["Revenue", "revenue", "currency"],
  ["EBITDA", "ebitda", "currency"],
  ["D&A", "depreciation", "currency"],
  ["EBIT", "ebit", "currency"],
  ["NOPAT", "nopat", "currency"],
  ["CapEx", "capex", "currency"],
  ["NWC", "nwc", "currency"],
  ["Change in NWC", "delta_nwc", "currency"],
  ["UFCF", "fcff", "currency"],
  ["Discount Factor", "discount_factor", "percentLike"],
  ["PV of UFCF", "pv_fcff", "currency"],
];

export default function ForecastTable({ forecast, currency = "USD" }) {
  if (!forecast?.length) return null;

  return (
    <section className="panel premium-panel table-panel">
      <div className="panel-heading">
        <div>
          <h3>Forecast Model</h3>
          <p>Explicit forecast schedule from revenue through discounted UFCF.</p>
        </div>
      </div>
      <div className="table-scroll-shell">
        <table className="finance-grid forecast-grid">
          <thead>
            <tr>
              <th>Metric</th>
              {forecast.map((row) => (
                <th key={row.year}>Year {row.year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, key, format]) => (
              <tr key={key}>
                <td>{label}</td>
                {forecast.map((row) => (
                  <td key={`${key}-${row.year}`}>{formatValue(row[key], format, currency)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Revenue Growth</td>
              {forecast.map((row) => <td key={`growth-${row.year}`}>{formatPercent(row.revenue_growth, 1)}</td>)}
            </tr>
            <tr>
              <td>EBITDA Margin</td>
              {forecast.map((row) => <td key={`margin-${row.year}`}>{formatPercent(row.ebitda_margin, 1)}</td>)}
            </tr>
            <tr>
              <td>Tax Rate</td>
              {forecast.map((row) => <td key={`tax-${row.year}`}>{formatPercent(row.tax_rate, 1)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatValue(value, mode, currency) {
  if (mode === "currency") return formatCompactCurrency(value, currency);
  if (mode === "percentLike") return value == null ? "--" : value.toFixed(3);
  return value ?? "--";
}
