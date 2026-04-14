from __future__ import annotations

import streamlit as st

from core.valuation import run_dcf
from ui.charts import render_operating_chart, render_scenario_chart, render_value_composition_chart
from ui.sensitivity import render_sensitivity_table
from ui.sidebar import render_sidebar
from ui.summary import render_summary
from ui.tables import render_diagnostics, render_forecast_table, render_scenario_summary, render_valuation_bridge
from utils.validation import validate_company_inputs, validate_scenario_config


st.set_page_config(
    page_title="Professional DCF Platform",
    page_icon=":bar_chart:",
    layout="wide",
)

st.markdown(
    """
    <style>
    .stApp {
        background: radial-gradient(circle at top left, #f6f1e7 0%, #efe8dc 35%, #e5ddd1 100%);
        color: #1f1a17;
    }
    .block-container {
        padding-top: 1.5rem;
        padding-bottom: 2rem;
        max-width: 1400px;
    }
    h1, h2, h3 {
        color: #231a12;
        letter-spacing: 0.01em;
    }
    [data-testid="stMetricValue"] {
        color: #2d4c3b;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

st.title("Professional DCF Valuation Platform")
st.caption("A reusable institutional-style DCF engine with scenario analysis, sensitivity, and valuation diagnostics.")

company, scenario, market_note, scenario_note = render_sidebar()
blocking_errors = validate_company_inputs(company) + validate_scenario_config(scenario)

if market_note:
    st.info(market_note)
if scenario_note:
    st.info(scenario_note)

if blocking_errors:
    st.error("Blocking model issues detected. Resolve the items below before the valuation will run.")
    render_diagnostics(blocking_errors, [], [])
    st.stop()

result = run_dcf(company, scenario)
render_summary(company, result)

overview_tab, forecast_tab, valuation_tab, sensitivity_tab, diagnostics_tab = st.tabs(
    ["Overview", "Forecast Model", "Valuation", "Sensitivity", "Diagnostics"]
)

with overview_tab:
    left, right = st.columns([1.25, 1])
    with left:
        render_operating_chart(result.forecast_df)
    with right:
        render_value_composition_chart(result.valuation_bridge_df)
    render_scenario_chart(result.scenario_summary)

with forecast_tab:
    render_forecast_table(result.forecast_df)

with valuation_tab:
    render_valuation_bridge(result.valuation_bridge_df)
    render_scenario_summary(result.scenario_summary)

with sensitivity_tab:
    render_sensitivity_table(result.sensitivity_table)

with diagnostics_tab:
    render_diagnostics(result.diagnostics.errors, result.diagnostics.warnings, result.diagnostics.notes)
