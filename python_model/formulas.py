"""Canonical DCF formulas grounded in PE Module 4 and normalized for implementation.

Primary source:
/Users/kavishapurohit/Desktop/Private Equity Course/PE_Module_4.pdf

Notes:
- The PDF shows terminal value with discounting embedded. This module separates
  terminal value at year n from present value discounting because that is easier
  to compute, audit, and display.
"""

from __future__ import annotations

FORMULA_NOTES = {
    "equity_value_pdf": "Equity Value = sum(PV of CF_t) + TV_n + (SA - M - NFP)",
    "fcff_pdf": "CF = EBIT - Taxes + Depreciation - Increase in NWC - CAPEX",
    "cost_of_debt_pdf": "id* = id * (1 - t)",
    "cost_of_equity_pdf": "ie = rf + beta * (rm - rf)",
    "beta_unlever_pdf": "beta_u = beta / (1 + (1 - t) * (D/E))",
    "beta_relever_pdf": "beta* = beta_u * (1 + (1 - t) * (D/E)*)",
    "wacc_pdf": "WACC = id* * (D / (D + E)) + ie * (E / (D + E))",
    "terminal_value_pdf": "PDF embeds discounting inside terminal value term; app separates them.",
}


def revenue_next(revenue_prior: float, growth_rate: float) -> float:
    """Project next-period revenue."""
    return revenue_prior * (1 + growth_rate)


def ebitda_from_revenue(revenue: float, ebitda_margin: float) -> float:
    """Convert revenue into EBITDA via the chosen margin."""
    return revenue * ebitda_margin


def depreciation_from_revenue(revenue: float, depreciation_rate: float) -> float:
    """Model D&A as a percent of revenue."""
    return revenue * depreciation_rate


def ebit_from_ebitda(ebitda: float, depreciation: float) -> float:
    return ebitda - depreciation


def taxes_from_ebit(ebit: float, tax_rate: float) -> float:
    return ebit * tax_rate


def nwc_balance_from_revenue(revenue: float, nwc_rate: float) -> float:
    return revenue * nwc_rate


def capex_from_revenue(revenue: float, capex_rate: float) -> float:
    return revenue * capex_rate


def fcff(ebit: float, taxes: float, depreciation: float, delta_nwc: float, capex: float) -> float:
    """Compute unlevered free cash flow to the firm."""
    return ebit - taxes + depreciation - delta_nwc - capex


def after_tax_cost_of_debt(cost_of_debt: float, tax_rate: float) -> float:
    return cost_of_debt * (1 - tax_rate)


def cost_of_equity(risk_free_rate: float, beta: float, market_return: float) -> float:
    return risk_free_rate + beta * (market_return - risk_free_rate)


def unlever_beta(beta: float, tax_rate: float, debt_to_equity: float) -> float:
    return beta / (1 + (1 - tax_rate) * debt_to_equity)


def relever_beta(beta_unlevered: float, tax_rate: float, target_debt_to_equity: float) -> float:
    return beta_unlevered * (1 + (1 - tax_rate) * target_debt_to_equity)


def weighted_average_cost_of_capital(cost_of_debt_after_tax: float, cost_of_equity_value: float, debt_value: float, equity_value: float) -> float:
    """Blend debt and equity costs into the discount rate used for valuation."""
    capital_base = debt_value + equity_value
    if capital_base <= 0:
        raise ValueError("Debt plus equity must be greater than zero to compute WACC.")
    return cost_of_debt_after_tax * (debt_value / capital_base) + cost_of_equity_value * (equity_value / capital_base)


def discount_factor(rate: float, year: int) -> float:
    return 1 / ((1 + rate) ** year)


def terminal_value_year_n(cash_flow_n: float, wacc: float, growth_rate: float) -> float:
    if wacc <= growth_rate:
        raise ValueError("WACC must be greater than terminal growth.")
    return cash_flow_n * (1 + growth_rate) / (wacc - growth_rate)


def enterprise_value(pv_of_forecast_cash_flows: float, pv_of_terminal_value: float) -> float:
    return pv_of_forecast_cash_flows + pv_of_terminal_value


def equity_value(enterprise_value_value: float, surplus_assets: float, minorities: float, net_financial_position: float) -> float:
    return enterprise_value_value + surplus_assets - minorities - net_financial_position


def implied_share_price(equity_value_value: float, diluted_shares: float) -> float:
    if diluted_shares <= 0:
        raise ValueError("Diluted shares must be greater than zero.")
    return equity_value_value / diluted_shares
