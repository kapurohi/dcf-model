from __future__ import annotations

from typing import Any, Dict, List

from fastapi import HTTPException

from backend.models.schemas import ValuationRequest
from python_model.data_api import ForecastYear, ModelInputs

YEARLY_FIELDS = (
    ("revenue_growth", "revenue_growth"),
    ("ebitda_margin", "ebitda_margin"),
    ("da_percent_revenue", "depreciation_rate"),
    ("capex_percent_revenue", "capex_rate"),
    ("nwc_percent_revenue", "nwc_rate"),
    ("tax_rate", "tax_rate"),
)


def build_assumption_package(
    base_inputs: ModelInputs,
    historical_defaults: Dict[str, float],
    request: ValuationRequest | None,
    company_defaults: Dict[str, float],
) -> Dict[str, Any]:
    """Resolve each assumption as custom input, historical default, or fallback default."""
    projection_years = request.projection_years if request else len(base_inputs.forecast_years)
    custom = request.assumptions if request else None

    fallback_defaults = _fallback_defaults(base_inputs, projection_years, company_defaults)
    assumptions_used: Dict[str, Any] = {"projection_years": projection_years}
    assumptions_source: Dict[str, str] = {}

    for request_field, fallback_field in YEARLY_FIELDS:
        custom_value = getattr(custom, request_field, None) if custom else None
        if custom_value is not None:
            assumptions_used[request_field] = normalize_series_input(custom_value, projection_years, request_field)
            assumptions_source[request_field] = "custom input"
            continue

        historical_value = historical_defaults.get(request_field)
        if historical_value is not None:
            assumptions_used[request_field] = [float(historical_value)] * projection_years
            assumptions_source[request_field] = "historical default"
            continue

        assumptions_used[request_field] = list(fallback_defaults[fallback_field])
        assumptions_source[request_field] = "fallback default"

    assumptions_used["wacc"], assumptions_source["wacc"] = _resolve_scalar(
        getattr(custom, "wacc", None) if custom else None,
        fallback=base_inputs.market.wacc_override,
        fallback_default=_implied_fallback_wacc(base_inputs),
    )
    assumptions_used["terminal_growth"], assumptions_source["terminal_growth"] = _resolve_scalar(
        getattr(custom, "terminal_growth", None) if custom else None,
        fallback=None,
        fallback_default=base_inputs.terminal_growth_rate,
    )
    assumptions_used["net_debt"], assumptions_source["net_debt"] = _resolve_scalar(
        getattr(custom, "net_debt", None) if custom else None,
        fallback=company_defaults["net_debt"],
        fallback_default=base_inputs.company.net_financial_position,
    )
    assumptions_used["diluted_shares_outstanding"], assumptions_source["diluted_shares_outstanding"] = _resolve_scalar(
        getattr(custom, "diluted_shares_outstanding", None) if custom else None,
        fallback=company_defaults["diluted_shares_outstanding"],
        fallback_default=base_inputs.company.diluted_shares,
    )

    return {"assumptions_used": assumptions_used, "assumptions_source": assumptions_source}


def build_forecast_years_from_assumptions(assumptions_used: Dict[str, Any]) -> List[ForecastYear]:
    """Expand the resolved assumptions into year-by-year forecast rows."""
    years = assumptions_used["projection_years"]
    forecast_years = []
    for index in range(years):
        forecast_years.append(
            ForecastYear(
                year=index + 1,
                revenue_growth=assumptions_used["revenue_growth"][index],
                ebitda_margin=assumptions_used["ebitda_margin"][index],
                depreciation_rate=assumptions_used["da_percent_revenue"][index],
                capex_rate=assumptions_used["capex_percent_revenue"][index],
                nwc_rate=assumptions_used["nwc_percent_revenue"][index],
                tax_rate=assumptions_used["tax_rate"][index],
            )
        )
    return forecast_years


def normalize_series_input(value: Any, projection_years: int, field_name: str) -> List[float]:
    """Accept a scalar or an array and normalize it into a full yearly series."""
    if isinstance(value, (int, float)):
        return [float(value)] * projection_years
    if isinstance(value, list):
        if len(value) != projection_years:
            raise HTTPException(
                status_code=422,
                detail=f"{field_name} must have exactly {projection_years} values when passed as an array.",
            )
        try:
            return [float(item) for item in value]
        except (TypeError, ValueError) as exc:
            raise HTTPException(status_code=422, detail=f"{field_name} must contain only numeric values.") from exc
    raise HTTPException(status_code=422, detail=f"{field_name} must be either a number or an array of numbers.")


def generate_historical_defaults(fundamentals: Dict[str, Any]) -> Dict[str, float]:
    """Derive default operating assumptions from live historical fundamentals when available."""
    revenue = _as_float(fundamentals.get("revenue_base"))
    if not revenue or revenue <= 0:
        return {}

    defaults: Dict[str, float] = {}
    ebitda = _as_float(fundamentals.get("ebitda"))
    depreciation = _as_float(fundamentals.get("depreciation_and_amortization"))
    capex = _as_float(fundamentals.get("capital_expenditure"))
    nwc = _as_float(fundamentals.get("net_working_capital"))
    tax_rate = _as_float(fundamentals.get("tax_rate"))

    if ebitda is not None:
        defaults["ebitda_margin"] = ebitda / revenue
    if depreciation is not None:
        defaults["da_percent_revenue"] = abs(depreciation) / revenue
    if capex is not None:
        defaults["capex_percent_revenue"] = abs(capex) / revenue
    if nwc is not None:
        defaults["nwc_percent_revenue"] = nwc / revenue
    if tax_rate is not None:
        defaults["tax_rate"] = min(max(tax_rate, 0.0), 0.60)
    return defaults


def _fallback_defaults(base_inputs: ModelInputs, projection_years: int, company_defaults: Dict[str, float]) -> Dict[str, Any]:
    revenue_growth = _series_from_base(base_inputs, "revenue_growth", projection_years)
    ebitda_margin = _series_from_base(base_inputs, "ebitda_margin", projection_years)
    depreciation_rate = _series_from_base(base_inputs, "depreciation_rate", projection_years)
    capex_rate = _series_from_base(base_inputs, "capex_rate", projection_years)
    nwc_rate = _series_from_base(base_inputs, "nwc_rate", projection_years)
    tax_rate = _series_from_base(base_inputs, "tax_rate", projection_years)
    return {
        "revenue_growth": revenue_growth,
        "ebitda_margin": ebitda_margin,
        "depreciation_rate": depreciation_rate,
        "capex_rate": capex_rate,
        "nwc_rate": nwc_rate,
        "tax_rate": tax_rate,
        "net_debt": company_defaults["net_debt"],
        "diluted_shares_outstanding": company_defaults["diluted_shares_outstanding"],
    }


def _series_from_base(base_inputs: ModelInputs, attribute: str, projection_years: int) -> List[float]:
    base_values = [float(getattr(year, attribute)) for year in base_inputs.forecast_years]
    if len(base_values) >= projection_years:
        return base_values[:projection_years]
    while len(base_values) < projection_years:
        base_values.append(base_values[-1])
    return base_values


def _resolve_scalar(custom_value: float | None, fallback: float | None, fallback_default: float) -> tuple[float, str]:
    if custom_value is not None:
        return float(custom_value), "custom input"
    if fallback is not None:
        return float(fallback), "historical default"
    return float(fallback_default), "fallback default"


def _implied_fallback_wacc(base_inputs: ModelInputs) -> float:
    if base_inputs.market.wacc_override is not None:
        return float(base_inputs.market.wacc_override)
    return 0.09


def _as_float(value: Any) -> float | None:
    try:
        if value is None:
            return None
        return float(value)
    except (TypeError, ValueError):
        return None
