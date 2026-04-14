from __future__ import annotations

from typing import List

from python_model.data_api import ModelInputs


class BlockingModelError(ValueError):
    pass


def validate_inputs(inputs: ModelInputs) -> List[str]:
    """Run blocking validation checks before valuation starts."""
    errors: List[str] = []
    if inputs.company.revenue_base <= 0:
        errors.append("Base revenue must be greater than zero.")
    if inputs.company.diluted_shares <= 0:
        errors.append("Diluted shares must be greater than zero.")
    if inputs.market.wacc_override is None and inputs.market.market_return <= inputs.market.risk_free_rate:
        errors.append("Market return must be greater than the risk-free rate for CAPM.")
    if inputs.terminal_growth_rate >= 0.06:
        errors.append("Terminal growth is too high for a professional steady-state DCF.")
    for year in inputs.forecast_years:
        if year.ebitda_margin < year.depreciation_rate:
            errors.append(f"Year {year.year}: EBITDA margin must exceed depreciation rate to keep EBIT meaningful.")
        if year.nwc_rate < -0.50:
            errors.append(f"Year {year.year}: NWC rate is implausibly low.")
        if year.tax_rate < 0 or year.tax_rate >= 1:
            errors.append(f"Year {year.year}: Tax rate must be between 0% and 100%.")
    return errors


def ensure_valid(inputs: ModelInputs, computed_wacc: float) -> None:
    """Raise a single blocking error when one or more model checks fail."""
    errors = validate_inputs(inputs)
    if computed_wacc <= inputs.terminal_growth_rate:
        errors.append("Computed WACC must be greater than terminal growth.")
    if errors:
        raise BlockingModelError(" | ".join(errors))


def build_diagnostics(summary: dict, forecast_df) -> List[str]:
    """Generate non-blocking warnings that help interpret model fragility."""
    diagnostics: List[str] = []
    if summary["terminal_value_weight"] > 0.80:
        diagnostics.append("Terminal value exceeds 80% of enterprise value; valuation is highly assumption-sensitive.")
    if float(forecast_df["FCFF"].iloc[-1]) <= 0:
        diagnostics.append("Terminal-year FCFF is non-positive, which weakens the perpetuity approach.")
    if float(forecast_df["Revenue Growth"].iloc[-1]) > 0.05 and summary["terminal_growth_rate"] < 0.03:
        diagnostics.append("Forecast growth remains elevated relative to terminal growth; review convergence assumptions.")
    if summary["upside_downside"] > 0.50:
        diagnostics.append("Implied upside exceeds 50%; review whether assumptions are too optimistic.")
    return diagnostics
