from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Dict, List, Optional
import os

import requests

REQUEST_HEADERS = {"User-Agent": "Mozilla/5.0"}
YAHOO_QUOTE_URL = "https://query1.finance.yahoo.com/v7/finance/quote"
YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
YAHOO_PRICE_SUMMARY_URL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/{ticker}"
FMP_QUOTE_URL = "https://financialmodelingprep.com/stable/quote"
FMP_HISTORICAL_EOD_URL = "https://financialmodelingprep.com/stable/historical-price-eod/non-split-adjusted"

YAHOO_SUFFIX_MAP = {
    "uk": ".L",
    "de": ".DE",
    "fr": ".PA",
    "hk": ".HK",
    "in": ".NS",
    "jp": ".T",
    "au": ".AX",
    "sg": ".SI",
}


def load_env_file(env_path: str = ".env") -> None:
    """Load environment variables from the nearest matching .env file."""
    path = Path(env_path)
    if not path.exists():
        for candidate_root in [Path.cwd(), *Path.cwd().parents, Path(__file__).resolve().parent, *Path(__file__).resolve().parent.parents]:
            candidate = candidate_root / env_path
            if candidate.exists():
                path = candidate
                break
        else:
            return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


load_env_file()


@dataclass(frozen=True)
class DataSourceConfig:
    primary: str
    fallback: str
    fmp_api_key: str
    request_timeout_seconds: int


@dataclass(frozen=True)
class CompanyInputs:
    ticker: str
    company_name: str
    current_price: float
    revenue_base: float
    base_nwc: float
    net_financial_position: float
    surplus_assets: float
    minorities: float
    diluted_shares: float


@dataclass(frozen=True)
class MarketAssumptions:
    risk_free_rate: float
    market_return: float
    tax_rate: float
    cost_of_debt: float
    beta: float
    debt_value: float
    equity_value: float
    wacc_override: Optional[float] = None


@dataclass(frozen=True)
class ForecastYear:
    year: int
    revenue_growth: float
    ebitda_margin: float
    depreciation_rate: float
    capex_rate: float
    nwc_rate: float
    tax_rate: float


@dataclass(frozen=True)
class ModelInputs:
    company: CompanyInputs
    market: MarketAssumptions
    forecast_years: List[ForecastYear]
    terminal_growth_rate: float


def get_data_source_config() -> DataSourceConfig:
    return DataSourceConfig(
        primary=os.getenv("DATA_SOURCE_PRIMARY", "yahoo").strip().lower(),
        fallback=os.getenv("DATA_SOURCE_FALLBACK", "fmp").strip().lower(),
        fmp_api_key=os.getenv("FMP_API_KEY", "").strip(),
        request_timeout_seconds=int(os.getenv("REQUEST_TIMEOUT_SECONDS", "10")),
    )


def default_model_inputs() -> ModelInputs:
    company = CompanyInputs(
        ticker="AAPL",
        company_name="Apple Inc.",
        current_price=195.0,
        revenue_base=391_035_000_000.0,
        base_nwc=24_400_000_000.0,
        net_financial_position=81_000_000_000.0,
        surplus_assets=28_000_000_000.0,
        minorities=0.0,
        diluted_shares=15_300_000_000.0,
    )
    market = MarketAssumptions(
        risk_free_rate=0.042,
        market_return=0.090,
        tax_rate=0.21,
        cost_of_debt=0.050,
        beta=1.20,
        debt_value=110_000_000_000.0,
        equity_value=2_950_000_000_000.0,
        wacc_override=None,
    )
    forecast_years = [
        ForecastYear(1, 0.060, 0.320, 0.030, 0.040, 0.062, 0.210),
        ForecastYear(2, 0.055, 0.322, 0.030, 0.040, 0.062, 0.210),
        ForecastYear(3, 0.050, 0.323, 0.030, 0.040, 0.062, 0.210),
        ForecastYear(4, 0.045, 0.323, 0.030, 0.040, 0.062, 0.210),
        ForecastYear(5, 0.040, 0.322, 0.030, 0.040, 0.062, 0.210),
    ]
    return ModelInputs(company=company, market=market, forecast_years=forecast_years, terminal_growth_rate=0.025)


def _request_json(url: str, timeout_seconds: int, params: Optional[Dict[str, object]] = None) -> Dict:
    response = requests.get(url, params=params, timeout=timeout_seconds, headers=REQUEST_HEADERS)
    response.raise_for_status()
    return response.json()


def _extract_raw(value: object) -> Optional[float]:
    if isinstance(value, dict):
        value = value.get("raw")
    try:
        if value is None:
            return None
        return float(value)
    except (TypeError, ValueError):
        return None


def fetch_quote_snapshot_yahoo(ticker: str, timeout_seconds: int) -> Dict[str, float]:
    cleaned = ticker.upper().strip()
    errors: List[str] = []

    try:
        payload = _request_json(YAHOO_QUOTE_URL, timeout_seconds, params={"symbols": cleaned})
        results = payload.get("quoteResponse", {}).get("result", [])
        if results:
            result = results[0]
            return {
                "source": "yahoo",
                "current_price": float(result.get("regularMarketPrice") or 0.0),
                "market_cap": float(result.get("marketCap") or 0.0),
                "currency": str(result.get("currency") or ""),
                "short_name": str(result.get("shortName") or cleaned),
            }
        errors.append("Yahoo quote returned no matches")
    except Exception as exc:
        errors.append(f"Yahoo quote endpoint failed: {exc}")

    try:
        payload = _request_json(YAHOO_CHART_URL.format(ticker=cleaned), timeout_seconds, params={"range": "5d", "interval": "1d"})
        result = payload.get("chart", {}).get("result", [{}])[0]
        meta = result.get("meta", {})
        if meta:
            market_price = (
                meta.get("regularMarketPrice")
                or meta.get("previousClose")
                or meta.get("chartPreviousClose")
                or 0.0
            )
            return {
                "source": "yahoo",
                "current_price": float(market_price or 0.0),
                "market_cap": float(meta.get("marketCap") or 0.0),
                "currency": str(meta.get("currency") or ""),
                "short_name": str(meta.get("shortName") or meta.get("symbol") or cleaned),
            }
        errors.append("Yahoo chart returned no meta")
    except Exception as exc:
        errors.append(f"Yahoo chart endpoint failed: {exc}")

    try:
        payload = _request_json(
            YAHOO_PRICE_SUMMARY_URL.format(ticker=cleaned),
            timeout_seconds,
            params={"modules": "price"},
        )
        result = payload.get("quoteSummary", {}).get("result", [{}])[0]
        price = result.get("price", {})
        if price:
            return {
                "source": "yahoo",
                "current_price": float(_extract_raw(price.get("regularMarketPrice")) or 0.0),
                "market_cap": float(_extract_raw(price.get("marketCap")) or 0.0),
                "currency": str(price.get("currency") or ""),
                "short_name": str(price.get("shortName") or price.get("longName") or cleaned),
            }
        errors.append("Yahoo price summary returned no price block")
    except Exception as exc:
        errors.append(f"Yahoo summary price failed: {exc}")

    raise ValueError(" | ".join(errors))


def fetch_quote_snapshot_fmp(ticker: str, api_key: str, timeout_seconds: int) -> Dict[str, float]:
    if not api_key:
        raise ValueError("FMP_API_KEY is not set.")
    errors: List[str] = []

    try:
        response = requests.get(
            FMP_QUOTE_URL,
            params={"symbol": ticker.upper().strip(), "apikey": api_key},
            timeout=timeout_seconds,
            headers=REQUEST_HEADERS,
        )
        response.raise_for_status()
        payload = response.json()
        if isinstance(payload, list) and payload:
            result = payload[0]
            return {
                "source": "fmp",
                "current_price": float(result.get("price") or 0.0),
                "market_cap": float(result.get("marketCap") or 0.0),
                "currency": str(result.get("currency") or ""),
                "short_name": str(result.get("name") or ticker.upper().strip()),
            }
        errors.append(f"No FMP quote data found for {ticker}.")
    except Exception as exc:
        errors.append(f"FMP quote failed: {exc}")

    try:
        return fetch_historical_price_snapshot_fmp(ticker, api_key, timeout_seconds)
    except Exception as exc:
        errors.append(f"FMP historical EOD failed: {exc}")

    raise ValueError(" | ".join(errors))


def fetch_historical_price_snapshot_fmp(ticker: str, api_key: str, timeout_seconds: int) -> Dict[str, float]:
    if not api_key:
        raise ValueError("FMP_API_KEY is not set.")
    response = requests.get(
        FMP_HISTORICAL_EOD_URL,
        params={"symbol": ticker.upper().strip(), "apikey": api_key},
        timeout=timeout_seconds,
        headers=REQUEST_HEADERS,
    )
    response.raise_for_status()
    payload = response.json()
    historical = payload.get("historical") if isinstance(payload, dict) else None
    if not isinstance(historical, list) or not historical:
        raise ValueError(f"No FMP historical price data found for {ticker}.")
    result = historical[0]
    return {
        "source": "fmp-historical",
        "current_price": float(result.get("close") or 0.0),
        "market_cap": 0.0,
        "currency": "",
        "short_name": str(result.get("name") or ticker.upper().strip()),
    }


@lru_cache(maxsize=256)
def _fetch_quote_snapshot_cached(
    ticker: str,
    primary: str,
    fallback: str,
    fmp_api_key: str,
    request_timeout_seconds: int,
) -> Dict[str, float]:
    sources = [primary, fallback]
    errors: List[str] = []

    for source in sources:
        if source == "yahoo":
            try:
                return fetch_quote_snapshot_yahoo(ticker, request_timeout_seconds)
            except Exception as exc:
                errors.append(f"Yahoo failed: {exc}")
        elif source == "fmp":
            try:
                return fetch_quote_snapshot_fmp(ticker, fmp_api_key, request_timeout_seconds)
            except Exception as exc:
                errors.append(f"FMP failed: {exc}")

    raise ValueError(" | ".join(errors) or f"No quote data found for {ticker}.")


def build_symbol_candidates(ticker: str, exchange_code: str | None = None) -> List[str]:
    normalized_ticker = ticker.upper().strip()
    suffix = YAHOO_SUFFIX_MAP.get((exchange_code or "").strip().lower())
    candidates: List[str] = []
    if suffix and not normalized_ticker.endswith(suffix):
        candidates.append(f"{normalized_ticker}{suffix}")
    candidates.append(normalized_ticker)
    return list(dict.fromkeys(candidate for candidate in candidates if candidate))


def fetch_quote_snapshot(ticker: str, config: Optional[DataSourceConfig] = None, exchange_code: str | None = None) -> Dict[str, float]:
    active_config = config or get_data_source_config()
    errors: List[str] = []
    for candidate in build_symbol_candidates(ticker, exchange_code=exchange_code):
        try:
            return _fetch_quote_snapshot_cached(
                candidate,
                active_config.primary,
                active_config.fallback,
                active_config.fmp_api_key,
                active_config.request_timeout_seconds,
            )
        except Exception as exc:
            errors.append(f"{candidate}: {exc}")
    raise ValueError(" | ".join(errors) or f"No quote data found for {ticker}.")


def coerce_float(value: object, fallback: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


def model_inputs_from_form(values: Dict[str, object], base_inputs: Optional[ModelInputs] = None) -> ModelInputs:
    base = base_inputs or default_model_inputs()
    company = CompanyInputs(
        ticker=str(values.get("ticker", base.company.ticker)).upper(),
        company_name=str(values.get("company_name", base.company.company_name)),
        current_price=coerce_float(values.get("current_price"), base.company.current_price),
        revenue_base=coerce_float(values.get("revenue_base"), base.company.revenue_base),
        base_nwc=coerce_float(values.get("base_nwc"), base.company.base_nwc),
        net_financial_position=coerce_float(values.get("net_financial_position"), base.company.net_financial_position),
        surplus_assets=coerce_float(values.get("surplus_assets"), base.company.surplus_assets),
        minorities=coerce_float(values.get("minorities"), base.company.minorities),
        diluted_shares=coerce_float(values.get("diluted_shares"), base.company.diluted_shares),
    )
    market = MarketAssumptions(
        risk_free_rate=coerce_float(values.get("risk_free_rate"), base.market.risk_free_rate),
        market_return=coerce_float(values.get("market_return"), base.market.market_return),
        tax_rate=coerce_float(values.get("tax_rate"), base.market.tax_rate),
        cost_of_debt=coerce_float(values.get("cost_of_debt"), base.market.cost_of_debt),
        beta=coerce_float(values.get("beta"), base.market.beta),
        debt_value=coerce_float(values.get("debt_value"), base.market.debt_value),
        equity_value=coerce_float(values.get("equity_value"), base.market.equity_value),
        wacc_override=coerce_float(values.get("wacc_override"), base.market.wacc_override) if values.get("wacc_override") is not None else base.market.wacc_override,
    )
    forecast_years: List[ForecastYear] = []
    for year in base.forecast_years:
        suffix = str(year.year)
        forecast_years.append(
            ForecastYear(
                year=year.year,
                revenue_growth=coerce_float(values.get(f"revenue_growth_{suffix}"), year.revenue_growth),
                ebitda_margin=coerce_float(values.get(f"ebitda_margin_{suffix}"), year.ebitda_margin),
                depreciation_rate=coerce_float(values.get(f"depreciation_rate_{suffix}"), year.depreciation_rate),
                capex_rate=coerce_float(values.get(f"capex_rate_{suffix}"), year.capex_rate),
                nwc_rate=coerce_float(values.get(f"nwc_rate_{suffix}"), year.nwc_rate),
                tax_rate=coerce_float(values.get(f"tax_rate_{suffix}"), year.tax_rate),
            )
        )
    return ModelInputs(
        company=company,
        market=market,
        forecast_years=forecast_years,
        terminal_growth_rate=coerce_float(values.get("terminal_growth_rate"), base.terminal_growth_rate),
    )
