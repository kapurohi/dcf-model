from __future__ import annotations

from dataclasses import replace
from typing import Optional, Tuple

import streamlit as st

from core.scenarios import build_scenario_library, scenario_names
from data.csv_loader import load_company_csv, load_scenario_csv
from data.manual_input import default_company_inputs
from data.models import CompanyInputs, ScenarioConfig, YearAssumption
from data.market_data import fetch_market_snapshot


def render_sidebar() -> Tuple[CompanyInputs, ScenarioConfig, Optional[str], Optional[str]]:
    st.sidebar.markdown("## Valuation Controls")
    years = st.sidebar.slider("Projection Years", min_value=3, max_value=10, value=5)
    scenario_library = build_scenario_library(years)
    selected_scenario_name = st.sidebar.selectbox("Scenario", options=list(scenario_names()), index=1)
    scenario = scenario_library[selected_scenario_name]

    st.sidebar.markdown("### Company Inputs")
    defaults = default_company_inputs()
    ticker = st.sidebar.text_input("Ticker", value=defaults.ticker).upper().strip()
    company_name = st.sidebar.text_input("Company Name", value=defaults.company_name)
    fetch_live = st.sidebar.checkbox("Refresh live market snapshot", value=False)

    market_note = None
    live_price = defaults.current_price
    if fetch_live and ticker:
        snapshot, error = fetch_market_snapshot(ticker)
        if snapshot:
            live_price = snapshot.get("current_price", defaults.current_price) or defaults.current_price
            market_note = f"Live price pulled for {ticker}."
        else:
            market_note = error

    current_price = st.sidebar.number_input("Current Share Price", min_value=0.0, value=float(live_price), step=1.0)
    revenue_base = st.sidebar.number_input("Base Revenue ($)", min_value=0.0, value=float(defaults.revenue_base), step=1_000_000.0, format="%.0f")
    base_nwc = st.sidebar.number_input("Base NWC ($)", value=float(defaults.base_nwc), step=1_000_000.0, format="%.0f")
    net_debt = st.sidebar.number_input("Net Debt ($)", value=float(defaults.net_debt), step=1_000_000.0, format="%.0f")
    non_operating_assets = st.sidebar.number_input("Non-operating Assets ($)", value=float(defaults.non_operating_assets), step=1_000_000.0, format="%.0f")
    diluted_shares = st.sidebar.number_input("Diluted Shares Outstanding", min_value=0.0, value=float(defaults.diluted_shares_outstanding), step=1_000_000.0, format="%.0f")

    company = CompanyInputs(
        ticker=ticker,
        company_name=company_name,
        current_price=current_price,
        revenue_base=revenue_base,
        base_nwc=base_nwc,
        net_debt=net_debt,
        non_operating_assets=non_operating_assets,
        diluted_shares_outstanding=diluted_shares,
    )

    st.sidebar.markdown("### CSV Overrides")
    company_csv = st.sidebar.file_uploader("Company CSV", type=["csv"], key="company_csv")
    if company_csv is not None:
        loaded_company, company_error = load_company_csv(company_csv.getvalue())
        if loaded_company is not None:
            company = loaded_company
        else:
            market_note = company_error

    st.sidebar.markdown("### Valuation Assumptions")
    wacc = st.sidebar.number_input("WACC (%)", min_value=1.0, max_value=25.0, value=float(scenario.wacc * 100), step=0.1) / 100
    terminal_growth = st.sidebar.number_input("Terminal Growth (%)", min_value=-2.0, max_value=8.0, value=float(scenario.terminal_growth * 100), step=0.1) / 100

    st.sidebar.markdown("### Forecast Drivers")
    edited_assumptions = []
    for assumption in scenario.assumptions:
        with st.sidebar.expander(f"Year {assumption.year}", expanded=assumption.year == 1):
            edited_assumptions.append(
                YearAssumption(
                    year=assumption.year,
                    revenue_growth=st.number_input(f"Revenue Growth Y{assumption.year} (%)", value=float(assumption.revenue_growth * 100), step=0.1, key=f"growth_{assumption.year}") / 100,
                    ebitda_margin=st.number_input(f"EBITDA Margin Y{assumption.year} (%)", value=float(assumption.ebitda_margin * 100), step=0.1, key=f"margin_{assumption.year}") / 100,
                    da_percent=st.number_input(f"D&A Y{assumption.year} (%)", value=float(assumption.da_percent * 100), step=0.1, key=f"da_{assumption.year}") / 100,
                    capex_percent=st.number_input(f"CapEx Y{assumption.year} (%)", value=float(assumption.capex_percent * 100), step=0.1, key=f"capex_{assumption.year}") / 100,
                    nwc_percent=st.number_input(f"NWC Y{assumption.year} (%)", value=float(assumption.nwc_percent * 100), step=0.1, key=f"nwc_{assumption.year}") / 100,
                    tax_rate=st.number_input(f"Tax Rate Y{assumption.year} (%)", min_value=0.0, max_value=99.0, value=float(assumption.tax_rate * 100), step=0.1, key=f"tax_{assumption.year}") / 100,
                )
            )

    scenario = replace(scenario, wacc=wacc, terminal_growth=terminal_growth, assumptions=edited_assumptions)

    scenario_csv = st.sidebar.file_uploader("Scenario CSV", type=["csv"], key="scenario_csv")
    scenario_note = None
    if scenario_csv is not None:
        loaded_scenario, scenario_error = load_scenario_csv(scenario_csv.getvalue(), scenario.name, scenario.wacc, scenario.terminal_growth)
        if loaded_scenario is not None:
            scenario = loaded_scenario
            scenario_note = "Scenario drivers loaded from CSV."
        else:
            scenario_note = scenario_error

    return company, scenario, market_note, scenario_note
