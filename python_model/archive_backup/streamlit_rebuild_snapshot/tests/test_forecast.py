from data.models import CompanyInputs, ScenarioConfig, YearAssumption
from core.forecast import build_forecast


def sample_company() -> CompanyInputs:
    return CompanyInputs(
        ticker="TEST",
        company_name="Test Co",
        current_price=10.0,
        revenue_base=100.0,
        base_nwc=5.0,
        net_debt=20.0,
        non_operating_assets=0.0,
        diluted_shares_outstanding=10.0,
    )


def test_forecast_builds_verified_operating_bridge() -> None:
    scenario = ScenarioConfig(
        name="Base",
        wacc=0.10,
        terminal_growth=0.03,
        assumptions=[
            YearAssumption(year=1, revenue_growth=0.10, ebitda_margin=0.30, da_percent=0.05, capex_percent=0.04, nwc_percent=0.06, tax_rate=0.25)
        ],
    )
    forecast = build_forecast(sample_company(), scenario)
    row = forecast.iloc[0]

    assert round(row["Revenue"], 2) == 110.00
    assert round(row["EBITDA"], 2) == 33.00
    assert round(row["D&A"], 2) == 5.50
    assert round(row["EBIT"], 2) == 27.50
    assert round(row["NOPAT"], 4) == 20.6250
    assert round(row["NWC"], 2) == 6.60
    assert round(row["Change in NWC"], 2) == 1.60
    assert round(row["UFCF"], 4) == 20.1250
