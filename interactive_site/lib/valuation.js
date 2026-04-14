const SERIES_FIELDS = [
  "revenue_growth",
  "ebitda_margin",
  "da_percent_revenue",
  "capex_percent_revenue",
  "nwc_percent_revenue",
  "tax_rate",
];

export const FIELD_META = {
  revenue_growth: { label: "Revenue Growth", type: "percent", min: -0.2, max: 0.3, step: 0.005 },
  ebitda_margin: { label: "EBITDA Margin", type: "percent", min: 0, max: 0.7, step: 0.005 },
  da_percent_revenue: { label: "D&A % of Revenue", type: "percent", min: 0, max: 0.2, step: 0.0025 },
  capex_percent_revenue: { label: "CapEx % of Revenue", type: "percent", min: 0, max: 0.25, step: 0.0025 },
  nwc_percent_revenue: { label: "NWC % of Revenue", type: "percent", min: -0.2, max: 0.3, step: 0.0025 },
  tax_rate: { label: "Tax Rate", type: "percent", min: 0, max: 0.6, step: 0.0025 },
  wacc: { label: "WACC", type: "percent", min: 0.03, max: 0.2, step: 0.0025 },
  terminal_growth: { label: "Terminal Growth", type: "percent", min: -0.01, max: 0.05, step: 0.001 },
  net_debt: { label: "Net Debt", type: "currency" },
  diluted_shares_outstanding: { label: "Diluted Shares Outstanding", type: "number" },
};

export const SCENARIOS = ["Bear", "Base", "Bull"];

export function createScenarioStateFromValuation(payload) {
  const assumptions = payload?.assumptions_used;
  if (!assumptions) return null;

  const state = {
    projectionYears: assumptions.projection_years,
    seriesModes: {},
    seriesFlat: {},
    seriesValues: {},
    scalarValues: {
      wacc: assumptions.wacc,
      terminal_growth: assumptions.terminal_growth,
      net_debt: assumptions.net_debt,
      diluted_shares_outstanding: assumptions.diluted_shares_outstanding,
    },
  };

  for (const field of SERIES_FIELDS) {
    const values = Array.isArray(assumptions[field]) ? assumptions[field].map(Number) : [];
    state.seriesValues[field] = values;
    state.seriesModes[field] = allEqual(values) ? "flat" : "yearly";
    state.seriesFlat[field] = values[0] ?? 0;
  }

  return state;
}

export function cloneScenarioState(state) {
  return {
    projectionYears: state.projectionYears,
    seriesModes: { ...state.seriesModes },
    seriesFlat: { ...state.seriesFlat },
    seriesValues: Object.fromEntries(Object.entries(state.seriesValues).map(([key, values]) => [key, [...values]])),
    scalarValues: { ...state.scalarValues },
  };
}

export function adjustProjectionYears(state, projectionYears) {
  const next = cloneScenarioState(state);
  next.projectionYears = projectionYears;
  for (const field of SERIES_FIELDS) {
    next.seriesValues[field] = resizeSeries(next.seriesValues[field], projectionYears, next.seriesFlat[field]);
  }
  return next;
}

export function setSeriesMode(state, field, mode) {
  const next = cloneScenarioState(state);
  next.seriesModes[field] = mode;
  if (mode === "flat") {
    const flatValue = next.seriesValues[field][0] ?? next.seriesFlat[field] ?? 0;
    next.seriesFlat[field] = flatValue;
    next.seriesValues[field] = Array(next.projectionYears).fill(flatValue);
  } else {
    next.seriesValues[field] = resizeSeries(next.seriesValues[field], next.projectionYears, next.seriesFlat[field]);
  }
  return next;
}

export function setFlatSeriesValue(state, field, value) {
  const next = cloneScenarioState(state);
  next.seriesFlat[field] = value;
  next.seriesValues[field] = Array(next.projectionYears).fill(value);
  return next;
}

export function setYearSeriesValue(state, field, yearIndex, value) {
  const next = cloneScenarioState(state);
  const updated = [...next.seriesValues[field]];
  updated[yearIndex] = value;
  next.seriesValues[field] = updated;
  if (allEqual(updated)) {
    next.seriesFlat[field] = updated[0];
  }
  return next;
}

export function setScalarValue(state, field, value) {
  const next = cloneScenarioState(state);
  next.scalarValues[field] = value;
  return next;
}

export function buildValuationPayload(state) {
  const assumptions = {};
  for (const field of SERIES_FIELDS) {
    assumptions[field] = state.seriesModes[field] === "flat"
      ? state.seriesFlat[field]
      : state.seriesValues[field].slice(0, state.projectionYears);
  }
  assumptions.wacc = state.scalarValues.wacc;
  assumptions.terminal_growth = state.scalarValues.terminal_growth;
  assumptions.net_debt = state.scalarValues.net_debt;
  assumptions.diluted_shares_outstanding = state.scalarValues.diluted_shares_outstanding;

  return {
    projection_years: state.projectionYears,
    assumptions,
  };
}

export function validateScenarioState(state) {
  const errors = [];
  if (!Number.isInteger(state.projectionYears) || state.projectionYears < 1 || state.projectionYears > 10) {
    errors.push("Projection years must be between 1 and 10.");
  }

  for (const field of SERIES_FIELDS) {
    if (state.seriesModes[field] === "flat") {
      if (!Number.isFinite(Number(state.seriesFlat[field]))) {
        errors.push(`${FIELD_META[field].label} must be numeric.`);
      }
      continue;
    }

    const values = state.seriesValues[field] || [];
    if (values.length !== state.projectionYears) {
      errors.push(`${FIELD_META[field].label} must have exactly ${state.projectionYears} yearly values.`);
      continue;
    }
    if (values.some((value) => !Number.isFinite(Number(value)))) {
      errors.push(`${FIELD_META[field].label} contains a non-numeric yearly value.`);
    }
  }

  if (!Number.isFinite(Number(state.scalarValues.wacc))) errors.push("WACC must be numeric.");
  if (!Number.isFinite(Number(state.scalarValues.terminal_growth))) errors.push("Terminal growth must be numeric.");
  if (!Number.isFinite(Number(state.scalarValues.net_debt))) errors.push("Net debt must be numeric.");
  if (!Number.isFinite(Number(state.scalarValues.diluted_shares_outstanding)) || Number(state.scalarValues.diluted_shares_outstanding) <= 0) {
    errors.push("Diluted shares outstanding must be greater than zero.");
  }
  if (Number(state.scalarValues.wacc) <= Number(state.scalarValues.terminal_growth)) {
    errors.push("WACC must be greater than terminal growth.");
  }
  return errors;
}

export function formatAssumptionSource(value) {
  if (value === "custom input") return "Custom";
  if (value === "historical default") return "History";
  if (value === "fallback default") return "Fallback";
  return value || "Unknown";
}

function resizeSeries(values, projectionYears, fallback = 0) {
  const next = [...(values || [])].map(Number);
  if (!next.length) next.push(Number(fallback || 0));
  while (next.length < projectionYears) {
    next.push(next[next.length - 1]);
  }
  return next.slice(0, projectionYears);
}

function allEqual(values) {
  if (!values?.length) return true;
  return values.every((value) => Number(value) === Number(values[0]));
}
