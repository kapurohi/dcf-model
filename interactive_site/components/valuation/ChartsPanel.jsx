"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompactCurrency, formatCurrency } from "@/lib/formatters";

export default function ChartsPanel({ forecast, bridge, currency = "USD" }) {
  const trendData = (forecast || []).map((row) => ({
    year: `Y${row.year}`,
    revenue: row.revenue,
    ebitda: row.ebitda,
    ufcf: row.fcff,
  }));

  const bridgeData = (bridge || [])
    .filter((row) => /PV|Enterprise|Equity/.test(row.metric))
    .map((row) => ({ label: row.metric, value: row.value }));

  return (
    <div className="workspace-charts-grid">
      <section className="panel chart-panel premium-panel">
        <div className="panel-heading">
          <div>
            <h3>Revenue, EBITDA, and UFCF</h3>
            <p>Operating progression across the explicit forecast window.</p>
          </div>
        </div>
        <div className="chart-shell large">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "var(--chart-axis)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => formatCompactCurrency(value, currency)} tick={{ fill: "var(--chart-axis)", fontSize: 12 }} axisLine={false} tickLine={false} width={82} />
              <Tooltip
                formatter={(value) => formatCurrency(value, 0, currency)}
                contentStyle={{
                  background: "var(--chart-tooltip-bg)",
                  border: "1px solid var(--chart-tooltip-border)",
                  borderRadius: 14,
                  boxShadow: "0 16px 36px rgba(0, 0, 0, 0.28)",
                }}
                labelStyle={{ color: "var(--chart-tooltip-text)", fontWeight: 600 }}
                itemStyle={{ color: "var(--chart-tooltip-text)" }}
                cursor={{ stroke: "var(--chart-reference)", strokeOpacity: 0.2 }}
              />
              <Legend wrapperStyle={{ color: "var(--chart-axis)", fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="var(--chart-revenue)" strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="var(--chart-ebitda)" strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="ufcf" name="UFCF" stroke="var(--chart-ufcf)" strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel chart-panel premium-panel">
        <div className="panel-heading">
          <div>
            <h3>EV Composition</h3>
            <p>How enterprise value builds from forecast cash flows and terminal value.</p>
          </div>
        </div>
        <div className="chart-shell medium">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bridgeData} layout="vertical" margin={{ top: 8, right: 18, left: 46, bottom: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCompactCurrency(value, currency)} tick={{ fill: "var(--chart-axis)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" tick={{ fill: "var(--chart-axis)", fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
              <Tooltip
                formatter={(value) => formatCompactCurrency(value, currency)}
                contentStyle={{
                  background: "var(--chart-tooltip-bg)",
                  border: "1px solid var(--chart-tooltip-border)",
                  borderRadius: 14,
                  boxShadow: "0 16px 36px rgba(0, 0, 0, 0.28)",
                }}
                labelStyle={{ color: "var(--chart-tooltip-text)", fontWeight: 600 }}
                itemStyle={{ color: "var(--chart-tooltip-text)" }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="value" fill="var(--chart-revenue)" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
