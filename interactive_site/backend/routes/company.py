from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from backend.models.schemas import CompanyOverviewResponse
from backend.services.market_data_service import fetch_company_overview

router = APIRouter(prefix="/api/company", tags=["company"])


@router.get("/{symbol}", response_model=CompanyOverviewResponse)
def get_company(symbol: str, exchange: str | None = Query(default=None)) -> CompanyOverviewResponse:
    try:
        overview = fetch_company_overview(symbol, exchange_code=exchange)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to load {symbol.upper()} right now. Try again in a moment or choose a different listing.",
        ) from exc
    return CompanyOverviewResponse(**overview)
