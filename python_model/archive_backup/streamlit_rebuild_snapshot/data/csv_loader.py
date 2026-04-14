from __future__ import annotations

from io import StringIO
from typing import Optional, Tuple

import pandas as pd

from data.models import CompanyInputs, ScenarioConfig, YearAssumption


COMPANY_REQUIRED_COLUMNS = {
    "ticker",
    "company_name",
    "current_price",
    "revenue_base",
    "base_nwc",
    "net_debt",
    "non_operating_assets",
    "diluted_shares_outstanding",
}

SCENARIO_REQUIRED_COLUMNS = {
    "year",
    "revenue_growth",
    "ebitda_margin",
    "da_percent",
    "capex_percent",
    "nwc_percent",
    "tax_rate",
}


def load_company_csv(file_bytes: bytes) -> Tuple[Optional[CompanyInputs], Optional[str]]:
    try:
        df = pd.read_csv(StringIO(file_bytes.decode("utf-8")))
    except Exception as exc:
        return None, f"Could not read company CSV: {exc}"

    if df.empty:
        return None, "Company CSV is empty."

    missing = COMPANY_REQUIRED_COLUMNS.difference(df.columns)
    if missing:
        return None, f"Company CSV is missing columns: {', '.join(sorted(missing))}"

    row = df.iloc[0]
    return (
        CompanyInputs(
            ticker=str(row["ticker"]),
            company_name=str(row["company_name"]),
            current_price=float(row["current_price"]),
            revenue_base=float(row["revenue_base"]),
            base_nwc=float(row["base_nwc"]),
            net_debt=float(row["net_debt"]),
            non_operating_assets=float(row["non_operating_assets"]),
            diluted_shares_outstanding=float(row["diluted_shares_outstanding"]),
        ),
        None,
    )


def load_scenario_csv(file_bytes: bytes, name: str, wacc: float, terminal_growth: float) -> Tuple[Optional[ScenarioConfig], Optional[str]]:
    try:
        df = pd.read_csv(StringIO(file_bytes.decode("utf-8")))
    except Exception as exc:
        return None, f"Could not read scenario CSV: {exc}"

    if df.empty:
        return None, "Scenario CSV is empty."

    missing = SCENARIO_REQUIRED_COLUMNS.difference(df.columns)
    if missing:
        return None, f"Scenario CSV is missing columns: {', '.join(sorted(missing))}"

    assumptions = [
        YearAssumption(
            year=int(row["year"]),
            revenue_growth=float(row["revenue_growth"]),
            ebitda_margin=float(row["ebitda_margin"]),
            da_percent=float(row["da_percent"]),
            capex_percent=float(row["capex_percent"]),
            nwc_percent=float(row["nwc_percent"]),
            tax_rate=float(row["tax_rate"]),
        )
        for _, row in df.sort_values("year").iterrows()
    ]
    return ScenarioConfig(name=name, wacc=wacc, terminal_growth=terminal_growth, assumptions=assumptions), None
