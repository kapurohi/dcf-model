"use client";

import { formatCurrency, formatPercent } from "@/lib/formatters";

export default function SensitivityGrid({ sensitivity, currency = "USD" }) {
  if (!sensitivity?.length) return null;

  const columns = Object.keys(sensitivity[0]?.values || {});
  const allValues = sensitivity.flatMap((row) => Object.values(row.values || {}).filter((value) => value != null));
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  return (
    <section className="panel premium-panel sensitivity-panel">
      <div className="panel-heading">
        <div>
          <h3>Sensitivity Analysis</h3>
          <p>Implied share price across WACC and terminal growth assumptions.</p>
        </div>
      </div>
      <div className="table-scroll-shell">
        <table className="finance-grid sensitivity-grid">
          <thead>
            <tr>
              <th>Terminal Growth</th>
              {columns.map((column) => (
                <th key={column}>{column.replace("WACC ", "")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sensitivity.map((row) => (
              <tr key={row.terminal_growth}>
                <td>{formatPercent(row.terminal_growth, 1)}</td>
                {columns.map((column) => {
                  const value = row.values[column];
                  return (
                    <td key={`${row.terminal_growth}-${column}`} style={buildHeatStyle(value, min, max)}>
                      {value == null ? "--" : formatCurrency(value, 1, currency)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function buildHeatStyle(value, min, max) {
  if (value == null || !Number.isFinite(value) || max === min) return {};
  const ratio = (value - min) / (max - min);
  const alpha = 0.08 + ratio * 0.2;
  return {
    background: `rgba(27, 46, 77, ${alpha})`,
    color: ratio > 0.55 ? "#f7f9fc" : undefined,
  };
}
