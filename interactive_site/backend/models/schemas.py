from __future__ import annotations

from typing import List, Optional, Union

from pydantic import BaseModel, Field


class SearchSuggestion(BaseModel):
    symbol: str = Field(..., description="Primary trading symbol")
    name: str = Field(..., description="Company or instrument name")
    exchange: Optional[str] = Field(default=None, description="Exchange name or code")
    exchange_code: Optional[str] = Field(default=None, description="Normalized exchange code used for provider symbol mapping")
    currency: Optional[str] = None
    type: Optional[str] = None
    region: Optional[str] = None
    source: str
    score: float


class SearchResponse(BaseModel):
    query: str
    suggestions: List[SearchSuggestion]


class QuoteSnapshot(BaseModel):
    symbol: str
    name: str
    current_price: float
    market_cap: float
    currency: Optional[str] = None
    source: str


class CompanyOverviewResponse(BaseModel):
    quote: QuoteSnapshot
    revenue_base: Optional[float] = None
    diluted_shares: Optional[float] = None
    net_financial_position: Optional[float] = None
    notes: List[str] = Field(default_factory=list)


class ValuationCompany(BaseModel):
    symbol: str
    name: str
    exchange: Optional[str] = None
    currency: Optional[str] = None
    current_price: float
    market_cap: float
    shares_outstanding: float
    total_cash: float
    total_debt: float
    net_debt: float
    ttm_revenue: float


class ForecastAssumptionRow(BaseModel):
    year: int
    revenue_growth: float
    ebitda_margin: float
    depreciation_rate: float
    capex_rate: float
    nwc_rate: float
    tax_rate: float


class ValuationAssumptions(BaseModel):
    projection_years: int
    risk_free_rate: float
    market_return: float
    cost_of_debt: float
    beta: float
    debt_value: float
    equity_value: float
    terminal_growth: float
    wacc: float
    net_debt: float
    diluted_shares_outstanding: float
    revenue_growth: List[float]
    ebitda_margin: List[float]
    da_percent_revenue: List[float]
    capex_percent_revenue: List[float]
    nwc_percent_revenue: List[float]
    tax_rate: List[float]
    forecast: List[ForecastAssumptionRow]


class ValuationForecastRow(BaseModel):
    year: int
    revenue_growth: float
    revenue: float
    ebitda_margin: float
    ebitda: float
    depreciation_rate: float
    depreciation: float
    ebit: float
    tax_rate: float
    taxes: float
    nopat: float
    nwc_rate: float
    nwc: float
    delta_nwc: float
    capex_rate: float
    capex: float
    fcff: float
    discount_factor: float
    pv_fcff: float


class ValuationBridgeRow(BaseModel):
    metric: str
    value: float


class SensitivityRow(BaseModel):
    terminal_growth: float
    values: dict[str, Optional[float]]


class ValuationSummary(BaseModel):
    ticker: str
    company_name: str
    current_price: float
    computed_wacc: float
    cost_of_equity: float
    cost_of_debt_after_tax: float
    blended_tax_rate: float
    terminal_growth_rate: float
    enterprise_value: float
    equity_value: float
    implied_share_price: float
    terminal_value: float
    terminal_value_pv: float
    terminal_value_weight: float
    upside_downside: float
    forecast_year_count: int


class DataQuality(BaseModel):
    price_source: str
    fundamentals_source: str
    fallbacks_used: List[str] = Field(default_factory=list)
    missing_fields: List[str] = Field(default_factory=list)
    notes: List[str] = Field(default_factory=list)


NumberOrList = Union[float, List[float]]


class ValuationAssumptionsInput(BaseModel):
    revenue_growth: Optional[NumberOrList] = None
    ebitda_margin: Optional[NumberOrList] = None
    da_percent_revenue: Optional[NumberOrList] = None
    capex_percent_revenue: Optional[NumberOrList] = None
    nwc_percent_revenue: Optional[NumberOrList] = None
    tax_rate: Optional[NumberOrList] = None
    wacc: Optional[float] = None
    terminal_growth: Optional[float] = None
    net_debt: Optional[float] = None
    diluted_shares_outstanding: Optional[float] = None


class ValuationRequest(BaseModel):
    projection_years: int = Field(default=5, ge=1, le=10)
    assumptions: ValuationAssumptionsInput = Field(default_factory=ValuationAssumptionsInput)


class ValuationResponse(BaseModel):
    company: ValuationCompany
    assumptions_used: ValuationAssumptions
    assumptions_source: dict[str, str]
    forecast: List[ValuationForecastRow]
    bridge: List[ValuationBridgeRow]
    summary: ValuationSummary
    sensitivity: List[SensitivityRow]
    diagnostics: List[str] = Field(default_factory=list)
    data_quality: DataQuality
