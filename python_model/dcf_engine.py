from __future__ import annotations

from dataclasses import asdict

import pandas as pd

from python_model.checks import build_diagnostics, ensure_valid
from python_model.data_api import ModelInputs
from python_model.formulas import (
    after_tax_cost_of_debt,
    capex_from_revenue,
    cost_of_equity,
    depreciation_from_revenue,
    discount_factor,
    ebit_from_ebitda,
    ebitda_from_revenue,
    enterprise_value,
    equity_value,
    fcff,
    implied_share_price,
    nwc_balance_from_revenue,
    revenue_next,
    taxes_from_ebit,
    terminal_value_year_n,
    weighted_average_cost_of_capital,
)


def run_valuation(inputs: ModelInputs) -> dict:
    """Run the full DCF forecast, discounting, bridge, and summary output."""
    blended_tax_rate = (
        sum(year.tax_rate for year in inputs.forecast_years) / len(inputs.forecast_years)
        if inputs.forecast_years
        else inputs.market.tax_rate
    )
    cost_of_debt_after_tax = after_tax_cost_of_debt(inputs.market.cost_of_debt, blended_tax_rate)
    cost_of_equity_value = cost_of_equity(inputs.market.risk_free_rate, inputs.market.beta, inputs.market.market_return)
    computed_wacc = (
        float(inputs.market.wacc_override)
        if inputs.market.wacc_override is not None
        else weighted_average_cost_of_capital(
            cost_of_debt_after_tax,
            cost_of_equity_value,
            inputs.market.debt_value,
            inputs.market.equity_value,
        )
    )
    ensure_valid(inputs, computed_wacc)

    rows = []
    prior_revenue = inputs.company.revenue_base
    prior_nwc = inputs.company.base_nwc

    for assumption in inputs.forecast_years:
        revenue = revenue_next(prior_revenue, assumption.revenue_growth)
        ebitda = ebitda_from_revenue(revenue, assumption.ebitda_margin)
        depreciation = depreciation_from_revenue(revenue, assumption.depreciation_rate)
        ebit = ebit_from_ebitda(ebitda, depreciation)
        taxes = taxes_from_ebit(ebit, assumption.tax_rate)
        nopat = ebit - taxes
        nwc = nwc_balance_from_revenue(revenue, assumption.nwc_rate)
        delta_nwc = nwc - prior_nwc
        capex = capex_from_revenue(revenue, assumption.capex_rate)
        free_cash_flow = fcff(ebit, taxes, depreciation, delta_nwc, capex)
        df = discount_factor(computed_wacc, assumption.year)
        pv_fcff = free_cash_flow * df
        rows.append(
            {
                "Year": assumption.year,
                "Revenue Growth": assumption.revenue_growth,
                "Revenue": revenue,
                "EBITDA Margin": assumption.ebitda_margin,
                "EBITDA": ebitda,
                "Depreciation Rate": assumption.depreciation_rate,
                "Depreciation": depreciation,
                "EBIT": ebit,
                "Tax Rate": assumption.tax_rate,
                "Taxes": taxes,
                "NOPAT": nopat,
                "NWC Rate": assumption.nwc_rate,
                "NWC": nwc,
                "Delta NWC": delta_nwc,
                "Capex Rate": assumption.capex_rate,
                "Capex": capex,
                "FCFF": free_cash_flow,
                "Discount Factor": df,
                "PV of FCFF": pv_fcff,
            }
        )
        prior_revenue = revenue
        prior_nwc = nwc

    forecast_df = pd.DataFrame(rows)
    terminal_value = terminal_value_year_n(float(forecast_df["FCFF"].iloc[-1]), computed_wacc, inputs.terminal_growth_rate)
    terminal_pv = terminal_value * discount_factor(computed_wacc, len(inputs.forecast_years))
    pv_forecast = float(forecast_df["PV of FCFF"].sum())
    enterprise_value_value = enterprise_value(pv_forecast, terminal_pv)
    equity_value_value = equity_value(
        enterprise_value_value,
        inputs.company.surplus_assets,
        inputs.company.minorities,
        inputs.company.net_financial_position,
    )
    share_price = implied_share_price(equity_value_value, inputs.company.diluted_shares)
    upside_downside = (share_price / inputs.company.current_price) - 1 if inputs.company.current_price > 0 else 0.0

    bridge_df = pd.DataFrame(
        [
            {"Metric": "PV of Forecast FCFF", "Value": pv_forecast},
            {"Metric": "PV of Terminal Value", "Value": terminal_pv},
            {"Metric": "Enterprise Value", "Value": enterprise_value_value},
            {"Metric": "Plus: Surplus Assets", "Value": inputs.company.surplus_assets},
            {"Metric": "Less: Minorities", "Value": -inputs.company.minorities},
            {"Metric": "Less: Net Financial Position", "Value": -inputs.company.net_financial_position},
            {"Metric": "Equity Value", "Value": equity_value_value},
            {"Metric": "Implied Share Price", "Value": share_price},
        ]
    )

    sensitivity_df = build_sensitivity_table(inputs, computed_wacc)
    summary = {
        "ticker": inputs.company.ticker,
        "company_name": inputs.company.company_name,
        "current_price": inputs.company.current_price,
        "computed_wacc": computed_wacc,
        "cost_of_equity": cost_of_equity_value,
        "cost_of_debt_after_tax": cost_of_debt_after_tax,
        "blended_tax_rate": blended_tax_rate,
        "terminal_growth_rate": inputs.terminal_growth_rate,
        "enterprise_value": enterprise_value_value,
        "equity_value": equity_value_value,
        "implied_share_price": share_price,
        "terminal_value": terminal_value,
        "terminal_value_pv": terminal_pv,
        "terminal_value_weight": terminal_pv / enterprise_value_value if enterprise_value_value else 0.0,
        "upside_downside": upside_downside,
        "forecast_year_count": len(inputs.forecast_years),
    }
    diagnostics = build_diagnostics(summary, forecast_df)

    return {
        "inputs": asdict(inputs),
        "forecast_df": forecast_df,
        "bridge_df": bridge_df,
        "sensitivity_df": sensitivity_df,
        "summary": summary,
        "diagnostics": diagnostics,
    }


def build_sensitivity_table(inputs: ModelInputs, base_wacc: float) -> pd.DataFrame:
    """Build the standard WACC / terminal-growth implied share price grid."""
    wacc_values = [base_wacc - 0.01, base_wacc - 0.005, base_wacc, base_wacc + 0.005, base_wacc + 0.01]
    growth_values = [inputs.terminal_growth_rate - 0.01, inputs.terminal_growth_rate - 0.005, inputs.terminal_growth_rate, inputs.terminal_growth_rate + 0.005, inputs.terminal_growth_rate + 0.01]
    forecast_rows = []
    base_rows = []
    prior_revenue = inputs.company.revenue_base
    prior_nwc = inputs.company.base_nwc
    for assumption in inputs.forecast_years:
        revenue = revenue_next(prior_revenue, assumption.revenue_growth)
        ebitda = ebitda_from_revenue(revenue, assumption.ebitda_margin)
        depreciation = depreciation_from_revenue(revenue, assumption.depreciation_rate)
        ebit = ebit_from_ebitda(ebitda, depreciation)
        taxes = taxes_from_ebit(ebit, assumption.tax_rate)
        nwc = nwc_balance_from_revenue(revenue, assumption.nwc_rate)
        delta_nwc = nwc - prior_nwc
        capex = capex_from_revenue(revenue, assumption.capex_rate)
        base_rows.append(fcff(ebit, taxes, depreciation, delta_nwc, capex))
        prior_revenue = revenue
        prior_nwc = nwc
    for growth in growth_values:
        row = {"Terminal Growth": growth}
        for wacc in wacc_values:
            key = f"WACC {wacc:.1%}"
            if wacc <= growth or wacc <= 0:
                row[key] = None
                continue
            pv_forecast = sum(value * discount_factor(wacc, idx + 1) for idx, value in enumerate(base_rows))
            tv = terminal_value_year_n(base_rows[-1], wacc, growth)
            tv_pv = tv * discount_factor(wacc, len(base_rows))
            ev = enterprise_value(pv_forecast, tv_pv)
            eq = equity_value(ev, inputs.company.surplus_assets, inputs.company.minorities, inputs.company.net_financial_position)
            row[key] = implied_share_price(eq, inputs.company.diluted_shares)
        forecast_rows.append(row)
    return pd.DataFrame(forecast_rows)
