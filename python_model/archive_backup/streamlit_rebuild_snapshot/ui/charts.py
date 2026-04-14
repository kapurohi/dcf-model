from __future__ import annotations

import pandas as pd
import streamlit as st


def render_operating_chart(forecast_df: pd.DataFrame) -> None:
    st.markdown("### Revenue, EBITDA, and UFCF Trend")
    chart_df = forecast_df.set_index("Year")[["Revenue", "EBITDA", "UFCF"]]
    st.line_chart(chart_df)


def render_value_composition_chart(bridge_df: pd.DataFrame) -> None:
    st.markdown("### Enterprise Value Composition")
    chart_df = pd.DataFrame(
        {
            "Component": ["Forecast UFCF", "Terminal Value PV"],
            "Value": [bridge_df.iloc[0]["Value"], bridge_df.iloc[1]["Value"]],
        }
    ).set_index("Component")
    st.bar_chart(chart_df)


def render_scenario_chart(summary_df: pd.DataFrame) -> None:
    st.markdown("### Scenario Value Comparison")
    chart_df = summary_df.set_index("Scenario")[["Implied Share Price"]]
    st.bar_chart(chart_df)
