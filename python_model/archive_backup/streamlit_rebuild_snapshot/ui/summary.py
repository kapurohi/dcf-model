from __future__ import annotations

import streamlit as st

from data.models import CompanyInputs, ValuationResult
from utils.formatting import format_currency, format_multiple, format_percent


def render_summary(company: CompanyInputs, result: ValuationResult) -> None:
    st.markdown("## Executive Summary")
    col1, col2, col3, col4, col5 = st.columns(5)
    col1.metric("Enterprise Value", format_currency(result.enterprise_value))
    col2.metric("Equity Value", format_currency(result.equity_value))
    col3.metric("Implied Share Price", format_currency(result.implied_share_price, 2))
    col4.metric("Current Share Price", format_currency(company.current_price, 2))
    col5.metric("Upside / Downside", format_percent(result.metadata.get("upside_downside", 0.0), 1))

    meta1, meta2, meta3 = st.columns(3)
    meta1.metric("PV of Forecast UFCF", format_currency(result.present_value_of_forecast))
    meta2.metric("PV of Terminal Value", format_currency(result.terminal_value_pv))
    meta3.metric("Implied Terminal EV / EBITDA", format_multiple(result.metadata.get("terminal_ebitda_multiple"), 1))
