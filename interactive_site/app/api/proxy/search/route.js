import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api";
import { searchStocks } from "@/lib/localSearch";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const limit = searchParams.get("limit") || "8";
  const normalizedLimit = Math.max(1, Math.min(Number.parseInt(limit, 10) || 8, 25));

  try {
    const response = await fetch(`${API_BASE_URL}/api/search?query=${encodeURIComponent(query)}&limit=${encodeURIComponent(limit)}`, {
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({}));

    if (response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }
  } catch {
    // Fall through to local fallback search.
  }

  const localSuggestions = searchStocks(query, normalizedLimit).map((item) => ({
    symbol: item.ticker,
    name: item.name,
    exchange: item.exchange || "",
    exchange_code: item.exchangeCode || item.exchange || "",
    currency: item.currency || "",
    type: item.type || "stock",
    region: item.country || "",
    source: "local",
  }));

  return NextResponse.json(
    {
      query,
      suggestions: localSuggestions,
      fallback: localSuggestions.length ? "local-search-index" : null,
    },
    { status: 200 },
  );
}
