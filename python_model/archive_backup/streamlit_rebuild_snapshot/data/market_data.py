from __future__ import annotations

from typing import Dict, Optional, Tuple

import requests

API_TIMEOUT_SECONDS = 10


def fetch_market_snapshot(ticker: str) -> Tuple[Optional[Dict[str, float]], Optional[str]]:
    url = f"https://query1.finance.yahoo.com/v7/finance/quote?symbols={ticker}"
    try:
        response = requests.get(url, timeout=API_TIMEOUT_SECONDS)
        response.raise_for_status()
        payload = response.json()
        results = payload.get("quoteResponse", {}).get("result", [])
        if not results:
            return None, f"No market data found for {ticker}."
        result = results[0]
        return {
            "current_price": float(result.get("regularMarketPrice") or 0.0),
            "market_cap": float(result.get("marketCap") or 0.0),
        }, None
    except Exception as exc:
        return None, f"Live data unavailable: {exc}"
