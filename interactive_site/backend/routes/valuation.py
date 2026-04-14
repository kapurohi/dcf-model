from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from backend.models.schemas import ValuationRequest, ValuationResponse
from backend.services.valuation_service import build_valuation_response

router = APIRouter(prefix="/api/valuation", tags=["valuation"])


@router.get("/{symbol}", response_model=ValuationResponse)
def get_valuation(symbol: str, exchange: str | None = Query(default=None)) -> ValuationResponse:
    try:
        payload = build_valuation_response(symbol, exchange_code=exchange)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to value {symbol.upper()} right now. Try again in a moment or choose a different listing.",
        ) from exc
    return ValuationResponse(**payload)


@router.post("/{symbol}", response_model=ValuationResponse)
def post_valuation(symbol: str, request: ValuationRequest, exchange: str | None = Query(default=None)) -> ValuationResponse:
    try:
        payload = build_valuation_response(symbol, request=request, exchange_code=exchange)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to value {symbol.upper()} right now. Try again in a moment or choose a different listing.",
        ) from exc
    return ValuationResponse(**payload)
