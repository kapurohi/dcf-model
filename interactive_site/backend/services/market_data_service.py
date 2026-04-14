from __future__ import annotations

from typing import Dict, List, Optional

import requests

from backend.services.search_service import normalize_exchange_code, search_public_companies
from python_model.data_api import fetch_quote_snapshot, get_data_source_config

YAHOO_SUMMARY_URL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/{symbol}"
YAHOO_MODULES = "price,defaultKeyStatistics,financialData,balanceSheetHistory,balanceSheetHistoryQuarterly"
FMP_PROFILE_URL = "https://financialmodelingprep.com/stable/profile"
FMP_INCOME_TTM_URL = "https://financialmodelingprep.com/stable/income-statement-ttm"
FMP_BALANCE_TTM_URL = "https://financialmodelingprep.com/stable/balance-sheet-statement-ttm"
FMP_CASHFLOW_TTM_URL = "https://financialmodelingprep.com/stable/cash-flow-statement-ttm"
FMP_INCOME_URL = "https://financialmodelingprep.com/stable/income-statement"
FMP_BALANCE_URL = "https://financialmodelingprep.com/stable/balance-sheet-statement"
FMP_CASHFLOW_URL = "https://financialmodelingprep.com/stable/cash-flow-statement"


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

CURRENCY_BY_EXCHANGE_CODE = {
    "us": "USD",
    "uk": "GBP",
    "de": "EUR",
    "fr": "EUR",
    "hk": "HKD",
    "in": "INR",
    "jp": "JPY",
    "au": "AUD",
    "sg": "SGD",
}


def fetch_company_overview(symbol: str, exchange_code: str | None = None) -> Dict:
    """Return the lightweight company overview used by the company endpoint."""
    payload = fetch_company_fundamentals(symbol, exchange_code=exchange_code)
    return {
        "quote": payload["quote"],
        "revenue_base": payload["revenue_base"],
        "diluted_shares": payload["diluted_shares"],
        "net_financial_position": payload["net_financial_position"],
        "notes": payload["notes"],
    }


def fetch_company_fundamentals(symbol: str, exchange_code: str | None = None) -> Dict:
    """Fetch quote and fundamentals using exchange-aware symbol candidates and provider fallbacks."""
    cleaned_symbol = symbol.upper().strip()
    matched_listing = _best_search_match(cleaned_symbol, exchange_code=exchange_code)
    normalized_exchange = _resolve_exchange_code(exchange_code, matched_listing)
    symbol_candidates = _build_symbol_candidates(cleaned_symbol, normalized_exchange)
    cfg = get_data_source_config()

    quote_error = None
    quote = None
    for candidate in symbol_candidates:
        try:
            quote = fetch_quote_snapshot(candidate)
            break
        except Exception as exc:
            quote_error = str(exc)
    if quote is None:
        quote = {
            "source": "search",
            "current_price": 0.0,
            "market_cap": 0.0,
            "currency": matched_listing.get("currency") if matched_listing else "",
            "short_name": matched_listing.get("name") if matched_listing else cleaned_symbol,
        }

    revenue_base = None
    ebitda = None
    diluted_shares = None
    depreciation_and_amortization = None
    capital_expenditure = None
    net_working_capital = None
    tax_rate = None
    net_financial_position = None
    total_cash = None
    total_debt = None
    summary_market_cap = None
    summary_price = None
    summary_source = "unavailable"
    notes = []

    try:
        for candidate in symbol_candidates:
            response = requests.get(
                YAHOO_SUMMARY_URL.format(symbol=candidate),
                params={"modules": YAHOO_MODULES},
                timeout=cfg.request_timeout_seconds,
                headers={"User-Agent": "Mozilla/5.0"},
            )
            response.raise_for_status()
            payload = response.json()
            result = payload.get("quoteSummary", {}).get("result", [{}])[0]
            if not result:
                continue
            summary_source = "yahoo"

            financial_data = result.get("financialData", {})
            key_stats = result.get("defaultKeyStatistics", {})
            price_data = result.get("price", {})

            revenue_base = _extract_raw(financial_data.get("totalRevenue"))
            ebitda = _extract_raw(financial_data.get("ebitda"))
            summary_market_cap = _extract_raw(price_data.get("marketCap")) or _extract_raw(financial_data.get("marketCap"))
            summary_price = _extract_raw(price_data.get("regularMarketPrice"))

            diluted_shares = _extract_raw(key_stats.get("sharesOutstanding"))
            if diluted_shares is None:
                diluted_shares = _extract_raw(price_data.get("sharesOutstanding"))

            total_cash = _extract_raw(financial_data.get("totalCash"))
            total_debt = _extract_raw(financial_data.get("totalDebt"))
            if total_cash is not None or total_debt is not None:
                net_financial_position = (total_debt or 0.0) - (total_cash or 0.0)
            if any(value is not None for value in (revenue_base, diluted_shares, total_cash, total_debt)):
                break
        if summary_source == "unavailable":
            raise ValueError("No Yahoo summary result matched the candidate symbols.")
    except Exception:
        notes.append("Yahoo fundamentals were unavailable for this listing.")

    if cfg.fmp_api_key and any(value is None for value in (revenue_base, diluted_shares, total_cash, total_debt)):
        try:
            fmp_data = _fetch_fmp_fundamentals(symbol_candidates, cfg.fmp_api_key, cfg.request_timeout_seconds)
            if revenue_base is None:
                revenue_base = fmp_data.get("revenue_base")
            if ebitda is None:
                ebitda = fmp_data.get("ebitda")
            if diluted_shares is None:
                diluted_shares = fmp_data.get("diluted_shares")
            if depreciation_and_amortization is None:
                depreciation_and_amortization = fmp_data.get("depreciation_and_amortization")
            if capital_expenditure is None:
                capital_expenditure = fmp_data.get("capital_expenditure")
            if net_working_capital is None:
                net_working_capital = fmp_data.get("net_working_capital")
            if tax_rate is None:
                tax_rate = fmp_data.get("tax_rate")
            if total_cash is None:
                total_cash = fmp_data.get("total_cash")
            if total_debt is None:
                total_debt = fmp_data.get("total_debt")
            if net_financial_position is None and (total_cash is not None or total_debt is not None):
                net_financial_position = (total_debt or 0.0) - (total_cash or 0.0)
            if summary_source == "unavailable":
                summary_source = "fmp"
            elif summary_source != "fmp":
                summary_source = f"{summary_source}+fmp"
        except Exception:
            notes.append("FMP fundamentals fallback was unavailable for this listing.")

    name = quote.get("short_name") or (matched_listing.get("name") if matched_listing else cleaned_symbol)
    currency = quote.get("currency") or (matched_listing.get("currency") if matched_listing else None) or CURRENCY_BY_EXCHANGE_CODE.get(normalized_exchange)
    exchange = matched_listing.get("exchange") if matched_listing else None
    current_price = float(quote.get("current_price") or 0.0)
    market_cap = float(quote.get("market_cap") or 0.0)

    if not current_price and summary_price:
        current_price = float(summary_price)

    if not market_cap and summary_market_cap:
        market_cap = float(summary_market_cap)

    if not market_cap and diluted_shares and current_price:
        market_cap = float(diluted_shares) * float(current_price)

    if quote_error and matched_listing is None and not quote.get("current_price"):
        raise ValueError(f"Unable to load {cleaned_symbol} right now. Try again in a moment or choose a different listing.")

    return {
        "quote": {
            "symbol": cleaned_symbol,
            "name": name,
            "current_price": current_price,
            "market_cap": market_cap,
            "currency": currency,
            "source": quote.get("source") or "unknown",
        },
        "exchange": exchange,
        "exchange_code": normalized_exchange,
        "revenue_base": revenue_base,
        "ebitda": ebitda,
        "diluted_shares": diluted_shares,
        "depreciation_and_amortization": depreciation_and_amortization,
        "capital_expenditure": capital_expenditure,
        "net_working_capital": net_working_capital,
        "tax_rate": tax_rate,
        "total_cash": total_cash,
        "total_debt": total_debt,
        "net_financial_position": net_financial_position,
        "notes": notes,
        "fundamentals_source": summary_source,
    }


def _best_search_match(symbol: str, exchange_code: str | None = None) -> Optional[Dict]:
    try:
        results = search_public_companies(symbol, 8)
    except Exception:
        return None

    preferred_exchange = normalize_exchange_code(exchange_code or "")
    for item in results:
        if str(item.get("symbol") or "").upper() == symbol and (
            not preferred_exchange or normalize_exchange_code(str(item.get("exchange_code") or item.get("exchange") or "")) == preferred_exchange
        ):
            return item
    for item in results:
        if str(item.get("symbol") or "").upper() == symbol:
            return item
    return results[0] if results else None


def _resolve_exchange_code(exchange_code: str | None, matched_listing: Optional[Dict]) -> str:
    explicit = normalize_exchange_code(exchange_code or "")
    if explicit:
        return explicit
    if matched_listing:
        return normalize_exchange_code(str(matched_listing.get("exchange_code") or matched_listing.get("exchange") or ""))
    return ""


def _build_symbol_candidates(symbol: str, exchange_code: str) -> List[str]:
    candidates: List[str] = []
    normalized_symbol = symbol.upper().strip()
    suffix = YAHOO_SUFFIX_MAP.get(exchange_code)
    if suffix and not normalized_symbol.endswith(suffix):
        candidates.append(f"{normalized_symbol}{suffix}")
    candidates.append(normalized_symbol)
    return list(dict.fromkeys(candidate for candidate in candidates if candidate))


def _extract_raw(value):
    if isinstance(value, dict):
        raw = value.get("raw")
        if raw is None:
            return None
        try:
            return float(raw)
        except (TypeError, ValueError):
            return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _fetch_fmp_fundamentals(symbol_candidates: List[str], api_key: str, timeout_seconds: int) -> Dict[str, Optional[float]]:
    profile = _fetch_first_fmp_record(FMP_PROFILE_URL, symbol_candidates, api_key, timeout_seconds)
    income_ttm = _fetch_first_fmp_record(FMP_INCOME_TTM_URL, symbol_candidates, api_key, timeout_seconds, optional=True)
    balance_ttm = _fetch_first_fmp_record(FMP_BALANCE_TTM_URL, symbol_candidates, api_key, timeout_seconds, optional=True)
    cashflow_ttm = _fetch_first_fmp_record(FMP_CASHFLOW_TTM_URL, symbol_candidates, api_key, timeout_seconds, optional=True)

    if not income_ttm:
        income_ttm = _fetch_first_fmp_record(FMP_INCOME_URL, symbol_candidates, api_key, timeout_seconds, optional=True)
    if not balance_ttm:
        balance_ttm = _fetch_first_fmp_record(FMP_BALANCE_URL, symbol_candidates, api_key, timeout_seconds, optional=True)
    if not cashflow_ttm:
        cashflow_ttm = _fetch_first_fmp_record(FMP_CASHFLOW_URL, symbol_candidates, api_key, timeout_seconds, optional=True)

    income_ttm = income_ttm or {}
    balance_ttm = balance_ttm or {}
    cashflow_ttm = cashflow_ttm or {}

    price = _extract_raw(profile.get("price"))
    market_cap = _extract_raw(profile.get("marketCap"))
    diluted_shares = _extract_raw(profile.get("sharesOutstanding"))
    if diluted_shares is None and price and market_cap:
        diluted_shares = market_cap / price

    pretax_income = _extract_raw(income_ttm.get("incomeBeforeTax"))
    income_tax_expense = _extract_raw(income_ttm.get("incomeTaxExpense"))
    tax_rate = None
    if pretax_income and pretax_income > 0 and income_tax_expense is not None:
        tax_rate = income_tax_expense / pretax_income

    return {
        "revenue_base": _extract_raw(income_ttm.get("revenue")),
        "ebitda": _extract_raw(income_ttm.get("ebitda")),
        "diluted_shares": diluted_shares,
        "depreciation_and_amortization": _extract_raw(cashflow_ttm.get("depreciationAndAmortization")),
        "capital_expenditure": _extract_raw(cashflow_ttm.get("capitalExpenditure")),
        "net_working_capital": _extract_raw(balance_ttm.get("netWorkingCapital")),
        "tax_rate": tax_rate,
        "total_cash": _extract_raw(balance_ttm.get("cashAndCashEquivalents")),
        "total_debt": _extract_raw(balance_ttm.get("totalDebt")),
    }


def _fetch_fmp_record(url: str, symbol: str, api_key: str, timeout_seconds: int) -> Dict:
    response = requests.get(
        url,
        params={"symbol": symbol, "apikey": api_key},
        timeout=timeout_seconds,
        headers={"User-Agent": "Mozilla/5.0"},
    )
    response.raise_for_status()
    payload = response.json()
    if isinstance(payload, list) and payload:
        return payload[0]
    if isinstance(payload, dict) and payload:
        return payload
    raise ValueError(f"No FMP data returned for {symbol}.")


def _fetch_first_fmp_record(url: str, symbols: List[str], api_key: str, timeout_seconds: int, optional: bool = False) -> Dict:
    last_error = None
    for symbol in symbols:
        try:
            return _fetch_fmp_record(url, symbol, api_key, timeout_seconds)
        except Exception as exc:
            last_error = exc
    if optional:
        return {}
    if last_error:
        raise last_error
    raise ValueError("No FMP data returned for any symbol candidate.")
