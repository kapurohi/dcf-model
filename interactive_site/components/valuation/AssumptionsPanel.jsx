"use client";

import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";

import { FIELD_META } from "@/lib/valuation";

const SERIES_FIELDS = [
  "revenue_growth",
  "ebitda_margin",
  "da_percent_revenue",
  "capex_percent_revenue",
  "nwc_percent_revenue",
  "tax_rate",
];

const SCALAR_FIELDS = ["wacc", "terminal_growth", "net_debt", "diluted_shares_outstanding"];

export default function AssumptionsPanel({
  scenarioState,
  onProjectionYearsChange,
  onSeriesModeChange,
  onFlatSeriesChange,
  onYearSeriesChange,
  onScalarChange,
  runErrors,
  busy,
  onRun,
  onReset,
}) {
  if (!scenarioState) return null;

  return (
    <section className="panel premium-panel assumptions-panel-v2">
      <div className="panel-heading assumptions-header">
        <div>
          <h3>Assumptions</h3>
          <p>Customize the forecast drivers sent to the backend.</p>
        </div>
        <div className="assumptions-header-actions">
          <div className="projection-years-block">
            <label htmlFor="projectionYears">Projection Years</label>
            <input
              id="projectionYears"
              type="number"
              min="1"
              max="10"
              value={scenarioState.projectionYears}
              onChange={(event) => onProjectionYearsChange(Number(event.target.value))}
            />
          </div>
          <button type="button" className="scenario-reset" onClick={onReset}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      <div className="assumptions-section-grid">
        <div className="assumptions-fields-column">
          {SERIES_FIELDS.map((field) => (
            <SeriesFieldEditor
              key={field}
              field={field}
              state={scenarioState}
              onModeChange={onSeriesModeChange}
              onFlatChange={onFlatSeriesChange}
              onYearChange={onYearSeriesChange}
            />
          ))}
        </div>
        <div className="assumptions-scalars-column">
          {SCALAR_FIELDS.map((field) => (
            <ScalarFieldEditor
              key={field}
              field={field}
              value={scenarioState.scalarValues[field]}
              onChange={onScalarChange}
            />
          ))}
        </div>
      </div>

      {runErrors?.length ? (
        <div className="validation-banner">
          {runErrors.map((error) => <p key={error}>{error}</p>)}
        </div>
      ) : null}

      <div className="assumptions-actions">
        <button type="button" className="run-valuation-button" onClick={onRun} disabled={busy}>
          {busy ? "Running valuation..." : "Run Valuation"}
        </button>
      </div>
    </section>
  );
}

function SeriesFieldEditor({ field, state, onModeChange, onFlatChange, onYearChange }) {
  const meta = FIELD_META[field];
  const mode = state.seriesModes[field];
  const values = state.seriesValues[field] || [];
  const flatValue = state.seriesFlat[field];

  return (
    <div className="assumption-card">
      <div className="assumption-card-head">
        <div><h4>{meta.label}</h4></div>
        <div className="mode-toggle">
          <button type="button" className={mode === "flat" ? "active" : ""} onClick={() => onModeChange(field, "flat")}>Flat</button>
          <button type="button" className={mode === "yearly" ? "active" : ""} onClick={() => onModeChange(field, "yearly")}>Year-by-year</button>
        </div>
      </div>

      {mode === "flat" ? (
        <div className="assumption-flat-row">
          <Slider
            value={[Number(flatValue)]}
            min={meta.min}
            max={meta.max}
            step={meta.step}
            onValueChange={(nextValue) => onFlatChange(field, nextValue[0])}
            showTooltip
            tooltipContent={(value) => displayValue(value, meta.type)}
          />
          <input
            type="number"
            step={meta.step}
            min={meta.min}
            max={meta.max}
            value={flatValue}
            onChange={(event) => onFlatChange(field, Number(event.target.value))}
          />
        </div>
      ) : (
        <div className="year-editor-grid">
          {values.map((value, index) => (
            <div className="year-editor-row" key={`${field}-${index}`}>
              <span>Y{index + 1}</span>
              <Slider
                value={[Number(value)]}
                min={meta.min}
                max={meta.max}
                step={meta.step}
                onValueChange={(nextValue) => onYearChange(field, index, nextValue[0])}
                showTooltip
                tooltipContent={(sliderValue) => displayValue(sliderValue, meta.type)}
              />
              <input
                type="number"
                step={meta.step}
                min={meta.min}
                max={meta.max}
                value={value}
                onChange={(event) => onYearChange(field, index, Number(event.target.value))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScalarFieldEditor({ field, value, onChange }) {
  const meta = FIELD_META[field];
  const isPercent = meta.type === "percent";
  const inputProps = isPercent ? { min: meta.min, max: meta.max, step: meta.step } : { step: "any" };

  return (
    <div className="scalar-card">
      <div className="scalar-card-head">
        <h4>{meta.label}</h4>
      </div>
      {isPercent ? (
        <div className="scalar-slider-row">
          <Slider
            value={[Number(value)]}
            min={meta.min}
            max={meta.max}
            step={meta.step}
            onValueChange={(nextValue) => onChange(field, nextValue[0])}
            showTooltip
            tooltipContent={(sliderValue) => displayValue(sliderValue, meta.type)}
          />
          <input type="number" value={value} onChange={(event) => onChange(field, Number(event.target.value))} {...inputProps} />
        </div>
      ) : (
        <input
          className="scalar-input"
          type="number"
          value={value}
          onChange={(event) => onChange(field, Number(event.target.value))}
          {...inputProps}
        />
      )}
    </div>
  );
}

function displayValue(value, type) {
  if (type === "percent") return `${(Number(value) * 100).toFixed(1)}%`;
  if (type === "currency") return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value));
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value));
}
