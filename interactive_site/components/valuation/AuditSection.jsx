"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { formatAssumptionSource } from "@/lib/valuation";

function Disclosure({ title, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="audit-block">
      <button type="button" className="audit-toggle" onClick={() => setOpen((value) => !value)}>
        <span>{title}</span>
        <span className="audit-meta">
          {count != null ? <em>{count}</em> : null}
          <ChevronDown size={15} className={open ? "rotated" : ""} />
        </span>
      </button>
      {open ? <div className="audit-content">{children}</div> : null}
    </div>
  );
}

export default function AuditSection({ diagnostics, dataQuality, assumptionsSource }) {
  return (
    <section className="panel premium-panel audit-panel">
      <div className="panel-heading">
        <div>
          <h3>Diagnostics and Audit Trail</h3>
          <p>Validation visibility, data provenance, and assumption sourcing.</p>
        </div>
      </div>

      <Disclosure title="Diagnostics" count={diagnostics?.length ?? 0} defaultOpen>
        {diagnostics?.length ? (
          <ul className="audit-list">
            {diagnostics.map((item) => <li key={item}>{item}</li>)}
          </ul>
        ) : (
          <p className="audit-empty">No diagnostic warnings were returned for the active run.</p>
        )}
      </Disclosure>

      <Disclosure title="Data Quality" count={(dataQuality?.missing_fields?.length || 0) + (dataQuality?.fallbacks_used?.length || 0)}>
        <div className="audit-grid">
          <div>
            <h4>Missing fields</h4>
            {dataQuality?.missing_fields?.length ? (
              <ul className="audit-list slim">
                {dataQuality.missing_fields.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : <p className="audit-empty">No missing fields reported.</p>}
          </div>
          <div>
            <h4>Fallback fields</h4>
            {dataQuality?.fallbacks_used?.length ? (
              <ul className="audit-list slim">
                {dataQuality.fallbacks_used.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : <p className="audit-empty">No fallback fields reported.</p>}
          </div>
        </div>
        {dataQuality?.notes?.length ? (
          <div className="audit-notes">
            {dataQuality.notes.map((note) => <p key={note}>{note}</p>)}
          </div>
        ) : null}
      </Disclosure>

      <Disclosure title="Assumptions Source" count={Object.keys(assumptionsSource || {}).length}>
        <div className="table-scroll-shell">
          <table className="finance-grid compact-grid assumptions-source-grid">
            <thead>
              <tr>
                <th>Field</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(assumptionsSource || {}).map(([field, source]) => (
                <tr key={field}>
                  <td>{field}</td>
                  <td><span className={`source-pill ${String(source).replace(/\s+/g, "-")}`}>{formatAssumptionSource(source)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Disclosure>
    </section>
  );
}
