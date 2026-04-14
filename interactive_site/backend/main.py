from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.company import router as company_router
from backend.routes.search import router as search_router
from backend.routes.valuation import router as valuation_router

app = FastAPI(title="DCF Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(search_router)
app.include_router(company_router)
app.include_router(valuation_router)
