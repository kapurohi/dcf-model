from __future__ import annotations

from dataclasses import replace

import pandas as pd

from core.diagnostics import build_diagnostics
from core.forecast import build_forecast
from core.scenarios import build_scenario_library
from data.models import CompanyInputs, ScenarioConfig, ValuationResult
from utils.validation import validate_company_inputs, validate_scenario_config


def calculate_discount_factors(years: int, wacc: float) -> list[float]:
    return [1 / ((1 + wacc) ** year) for year in range(1, years + 1)]


def calculate_terminal_value(terminal_ufcf: float, wacc: float, terminal_growth: float) -> float:
    return (terminal_ufcf * (1 + terminal_growth)) / (wacc - terminal_growth)


def run_dcf(company: CompanyInputs, scenario: ScenarioConfig) -> ValuationResult:
    errors = validate_company_inputs(company) + validate_scenario_config(scenario)
    if errors:
        raise ValueError(" ; ".join(errors))

    forecast_df = build_forecast(company, scenario)
    discount_factors = calculate_discount_factors(len(forecast_df), scenario.wacc)

    forecast_df = forecast_df.copy()
    forecast_df["Discount Factor"] = discount_factors
    forecast_df["PV of UFCF"] = forecast_df["UFCF"] * forecast_df["Discount Factor"]

    terminal_value = calculate_terminal_value(float(forecast_df["UFCF"].iloc[-1]), scenario.wacc, scenario.terminal_growth)
    terminal_value_pv = terminal_value * discount_factors[-1]
    present_value_of_forecast = float(forecast_df["PV of UFCF"].sum())
    enterprise_value = present_value_of_forecast + terminal_value_pv
    equity_value = enterprise_value - company.net_debt + company.non_operating_assets
    implied_share_price = equity_value / company.diluted_shares_outstanding if company.diluted_shares_outstanding > 0 else None
    terminal_value_weight = terminal_value_pv / enterprise_value if enterprise_value else 0.0

    valuation_bridge_df = pd.DataFrame(
        [
            {"Metric": "PV of Forecast UFCF", "Value": present_value_of_forecast},
            {"Metric": "PV of Terminal Value", "Value": terminal_value_pv},
            {"Metric": "Enterprise Value", "Value": enterprise_value},
            {"Metric": "Less: Net Debt", "Value": -company.net_debt},
            {"Metric": "Plus: Non-operating Assets", "Value": company.non_operating_assets},
            {"Metric": "Equity Value", "Value": equity_value},
            {"Metric": "Diluted Shares Outstanding", "Value": company.diluted_shares_outstanding},
            {"Metric": "Implied Share Price", "Value": implied_share_price or 0.0},
        ]
    )

    diagnostics = build_diagnostics(company, scenario, forecast_df, terminal_value_weight)
    sensitivity_table = build_sensitivity_table(company, scenario)
    scenario_summary = build_scenario_summary(company, scenario)

    metadata = {
        "wacc": scenario.wacc,
        "terminal_growth": scenario.terminal_growth,
        "market_cap": company.current_price * company.diluted_shares_outstanding,
        "upside_downside": ((implied_share_price / company.current_price) - 1) if company.current_price > 0 and implied_share_price is not None else 0.0,
        "terminal_ebitda_multiple": terminal_value / float(forecast_df["EBITDA"].iloc[-1]) if float(forecast_df["EBITDA"].iloc[-1]) else 0.0,
    }

    return ValuationResult(
        forecast_df=forecast_df,
        valuation_bridge_df=valuation_bridge_df,
        enterprise_value=enterprise_value,
        equity_value=equity_value,
        implied_share_price=implied_share_price,
        terminal_value=terminal_value,
        terminal_value_pv=terminal_value_pv,
        present_value_of_forecast=present_value_of_forecast,
        discount_factors=discount_factors,
        terminal_value_weight=terminal_value_weight,
        diagnostics=diagnostics,
        sensitivity_table=sensitivity_table,
        scenario_summary=scenario_summary,
        metadata=metadata,
    )


def build_sensitivity_table(company: CompanyInputs, scenario: ScenarioConfig) -> pd.DataFrame:
    wacc_values = [scenario.wacc - 0.01, scenario.wacc - 0.005, scenario.wacc, scenario.wacc + 0.005, scenario.wacc + 0.01]
    growth_values = [scenario.terminal_growth - 0.01, scenario.terminal_growth - 0.005, scenario.terminal_growth, scenario.terminal_growth + 0.005, scenario.terminal_growth + 0.01]

    rows = []
    for growth in growth_values:
        row = {"Terminal Growth": growth}
        for wacc in wacc_values:
            key = f"WACC {wacc:.1%}"
            if wacc <= growth or wacc <= 0:
                row[key] = None
                continue
            custom = replace(scenario, wacc=wacc, terminal_growth=growth)
            row[key] = run_dcf_core(company, custom)
        rows.append(row)
    return pd.DataFrame(rows)


def build_scenario_summary(company: CompanyInputs, active_scenario: ScenarioConfig) -> pd.DataFrame:
    rows = []
    library = build_scenario_library(len(active_scenario.assumptions))
    library[active_scenario.name] = active_scenario
    for name, scenario in library.items():
        result = run_dcf_core(company, scenario)
        rows.append(
            {
                "Scenario": name,
                "WACC": scenario.wacc,
                "Terminal Growth": scenario.terminal_growth,
                "Enterprise Value": result["enterprise_value"],
                "Equity Value": result["equity_value"],
                "Implied Share Price": result["implied_share_price"],
            }
        )
    return pd.DataFrame(rows)


def run_dcf_core(company: CompanyInputs, scenario: ScenarioConfig) -> dict[str, float]:
    forecast_df = build_forecast(company, scenario)
    discount_factors = calculate_discount_factors(len(forecast_df), scenario.wacc)
    pv_forecast = float((forecast_df["UFCF"] * pd.Series(discount_factors)).sum())
    terminal_value = calculate_terminal_value(float(forecast_df["UFCF"].iloc[-1]), scenario.wacc, scenario.terminal_growth)
    terminal_value_pv = terminal_value * discount_factors[-1]
    enterprise_value = pv_forecast + terminal_value_pv
    equity_value = enterprise_value - company.net_debt + company.non_operating_assets
    implied_share_price = equity_value / company.diluted_shares_outstanding if company.diluted_shares_outstanding > 0 else 0.0
    return {
        "enterprise_value": enterprise_value,
        "equity_value": equity_value,
        "implied_share_price": implied_share_price,
    }
