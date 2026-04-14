# PE Module 4 Formula Summary

Source: `/Users/kavishapurohit/Desktop/Private Equity Course/PE_Module_4.pdf`

This summary separates:
- `Explicit formulas from the deck`: formulas shown directly in the PDF.
- `Worked-example formulas`: formulas implied by the examples later in the deck.

## Explicit formulas from the deck

### 1. Equity value from DCF
Pages: 8, 12, 35

\[
\text{Equity Value} = \sum_{t=1}^{n} \frac{CF_t}{(1 + WACC)^t} + TV_n + (SA - M - NFP)
\]

Where:
- `CF_t`: forecast free cash flow in year `t`
- `TV_n`: terminal value term as defined by the deck
- `SA`: surplus assets
- `M`: minorities
- `NFP`: net financial position

## 2. Income statement bridge
Page: 14

\[
EBITDA = Sales + Other\ Operating\ Revenues - Operating\ Costs
\]

\[
EBIT = EBITDA - Depreciation
\]

\[
EBT = EBIT + Other\ Income - Interest\ Expenses
\]

\[
Net\ Income = EBT - Income\ Taxes
\]

## 3. Free cash flow for the firm
Page: 15

\[
CF = EBIT - Income\ Taxes + Depreciation - Increase\ in\ Net\ Working\ Capital - CAPEX
\]

This is the deck's unlevered free cash flow expression.

## 4. After-tax cost of debt
Page: 17

\[
id^* = id(1 - t)
\]

Where:
- `id`: pre-tax cost of debt
- `t`: corporate tax rate

## 5. CAPM cost of equity
Page: 18

\[
ie = r_f + \beta (r_m - r_f)
\]

Where:
- `r_f`: risk-free rate
- `r_m - r_f`: market risk premium
- `\beta`: equity beta

## 6. Unlevered beta
Page: 20

\[
\beta_u = \frac{\beta}{1 + (1 - t)(D/E)}
\]

## 7. Relevered beta
Page: 20

\[
\beta^* = \beta_u \times [1 + (1 - t)(D/E)^*]
\]

The deck uses `*` for target-company capital structure inputs.

## 8. WACC
Pages: 21, 30, 32

\[
WACC = id^* \times \frac{D}{D + E} + ie \times \frac{E}{D + E}
\]

## 9. Terminal value term used in the deck
Pages: 22, 33

The deck shows:

\[
TV_n = \frac{CF_n \times (1 + g)}{(WACC - g)(1 + WACC)^n}
\]

Important note:
- In standard finance notation, terminal value at time `n` is usually:

\[
TV_{time\ n} = \frac{CF_n \times (1 + g)}{WACC - g}
\]

- The deck's displayed formula includes the extra `/(1 + WACC)^n`, so the term shown is effectively the present value of terminal value, not just the terminal value at year `n`.

## Worked-example formulas from later pages

These are not always written as generic textbook equations in the deck, but they are clearly used in the worked examples.

## 10. Exit enterprise value using an EBITDA multiple
Pages: 40-42

Derived from the example:

\[
EV_{exit} = EBITDA_{exit} \times Exit\ Multiple
\]

## 11. Exit equity value
Page: 42

\[
Equity\ Value_{exit} = EV_{exit} - NFP_{exit}
\]

## 12. Future value of investment from target IRR
Page: 48

\[
Future\ Value\ of\ Investment = Investment\ Value \times (1 + Expected\ IRR)^n
\]

## 13. VC terminal value using P/E
Page: 49

\[
TV = Net\ Income_N \times P/E\ Ratio
\]

## 14. PE ownership required in VC method
Page: 50

\[
\%\ PE\ Shares = \frac{Future\ Value\ of\ Investment}{TV}
\]

## 15. Number of new shares to issue
Pages: 51-52

\[
Number\ of\ New\ Shares = \frac{Existing\ Shares \times \%\ Shares}{1 - \%\ Shares}
\]

## 16. Price per new share
Page: 52

\[
Price\ of\ New\ Shares = \frac{Value\ of\ Investment}{Number\ of\ New\ Shares}
\]

## Practical implications for the DCF rebuild

For the next rebuild, the DCF engine should at minimum implement:
- operating bridge: `Revenue -> EBITDA -> EBIT`
- free cash flow bridge: `EBIT - taxes + D&A - ΔNWC - Capex`
- discounting: yearly PV factors using `WACC`
- terminal value: use standard terminal value plus separate present-value discounting
- equity bridge: `Enterprise Value + Surplus Assets - Minorities - NFP`

## Lean architecture recommendation

For the next full rebuild, keep the codebase lean. A practical target is 6 main files:

1. `app.py`
   Streamlit entrypoint and layout only.
2. `formulas.py`
   Canonical valuation formulas and formula metadata.
3. `data_api.py`
   API fetchers, normalization, and manual overrides.
4. `dcf_engine.py`
   Forecast schedules, DCF math, terminal value, EV/equity bridge.
5. `display.py`
   Tables, charts, KPI cards, and formatting.
6. `checks.py`
   Validation, guardrails, diagnostics, and sensitivity helpers.

Optional seventh file only if needed:
- `inputs.py` for scenario presets or CSV import templates.

That is enough separation to stay professional without turning the project into folder sprawl.
