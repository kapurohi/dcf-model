from __future__ import annotations

from data.models import CompanyInputs, DiagnosticsReport, ScenarioConfig
from utils.validation import validate_company_inputs, validate_scenario_config


def build_diagnostics(company: CompanyInputs, scenario: ScenarioConfig, forecast_df, terminal_value_weight: float) -> DiagnosticsReport:
    errors = validate_company_inputs(company) + validate_scenario_config(scenario)
    warnings: list[str] = []
    notes: list[str] = []

    if not forecast_df.empty:
        terminal_ufcf = float(forecast_df["UFCF"].iloc[-1])
        first_margin = float(forecast_df["EBITDA Margin"].iloc[0])
        last_margin = float(forecast_df["EBITDA Margin"].iloc[-1])

        if terminal_ufcf <= 0:
            warnings.append("Terminal-year UFCF is non-positive, which weakens the reliability of the perpetuity valuation.")
        if terminal_value_weight > 0.80:
            warnings.append("Terminal value exceeds 80% of enterprise value, so the valuation is highly assumption-sensitive.")
        if last_margin - first_margin > 0.10:
            warnings.append("EBITDA margin expansion exceeds 1,000 bps across the forecast and may be too aggressive.")
        if scenario.wacc - scenario.terminal_growth < 0.015:
            warnings.append("WACC is very close to terminal growth, which can overstate terminal value materially.")

        notes.append(f"Forecast spans {len(forecast_df)} years using the {scenario.name} case.")

    return DiagnosticsReport(errors=errors, warnings=warnings, notes=notes)
