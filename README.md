# DCF Model

This repository contains a Discounted Cash Flow (DCF) valuation model, implemented as a shared Python valuation engine and an interactive web application.

The project ensures that both the exploratory Jupyter notebook and the full-stack web application produce identical outputs by running on the same underlying DCF logic.

---

## Project Overview

The project is divided into two primary environments:

1. **Python Model (`python_model/`)**
   - The core valuation engine and financial logic.
   - Handles data fetching, fallback pricing, and canonical formulas.
   - Includes a Jupyter notebook for static walkthroughs and exploration.

2. **Interactive Site (`interactive_site/`)**
   - A full-stack web application for building and exploring DCF models interactively.
   - Built with a Next.js frontend and FastAPI backend.
   - Leverages the shared Python package from `python_model/` for all core math.

---

## What This Project Does

### 1. Python Valuation Engine

The `python_model/` directory houses the core logic. This is the best place to understand the model quickly without running the full web app.

- **`dcf_engine.py`** – Forecast building, discounting, and sensitivity analysis.
- **`data_api.py`** – Fetching and fallback logic for market data and fundamentals.
- **`dcf_model.ipynb`** – A GitHub-friendly notebook demonstrating the model's outputs.

Run the notebook setup:

```bash
python3 -m pip install -r python_model/requirements.txt
```

Then open `python_model/dcf_model.ipynb`.

### 2. Interactive Web Application

The `interactive_site/` directory contains the product side:

- **Frontend (`app/`, `components/`)** – Next.js UI components and valuation workspaces.
- **Backend (`backend/`)** – FastAPI backend that handles search, valuation orchestration, and market data fetching.

Run the application:

```bash
cd interactive_site
npm install
npm run dev
```

Access the frontend on `http://localhost:4000` and the backend on `http://127.0.0.1:8000`.

---

## Resiliency and Features

- **Robust Fallbacks**: The system gracefully handles missing market data using alternative exchange APIs (Yahoo, FMP), historical averages, or conservative defaults.
- **Native Currency Support**: Listings preserve and use their native currencies (e.g., USD, GBP, INR, JPY) throughout the valuation process.

---

## Notes

- Generated and temporary folders (`.next`, `__pycache__`, `node_modules`, `.ipynb_checkpoints`, etc.) are intentionally omitted and should not be committed.
- The repository is kept intentionally lean, focusing purely on the shared model, the notebook, and the interactive UI.
