from __future__ import annotations

from typing import Any, Dict, List

from backend.models.schemas import ValuationRequest
from backend.services.assumptions_service import (
    build_assumption_package,
    build_forecast_years_from_assumptions,
    generate_historical_defaults,
)
from backend.services.market_data_service import fetch_company_fundamentals
from python_model.data_api import CompanyInputs, MarketAssumptions, ModelInputs, default_model_inputs
from python_model.dcf_engine import run_valuation


def build_valuation_response(symbol: str, request: ValuationRequest | None = None, exchange_code: str | None = None) -> Dict[str, Any]:
    """Main backend workflow: fetch data, resolve assumptions, run DCF, serialize response."""
    base_inputs = default_model_inputs()
    fundamentals = fetch_company_fundamentals(symbol, exchange_code=exchange_code)
    normalized = _normalize_company_data(fundamentals, base_inputs)
    historical_defaults = generate_historical_defaults(fundamentals)
    assumption_package = build_assumption_package(
        base_inputs=base_inputs,
        historical_defaults=historical_defaults,
        request=request,
        company_defaults={
            "net_debt": normalized["company"]["net_debt"],
            "diluted_shares_outstanding": normalized["company"]["shares_outstanding"],
        },
    )
    model_inputs = _build_model_inputs(base_inputs, normalized, assumption_package["assumptions_used"])
    result = run_valuation(model_inputs)

    return {
        "company": normalized["company"],
        "assumptions_used": _serialize_assumptions(model_inputs, assumption_package["assumptions_used"]),
        "assumptions_source": assumption_package["assumptions_source"],
        "forecast": _serialize_forecast(result["forecast_df"]),
        "bridge": _serialize_bridge(result["bridge_df"]),
        "summary": _serialize_summary(result["summary"]),
        "sensitivity": _serialize_sensitivity(result["sensitivity_df"]),
        "diagnostics": [str(item) for item in result["diagnostics"]],
        "data_quality": normalized["data_quality"],
    }


def _normalize_company_data(fundamentals: Dict[str, Any], base_inputs: ModelInputs) -> Dict[str, Any]:
    """Convert raw provider data into a normalized company payload with explicit fallbacks."""
    quote = fundamentals["quote"]
    notes = list(fundamentals.get("notes") or [])
    missing_fields: List[str] = []
    fallbacks_used: List[str] = []

    revenue_base = _coalesce_number(fundamentals.get("revenue_base"))
    if revenue_base is None:
        revenue_base = base_inputs.company.revenue_base
        missing_fields.append("ttm_revenue")
        fallbacks_used.append("default_revenue_base")

    diluted_shares = _coalesce_number(fundamentals.get("diluted_shares"))
    if diluted_shares is None:
        diluted_shares = base_inputs.company.diluted_shares
        missing_fields.append("shares_outstanding")
        fallbacks_used.append("default_diluted_shares")

    current_price = _coalesce_number(quote.get("current_price"))
    if current_price is None or current_price <= 0:
        derived_from_market_cap = _coalesce_number(quote.get("market_cap"))
        if derived_from_market_cap and diluted_shares:
            current_price = derived_from_market_cap / diluted_shares
            fallbacks_used.append("price_from_market_cap_over_shares")
        else:
            current_price = base_inputs.company.current_price
            missing_fields.append("current_price")
            fallbacks_used.append("default_current_price")

    market_cap = _coalesce_number(quote.get("market_cap"))
    if market_cap is None or market_cap <= 0:
        market_cap = current_price * diluted_shares
        fallbacks_used.append("market_cap_from_price_x_shares")

    total_cash = _coalesce_number(fundamentals.get("total_cash"))
    if total_cash is None:
        total_cash = 0.0
        missing_fields.append("total_cash")
        fallbacks_used.append("default_total_cash_zero")

    total_debt = _coalesce_number(fundamentals.get("total_debt"))
    if total_debt is None:
        total_debt = 0.0
        missing_fields.append("total_debt")
        fallbacks_used.append("default_total_debt_zero")

    net_debt = _coalesce_number(fundamentals.get("net_financial_position"))
    if net_debt is None:
        net_debt = total_debt - total_cash
        fallbacks_used.append("net_debt_from_total_debt_minus_cash")

    company = {
        "symbol": str(quote.get("symbol") or base_inputs.company.ticker).upper(),
        "name": str(quote.get("name") or base_inputs.company.company_name),
        "exchange": fundamentals.get("exchange"),
        "currency": quote.get("currency"),
        "current_price": float(current_price),
        "market_cap": float(market_cap),
        "shares_outstanding": float(diluted_shares),
        "total_cash": float(total_cash),
        "total_debt": float(total_debt),
        "net_debt": float(net_debt),
        "ttm_revenue": float(revenue_base),
    }
    data_quality = {
        "price_source": str(quote.get("source") or "unknown"),
        "fundamentals_source": str(fundamentals.get("fundamentals_source") or "unknown"),
        "fallbacks_used": fallbacks_used,
        "missing_fields": _unique(missing_fields),
        "notes": notes,
    }
    return {"company": company, "data_quality": data_quality}


def _build_model_inputs(base_inputs: ModelInputs, normalized: Dict[str, Any], assumptions_used: Dict[str, Any]) -> ModelInputs:
    """Assemble canonical model inputs from normalized company data and resolved assumptions."""
    company_data = normalized["company"]
    base_nwc = company_data["ttm_revenue"] * assumptions_used["nwc_percent_revenue"][0]

    company = CompanyInputs(
        ticker=company_data["symbol"],
        company_name=company_data["name"],
        current_price=company_data["current_price"],
        revenue_base=company_data["ttm_revenue"],
        base_nwc=base_nwc,
        net_financial_position=assumptions_used["net_debt"],
        surplus_assets=base_inputs.company.surplus_assets,
        minorities=base_inputs.company.minorities,
        diluted_shares=assumptions_used["diluted_shares_outstanding"],
    )
    market = MarketAssumptions(
        risk_free_rate=base_inputs.market.risk_free_rate,
        market_return=base_inputs.market.market_return,
        tax_rate=assumptions_used["tax_rate"][0],
        cost_of_debt=base_inputs.market.cost_of_debt,
        beta=base_inputs.market.beta,
        debt_value=company_data["total_debt"] or base_inputs.market.debt_value,
        equity_value=company_data["market_cap"] or base_inputs.market.equity_value,
        wacc_override=assumptions_used["wacc"],
    )
    return ModelInputs(
        company=company,
        market=market,
        forecast_years=build_forecast_years_from_assumptions(assumptions_used),
        terminal_growth_rate=assumptions_used["terminal_growth"],
    )


def _serialize_assumptions(inputs: ModelInputs, assumptions_used: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "projection_years": assumptions_used["projection_years"],
        "risk_free_rate": inputs.market.risk_free_rate,
        "market_return": inputs.market.market_return,
        "cost_of_debt": inputs.market.cost_of_debt,
        "beta": inputs.market.beta,
        "debt_value": inputs.market.debt_value,
        "equity_value": inputs.market.equity_value,
        "terminal_growth": assumptions_used["terminal_growth"],
        "wacc": assumptions_used["wacc"],
        "net_debt": assumptions_used["net_debt"],
        "diluted_shares_outstanding": assumptions_used["diluted_shares_outstanding"],
        "revenue_growth": assumptions_used["revenue_growth"],
        "ebitda_margin": assumptions_used["ebitda_margin"],
        "da_percent_revenue": assumptions_used["da_percent_revenue"],
        "capex_percent_revenue": assumptions_used["capex_percent_revenue"],
        "nwc_percent_revenue": assumptions_used["nwc_percent_revenue"],
        "tax_rate": assumptions_used["tax_rate"],
        "forecast": [
            {
                "year": year.year,
                "revenue_growth": year.revenue_growth,
                "ebitda_margin": year.ebitda_margin,
                "depreciation_rate": year.depreciation_rate,
                "capex_rate": year.capex_rate,
                "nwc_rate": year.nwc_rate,
                "tax_rate": year.tax_rate,
            }
            for year in inputs.forecast_years
        ],
    }


def _serialize_forecast(frame) -> List[Dict[str, float]]:
    rows = []
    for row in frame.to_dict(orient="records"):
        rows.append(
            {
                "year": int(row["Year"]),
                "revenue_growth": float(row["Revenue Growth"]),
                "revenue": float(row["Revenue"]),
                "ebitda_margin": float(row["EBITDA Margin"]),
                "ebitda": float(row["EBITDA"]),
                "depreciation_rate": float(row["Depreciation Rate"]),
                "depreciation": float(row["Depreciation"]),
                "ebit": float(row["EBIT"]),
                "tax_rate": float(row["Tax Rate"]),
                "taxes": float(row["Taxes"]),
                "nopat": float(row["NOPAT"]),
                "nwc_rate": float(row["NWC Rate"]),
                "nwc": float(row["NWC"]),
                "delta_nwc": float(row["Delta NWC"]),
                "capex_rate": float(row["Capex Rate"]),
                "capex": float(row["Capex"]),
                "fcff": float(row["FCFF"]),
                "discount_factor": float(row["Discount Factor"]),
                "pv_fcff": float(row["PV of FCFF"]),
            }
        )
    return rows


def _serialize_bridge(frame) -> List[Dict[str, float]]:
    return [{"metric": str(row["Metric"]), "value": float(row["Value"])} for row in frame.to_dict(orient="records")]


def _serialize_summary(summary: Dict[str, Any]) -> Dict[str, Any]:
    payload = {}
    for key, value in summary.items():
        if isinstance(value, (int, float)):
            payload[key] = float(value)
        else:
            payload[key] = value
    return payload


def _serialize_sensitivity(frame) -> List[Dict[str, Any]]:
    rows = []
    for row in frame.to_dict(orient="records"):
        values = {}
        for key, value in row.items():
            if key == "Terminal Growth":
                continue
            values[str(key)] = None if value is None else float(value)
        rows.append({"terminal_growth": float(row["Terminal Growth"]), "values": values})
    return rows


def _coalesce_number(value: Any) -> float | None:
    try:
        if value is None:
            return None
        return float(value)
    except (TypeError, ValueError):
        return None


def _unique(values: List[str]) -> List[str]:
    seen = set()
    ordered = []
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        ordered.append(value)
    return ordered
