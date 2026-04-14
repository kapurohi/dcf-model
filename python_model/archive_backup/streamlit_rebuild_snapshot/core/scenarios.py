from __future__ import annotations

from typing import Dict, Iterable

from data.manual_input import default_scenario_config
from data.models import ScenarioConfig, SCENARIO_NAMES


def build_scenario_library(years: int) -> Dict[str, ScenarioConfig]:
    return {name: default_scenario_config(name, years) for name in SCENARIO_NAMES}


def scenario_names() -> Iterable[str]:
    return SCENARIO_NAMES
