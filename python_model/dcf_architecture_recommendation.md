# Rebuild Architecture Recommendation

The current folder is over-separated for the stage you are in. For the next complete rebuild, keep it lean and deliberate.

## Recommended target structure

- `app.py`
  Streamlit app entrypoint and page layout only.
- `formulas.py`
  Canonical formulas, formula metadata, and mapping between finance notation and code notation.
- `data_api.py`
  API retrieval, normalization, fallback handling, and manual override helpers.
- `dcf_engine.py`
  Historical cleanup, forecast generation, DCF, terminal value, EV bridge, equity bridge, and sensitivity math.
- `display.py`
  KPI cards, tables, charts, formatting, and page sections.
- `checks.py`
  Validation rules, diagnostics, guardrails, and assumption sanity checks.

## Optional file

- `inputs.py`
  Add this only if scenario presets or CSV parsing starts cluttering `data_api.py`.

## Why this is the right size

- Fewer files means faster iteration while the model logic is still being stabilized.
- The financial logic stays easy to trace.
- API handling is separated from valuation math.
- Display concerns stay out of the engine.
- Validation remains explicit and testable.

## What to avoid in the next rebuild

- Multiple nested folders for tiny modules.
- Splitting one valuation flow across too many files.
- Mixing raw API responses directly into valuation formulas.
- Hiding formulas inside UI code.

## Rebuild order

1. Lock formulas in `formulas.py`
2. Build data normalization in `data_api.py`
3. Build valuation logic in `dcf_engine.py`
4. Add checks in `checks.py`
5. Build the dashboard in `app.py` and `display.py`

This is the structure I recommend using for the real rebuild.
