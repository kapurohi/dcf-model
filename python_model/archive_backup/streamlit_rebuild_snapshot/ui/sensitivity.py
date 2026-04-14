from __future__ import annotations

import pandas as pd
import streamlit as st


def render_sensitivity_table(sensitivity_df: pd.DataFrame) -> None:
    st.markdown("### WACC vs Terminal Growth Sensitivity")
    display_df = sensitivity_df.copy()
    for column in display_df.columns:
        if column == "Terminal Growth":
            continue
        display_df[column] = display_df[column].map(lambda value: None if value is None else value["implied_share_price"])
    display_df = display_df.set_index("Terminal Growth")
    display_df.index = [f"{value:.1%}" for value in display_df.index]
    st.dataframe(display_df.style.format("${:,.2f}"), use_container_width=True)
