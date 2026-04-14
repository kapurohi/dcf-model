from __future__ import annotations

from typing import Dict, List, Optional

import requests

from python_model.data_api import get_data_source_config

YAHOO_SEARCH_URL = "https://query1.finance.yahoo.com/v1/finance/search"
FMP_SEARCH_URL = "https://financialmodelingprep.com/stable/search-symbol"

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

EXCHANGE_CODE_ALIASES = {
    "nasdaq": "us",
    "nyse": "us",
    "nyq": "us",
    "nms": "us",
    "ase": "us",
    "pcx": "us",
    "us": "us",
    "lse": "uk",
    "lse.": "uk",
    "uk": "uk",
    "xetra": "de",
    "ger": "de",
    "de": "de",
    "euronext": "fr",
    "par": "fr",
    "paris": "fr",
    "fr": "fr",
    "hkex": "hk",
    "hkg": "hk",
    "hong kong": "hk",
    "hk": "hk",
    "nse": "in",
    "nsei": "in",
    "bse": "in",
    "india": "in",
    "in": "in",
    "tse": "jp",
    "tyo": "jp",
    "japan": "jp",
    "jp": "jp",
    "asx": "au",
    "australia": "au",
    "au": "au",
    "sgx": "sg",
    "singapore": "sg",
    "sg": "sg",
}


def levenshtein_distance(left: str, right: str) -> int:
    if left == right:
        return 0
    if not left:
        return len(right)
    if not right:
        return len(left)
    if abs(len(left) - len(right)) > 4:
        return 99

    previous = list(range(len(right) + 1))
    for i, left_char in enumerate(left, start=1):
        current = [i]
        for j, right_char in enumerate(right, start=1):
            insert_cost = current[j - 1] + 1
            delete_cost = previous[j] + 1
            replace_cost = previous[j - 1] + (0 if left_char == right_char else 1)
            current.append(min(insert_cost, delete_cost, replace_cost))
        previous = current
    return previous[-1]


def score_search_match(query: str, symbol: str, name: str) -> float:
    q = query.lower().strip()
    symbol_l = symbol.lower().strip()
    name_l = name.lower().strip()
    words = [word for word in name_l.replace("-", " ").replace(".", " ").split() if word]

    if symbol_l == q:
        return 0.0
    if len(q) <= 2 and name_l.startswith(q):
        return 0.7
    if symbol_l.startswith(q):
        return 1.0
    if name_l.startswith(q):
        return 2.0
    if any(word.startswith(q) for word in words):
        return 3.0
    if q in symbol_l:
        return 4.0
    if q in name_l:
        return 5.0
    if len(q) >= 3 and levenshtein_distance(symbol_l, q) <= 1:
        return 6.0
    if len(q) >= 3 and any(levenshtein_distance(word, q) <= (1 if len(q) <= 4 else 2) for word in words if len(word) >= 3):
        return 7.0
    return 99.0


def _security_priority(quote_type: str) -> int:
    normalized = (quote_type or "").lower()
    if normalized in {"equity", "stock"}:
        return 0
    if normalized in {"etf", "fund"}:
        return 1
    return 2


def normalize_exchange_code(raw_exchange: str) -> str:
    normalized = (raw_exchange or "").strip().lower()
    if not normalized:
        return ""
    if normalized in EXCHANGE_CODE_ALIASES:
        return EXCHANGE_CODE_ALIASES[normalized]
    compact = normalized.replace(".", "").replace("-", " ")
    if compact in EXCHANGE_CODE_ALIASES:
        return EXCHANGE_CODE_ALIASES[compact]
    for key, code in EXCHANGE_CODE_ALIASES.items():
        if key in normalized:
            return code
    return ""


def normalize_yahoo_search_item(item: Dict, query: str, provider_rank: int) -> Optional[Dict]:
    symbol = str(item.get("symbol") or "").strip().upper()
    name = str(item.get("shortname") or item.get("longname") or "").strip()
    if not symbol or not name:
        return None
    exchange = item.get("exchDisp") or item.get("exchange") or ""
    exchange_code = normalize_exchange_code(str(exchange))
    return {
        "symbol": symbol,
        "name": name,
        "exchange": exchange,
        "exchange_code": exchange_code,
        "currency": item.get("currency") or CURRENCY_BY_EXCHANGE_CODE.get(exchange_code, ""),
        "type": item.get("quoteType") or "",
        "region": item.get("region") or "",
        "source": "yahoo",
        "score": score_search_match(query, symbol, name),
        "provider_rank": provider_rank,
        "type_priority": _security_priority(item.get("quoteType") or ""),
    }


def normalize_fmp_search_item(item: Dict, query: str, provider_rank: int) -> Optional[Dict]:
    symbol = str(item.get("symbol") or "").strip().upper()
    name = str(item.get("name") or "").strip()
    if not symbol or not name:
        return None
    exchange = item.get("exchangeShortName") or item.get("exchange") or ""
    exchange_code = normalize_exchange_code(str(exchange))
    return {
        "symbol": symbol,
        "name": name,
        "exchange": exchange,
        "exchange_code": exchange_code,
        "currency": item.get("currency") or CURRENCY_BY_EXCHANGE_CODE.get(exchange_code, ""),
        "type": item.get("type") or "",
        "region": item.get("country") or "",
        "source": "fmp",
        "score": score_search_match(query, symbol, name),
        "provider_rank": provider_rank,
        "type_priority": _security_priority(item.get("type") or ""),
    }


def fetch_yahoo_suggestions(query: str, limit: int) -> List[Dict]:
    cfg = get_data_source_config()
    response = requests.get(
        YAHOO_SEARCH_URL,
        params={"q": query, "quotesCount": limit, "newsCount": 0, "listsCount": 0, "enableFuzzyQuery": False},
        timeout=cfg.request_timeout_seconds,
        headers={"User-Agent": "Mozilla/5.0"},
    )
    response.raise_for_status()
    payload = response.json()
    quotes = payload.get("quotes", [])
    results = [normalize_yahoo_search_item(item, query, index) for index, item in enumerate(quotes)]
    return [item for item in results if item is not None]


def fetch_fmp_suggestions(query: str, limit: int) -> List[Dict]:
    cfg = get_data_source_config()
    if not cfg.fmp_api_key:
        return []
    response = requests.get(
        FMP_SEARCH_URL,
        params={"query": query, "limit": limit, "apikey": cfg.fmp_api_key},
        timeout=cfg.request_timeout_seconds,
        headers={"User-Agent": "Mozilla/5.0"},
    )
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, list):
        return []
    results = [normalize_fmp_search_item(item, query, index) for index, item in enumerate(payload)]
    return [item for item in results if item is not None]


def dedupe_ranked_results(results: List[Dict], limit: int) -> List[Dict]:
    seen: set[str] = set()
    deduped: List[Dict] = []
    for item in sorted(results, key=lambda row: (row["score"], row.get("type_priority", 2), row.get("provider_rank", 999), row["symbol"], row["name"])):
        key = f"{item['symbol']}::{item['exchange']}"
        if key in seen or item["score"] >= 99:
            continue
        seen.add(key)
        deduped.append(item)
        if len(deduped) >= limit:
            break
    return deduped


def search_public_companies(query: str, limit: int = 10) -> List[Dict]:
    cleaned = query.strip()
    if not cleaned:
        return []

    cfg = get_data_source_config()
    results: List[Dict] = []
    errors: List[str] = []

    ordered_sources = [cfg.primary, cfg.fallback]
    for source in ordered_sources:
        if source == "yahoo":
            try:
                results.extend(fetch_yahoo_suggestions(cleaned, limit * 3))
            except Exception as exc:
                errors.append(f"Yahoo search failed: {exc}")
        elif source == "fmp":
            try:
                results.extend(fetch_fmp_suggestions(cleaned, limit * 3))
            except Exception as exc:
                errors.append(f"FMP search failed: {exc}")

    ranked = dedupe_ranked_results(results, limit)
    if ranked:
        return ranked
    if errors:
        raise ValueError(" | ".join(errors))
    return []
