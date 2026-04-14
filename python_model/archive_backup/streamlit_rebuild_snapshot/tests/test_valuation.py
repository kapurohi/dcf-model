import pytest

from core.valuation import calculate_discount_factors, calculate_terminal_value, run_dcf
from data.models import CompanyInputs, ScenarioConfig, YearAssumption


@pytest.fixture
def company() -> CompanyInputs:
    return CompanyInputs(
        ticker="TEST",
        company_name="Test Co",
        current_price=10.0,
        revenue_base=100.0,
        base_nwc=5.0,
        net_debt=20.0,
        non_operating_assets=2.0,
        diluted_shares_outstanding=10.0,
    )


@pytest.fixture
def scenario() -> ScenarioConfig:
    assumptions = [
        YearAssumption(year=1, revenue_growth=0.10, ebitda_margin=0.30, da_percent=0.05, capex_percent=0.04, nwc_percent=0.06, tax_rate=0.25),
        YearAssumption(year=2, revenue_growth=0.08, ebitda_margin=0.31, da_percent=0.05, capex_percent=0.04, nwc_percent=0.06, tax_rate=0.25),
    ]
    return ScenarioConfig(name="Base", wacc=0.10, terminal_growth=0.03, assumptions=assumptions)


def test_discount_factors() -> None:
    assert [round(value, 4) for value in calculate_discount_factors(2, 0.10)] == [0.9091, 0.8264]


def test_terminal_value_formula() -> None:
    assert round(calculate_terminal_value(100.0, 0.10, 0.03), 4) == 1471.4286


def test_run_dcf_outputs(company: CompanyInputs, scenario: ScenarioConfig) -> None:
    result = run_dcf(company, scenario)
    assert result.enterprise_value > 0
    assert result.equity_value == pytest.approx(result.enterprise_value - company.net_debt + company.non_operating_assets)
    assert result.implied_share_price == pytest.approx(result.equity_value / company.diluted_shares_outstanding)


def test_invalid_terminal_growth_blocked(company: CompanyInputs, scenario: ScenarioConfig) -> None:
    bad_scenario = ScenarioConfig(name="Base", wacc=0.03, terminal_growth=0.03, assumptions=scenario.assumptions)
    with pytest.raises(ValueError):
        run_dcf(company, bad_scenario)
