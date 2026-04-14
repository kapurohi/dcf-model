from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from backend.models.schemas import SearchResponse, SearchSuggestion
from backend.services.search_service import search_public_companies

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("", response_model=SearchResponse)
def search_companies(query: str = Query(..., min_length=1), limit: int = Query(10, ge=1, le=25)) -> SearchResponse:
    try:
        suggestions = search_public_companies(query, limit)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return SearchResponse(query=query, suggestions=[SearchSuggestion(**item) for item in suggestions])
