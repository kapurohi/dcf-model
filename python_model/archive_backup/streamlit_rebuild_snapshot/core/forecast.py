from __future__ import annotations

import pandas as pd

from data.models import CompanyInputs, ScenarioConfig


def build_forecast(company: CompanyInputs, scenario: ScenarioConfig) -> pd.DataFrame:
    records = []
    prior_revenue = company.revenue_base
    prior_nwc = company.base_nwc

    for assumption in scenario.assumptions:
        revenue = prior_revenue * (1 + assumption.revenue_growth)
        ebitda = revenue * assumption.ebitda_margin
        da = revenue * assumption.da_percent
        ebit = ebitda - da
        nopat = ebit * (1 - assumption.tax_rate)
        capex = revenue * assumption.capex_percent
        nwc = revenue * assumption.nwc_percent
        delta_nwc = nwc - prior_nwc
        ufcf = nopat + da - capex - delta_nwc

        records.append(
            {
                "Year": assumption.year,
                "Revenue Growth": assumption.revenue_growth,
                "Revenue": revenue,
                "EBITDA Margin": assumption.ebitda_margin,
                "EBITDA": ebitda,
                "D&A %": assumption.da_percent,
                "D&A": da,
                "EBIT": ebit,
                "Tax Rate": assumption.tax_rate,
                "NOPAT": nopat,
                "CapEx %": assumption.capex_percent,
                "CapEx": capex,
                "NWC %": assumption.nwc_percent,
                "NWC": nwc,
                "Change in NWC": delta_nwc,
                "UFCF": ufcf,
            }
        )
        prior_revenue = revenue
        prior_nwc = nwc

    return pd.DataFrame(records)
