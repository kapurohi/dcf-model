from data.models import CompanyInputs, ScenarioConfig, YearAssumption
from utils.validation import validate_company_inputs, validate_scenario_config


def test_company_validation_flags_zero_revenue() -> None:
    company = CompanyInputs(
        ticker="TEST",
        company_name="Test Co",
        current_price=10.0,
        revenue_base=0.0,
        base_nwc=5.0,
        net_debt=0.0,
        non_operating_assets=0.0,
        diluted_shares_outstanding=10.0,
    )
    assert "Base revenue must be greater than zero." in validate_company_inputs(company)


def test_scenario_validation_flags_invalid_wacc_terminal_growth() -> None:
    scenario = ScenarioConfig(
        name="Base",
        wacc=0.02,
        terminal_growth=0.03,
        assumptions=[
            YearAssumption(year=1, revenue_growth=0.04, ebitda_margin=0.25, da_percent=0.03, capex_percent=0.03, nwc_percent=0.05, tax_rate=0.21)
        ],
    )
    assert "WACC must be greater than terminal growth." in validate_scenario_config(scenario)
