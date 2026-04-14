# DCF Model

This repository now has two clean parts:

- `python_model/`  
  The shared Python valuation engine, formula references, requirements, and Jupyter notebook.
- `interactive_site/`  
  The interactive web app built with Next.js on the frontend and FastAPI on the backend.

Both parts use the same underlying DCF logic so the notebook and the site stay aligned.

## Repository Structure

```text
DCF Project/
├── python_model/
│   ├── data_api.py
│   ├── dcf_engine.py
│   ├── checks.py
│   ├── formulas.py
│   ├── dcf_formula_registry.py
│   ├── dcf_model.ipynb
│   ├── requirements.txt
│   └── reference docs...
├── interactive_site/
│   ├── app/
│   ├── backend/
│   ├── components/
│   ├── content/
│   ├── lib/
│   ├── package.json
│   └── jsconfig.json
├── .env
├── .gitignore
└── README.md
```

## What Lives In `python_model/`

This folder is the model-first side of the project.

- `data_api.py`  
  Shared model input structures, provider configuration, quote fetch helpers, and fallback pricing logic.
- `dcf_engine.py`  
  The main DCF workflow: forecast build, discounting, bridge, summary, and sensitivity.
- `checks.py`  
  Validation and diagnostics.
- `formulas.py`  
  Canonical formulas used by the engine.
- `dcf_model.ipynb`  
  A GitHub-friendly notebook that walks through the model outputs.

This is the best place to understand the model quickly without running the full web app.

## What Lives In `interactive_site/`

This folder is the product/UI side of the project.

- `app/`  
  Next.js app routes and styles.
- `backend/`  
  FastAPI routes and services.
- `components/`  
  UI and valuation workspace components.
- `lib/`  
  Frontend API calls, formatters, search helpers, and valuation helpers.

The interactive site uses the shared Python package from `python_model/`.

## How The Backend Works

1. Search begins in `interactive_site/backend/routes/search.py`
2. Search normalization and listing metadata live in `interactive_site/backend/services/search_service.py`
3. Valuation requests go through `interactive_site/backend/routes/valuation.py`
4. Valuation orchestration happens in `interactive_site/backend/services/valuation_service.py`
5. Market/fundamentals fetching happens in `interactive_site/backend/services/market_data_service.py`
6. Core DCF math is imported from `python_model/`

## Fallbacks We Built

The backend does not rely on a single fragile path.

- Exchange-aware ticker normalization
  - Example: `RELIANCE -> RELIANCE.NS`, `BHP -> BHP.AX`
- Quote fallback order
  - Yahoo quote
  - Yahoo chart/meta
  - Yahoo summary price
  - FMP quote
  - FMP historical EOD latest close
- Fundamentals fallback order
  - Yahoo summary fundamentals
  - FMP TTM statement endpoints
  - FMP non-TTM statement endpoints
  - conservative internal defaults when data is missing
- Assumption fallback order
  - custom user input
  - historical default
  - fallback default

## Native Currency Support

Listings now carry their own currency where applicable.

Examples:

- US: `USD`
- UK: `GBP`
- India: `INR`
- Hong Kong: `HKD`
- Japan: `JPY`
- Australia: `AUD`
- Singapore: `SGD`
- Germany / France: `EUR`

## Running The Notebook

From the repository root:

```bash
python3 -m pip install -r python_model/requirements.txt
```

Then open:

```text
python_model/dcf_model.ipynb
```

## Running The Interactive Site

From the interactive app folder:

```bash
cd interactive_site
npm install
npm run dev
```

That starts:

- frontend on `http://localhost:4000`
- backend on `http://127.0.0.1:8000`

## Notes

- Generated folders like `.next`, `__pycache__`, `.pytest_cache`, `node_modules`, and `.ipynb_checkpoints` are not source files and should not be committed.
- Formula/reference docs are intentionally kept because they will be useful for the notebook and the GitHub presentation.
