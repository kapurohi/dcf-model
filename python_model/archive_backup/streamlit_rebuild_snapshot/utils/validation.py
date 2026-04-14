from __future__ import annotations

from typing import List

from data.models import CompanyInputs, ScenarioConfig


def validate_company_inputs(company: CompanyInputs) -> List[str]:
    errors: List[str] = []
    if company.revenue_base <= 0:
        errors.append("Base revenue must be greater than zero.")
    if company.diluted_shares_outstanding <= 0:
        errors.append("Diluted shares outstanding must be greater than zero.")
    return errors


def validate_scenario_config(scenario: ScenarioConfig) -> List[str]:
    errors: List[str] = []
    if scenario.wacc <= scenario.terminal_growth:
        errors.append("WACC must be greater than terminal growth.")
    if not scenario.assumptions:
        errors.append("At least one forecast year is required.")
    for year in scenario.assumptions:
        if year.tax_rate < 0 or year.tax_rate >= 1:
            errors.append(f"Tax rate for Year {year.year} must be between 0% and 100%.")
        if year.ebitda_margin < 0:
            errors.append(f"EBITDA margin for Year {year.year} cannot be negative.")
        if year.da_percent < 0:
            errors.append(f"D&A percent for Year {year.year} cannot be negative.")
    return errors
