# Minimal DCF Backend Roadmap

## Compact Flow
Search company
-> fetch real company data
-> build base inputs
-> apply core assumptions
-> project FCFF
-> discount FCFF and terminal value
-> bridge EV to equity value
-> calculate implied share price
-> display forecast, bridge, and sensitivity

## Data We Need
From Yahoo / yfinance first, FMP fallback:
- current price
- shares outstanding
- TTM revenue
- cash
- total debt
- company name / ticker / exchange / currency

## Core Assumptions
User-tweakable minimum set:
- projection years
- revenue growth
- EBITDA margin
- depreciation percent of revenue
- CapEx percent of revenue
- NWC percent of revenue
- tax rate
- WACC
- terminal growth

## Core Formulas
1. Revenue_t = Revenue_(t-1) * (1 + growth_t)
2. EBITDA_t = Revenue_t * EBITDA margin_t
3. D&A_t = Revenue_t * D&A percent_t
4. EBIT_t = EBITDA_t - D&A_t
5. Taxes_t = EBIT_t * tax rate
6. NWC_t = Revenue_t * NWC percent_t
7. Delta NWC_t = NWC_t - NWC_(t-1)
8. CapEx_t = Revenue_t * CapEx percent_t
9. FCFF_t = EBIT_t - Taxes_t + D&A_t - Delta NWC_t - CapEx_t
10. PV(FCFF_t) = FCFF_t / (1 + WACC)^t
11. TV_n = FCFF_n * (1 + g) / (WACC - g)
12. EV = sum(PV of FCFF) + PV(TV)
13. Equity Value = EV - Net Debt
14. Implied Share Price = Equity Value / Diluted Shares

## How Parameters Change FCFF
- Higher revenue growth -> higher revenue -> usually higher FCFF
- Higher EBITDA margin -> higher EBIT -> higher FCFF
- Higher depreciation percent -> lower EBIT but adds back in cash flow
- Higher CapEx percent -> lower FCFF
- Higher NWC percent -> larger working capital investment -> lower FCFF
- Higher tax rate -> lower FCFF
- Higher WACC -> lower present value, not lower FCFF itself
- Higher terminal growth -> higher terminal value

## Implementation Order
1. Build normalized company-data fetcher
2. Build valuation endpoint
3. Return company, assumptions, forecast, bridge, summary, diagnostics
4. Replace placeholder frontend tables and chart with real outputs
