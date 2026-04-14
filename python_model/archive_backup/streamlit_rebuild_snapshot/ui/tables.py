from __future__ import annotations

import pandas as pd
import streamlit as st


def _format_table(df: pd.DataFrame, percent_columns: list[str]) -> pd.io.formats.style.Styler:
    currency_like = {column: "${:,.0f}" for column in df.columns if column not in {"Year", *percent_columns, "Metric", "Scenario"}}
    percent_like = {column: "{:.1%}" for column in percent_columns}
    return df.style.format({**currency_like, **percent_like})


def render_forecast_table(forecast_df: pd.DataFrame) -> None:
    st.markdown("### Forecast Operating Model")
    percent_columns = ["Revenue Growth", "EBITDA Margin", "D&A %", "Tax Rate", "CapEx %", "NWC %", "Discount Factor"]
    st.dataframe(_format_table(forecast_df, percent_columns), use_container_width=True)


def render_valuation_bridge(bridge_df: pd.DataFrame) -> None:
    st.markdown("### Valuation Bridge")
    st.dataframe(bridge_df.style.format({"Value": "${:,.0f}"}), use_container_width=True)


def render_scenario_summary(summary_df: pd.DataFrame) -> None:
    st.markdown("### Scenario Comparison")
    st.dataframe(
        summary_df.style.format(
            {
                "WACC": "{:.1%}",
                "Terminal Growth": "{:.1%}",
                "Enterprise Value": "${:,.0f}",
                "Equity Value": "${:,.0f}",
                "Implied Share Price": "${:,.2f}",
            }
        ),
        use_container_width=True,
    )


def render_diagnostics(errors: list[str], warnings: list[str], notes: list[str]) -> None:
    st.markdown("### Diagnostics")
    if errors:
        for item in errors:
            st.error(item)
    if warnings:
        for item in warnings:
            st.warning(item)
    if notes:
        for item in notes:
            st.info(item)
    if not any([errors, warnings, notes]):
        st.success("No diagnostics flagged.")
