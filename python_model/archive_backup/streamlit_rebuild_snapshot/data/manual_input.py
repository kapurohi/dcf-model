from __future__ import annotations

from data.models import CompanyInputs, ScenarioConfig, YearAssumption


def default_company_inputs() -> CompanyInputs:
    return CompanyInputs(
        ticker="AAPL",
        company_name="Apple Inc.",
        current_price=195.00,
        revenue_base=391_035_000_000.0,
        base_nwc=24_400_000_000.0,
        net_debt=81_000_000_000.0,
        non_operating_assets=28_000_000_000.0,
        diluted_shares_outstanding=15_300_000_000.0,
    )


def default_scenario_config(name: str, years: int = 5) -> ScenarioConfig:
    normalized = name.title()
    presets = {
        "Bear": {
            "wacc": 0.095,
            "terminal_growth": 0.020,
            "growth": [0.045, 0.040, 0.035, 0.030, 0.025],
            "margin": [0.305, 0.302, 0.300, 0.298, 0.295],
        },
        "Base": {
            "wacc": 0.085,
            "terminal_growth": 0.025,
            "growth": [0.060, 0.055, 0.050, 0.045, 0.040],
            "margin": [0.320, 0.322, 0.323, 0.323, 0.322],
        },
        "Bull": {
            "wacc": 0.078,
            "terminal_growth": 0.030,
            "growth": [0.080, 0.072, 0.064, 0.056, 0.048],
            "margin": [0.332, 0.335, 0.337, 0.338, 0.338],
        },
    }
    preset = presets.get(normalized, presets["Base"])

    def pad(values: list[float], fill: float) -> list[float]:
        if years <= len(values):
            return values[:years]
        return values + [fill] * (years - len(values))

    growth = pad(preset["growth"], preset["growth"][-1])
    margin = pad(preset["margin"], preset["margin"][-1])
    da = [0.030] * years
    capex = [0.040] * years
    nwc = [0.062] * years
    tax = [0.210] * years

    assumptions = [
        YearAssumption(
            year=index + 1,
            revenue_growth=growth[index],
            ebitda_margin=margin[index],
            da_percent=da[index],
            capex_percent=capex[index],
            nwc_percent=nwc[index],
            tax_rate=tax[index],
        )
        for index in range(years)
    ]

    return ScenarioConfig(
        name=normalized,
        wacc=preset["wacc"],
        terminal_growth=preset["terminal_growth"],
        assumptions=assumptions,
    )
