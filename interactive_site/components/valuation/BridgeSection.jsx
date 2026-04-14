"use client";

import { formatCompactCurrency, formatCurrency } from "@/lib/formatters";

export default function BridgeSection({ bridge, assumptionsUsed, currency = "USD" }) {
  const shares = assumptionsUsed?.diluted_shares_outstanding;

  return (
    <section className="panel premium-panel bridge-panel">
      <div className="panel-heading">
        <div>
          <h3>EV to Equity Bridge</h3>
          <p>Analyst-style bridge from forecast cash flows to per-share value.</p>
        </div>
      </div>
      <div className="table-scroll-shell">
        <table className="finance-grid compact-grid">
          <thead>
            <tr>
              <th>Bridge Item</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {(bridge || []).map((row) => (
              <tr key={row.metric}>
                <td>{row.metric}</td>
                <td>{row.metric === "Implied Share Price" ? formatCurrency(row.value, 2, currency) : formatCompactCurrency(row.value, currency)}</td>
              </tr>
            ))}
            <tr>
              <td>Shares Outstanding</td>
              <td>{shares ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(shares) : "--"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
