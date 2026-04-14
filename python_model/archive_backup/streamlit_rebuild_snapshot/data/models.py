from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional


SCENARIO_NAMES = ("Bear", "Base", "Bull")


@dataclass(frozen=True)
class CompanyInputs:
    ticker: str
    company_name: str
    current_price: float
    revenue_base: float
    base_nwc: float
    net_debt: float
    non_operating_assets: float
    diluted_shares_outstanding: float


@dataclass(frozen=True)
class YearAssumption:
    year: int
    revenue_growth: float
    ebitda_margin: float
    da_percent: float
    capex_percent: float
    nwc_percent: float
    tax_rate: float


@dataclass(frozen=True)
class ScenarioConfig:
    name: str
    wacc: float
    terminal_growth: float
    assumptions: List[YearAssumption]


@dataclass(frozen=True)
class DiagnosticsReport:
    errors: List[str]
    warnings: List[str]
    notes: List[str]


@dataclass(frozen=True)
class SensitivityConfig:
    wacc_values: List[float]
    terminal_growth_values: List[float]


@dataclass(frozen=True)
class ValuationResult:
    forecast_df: "object"
    valuation_bridge_df: "object"
    enterprise_value: float
    equity_value: float
    implied_share_price: Optional[float]
    terminal_value: float
    terminal_value_pv: float
    present_value_of_forecast: float
    discount_factors: List[float]
    terminal_value_weight: float
    diagnostics: DiagnosticsReport
    sensitivity_table: "object"
    scenario_summary: "object"
    metadata: Dict[str, float]
