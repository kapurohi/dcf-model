from __future__ import annotations

from typing import Optional


def format_currency(value: Optional[float], decimals: int = 0) -> str:
    if value is None:
        return "N/A"
    return f"${value:,.{decimals}f}"


def format_percent(value: Optional[float], decimals: int = 1) -> str:
    if value is None:
        return "N/A"
    return f"{value * 100:,.{decimals}f}%"


def format_multiple(value: Optional[float], decimals: int = 1) -> str:
    if value is None:
        return "N/A"
    return f"{value:,.{decimals}f}x"
