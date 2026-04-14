import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api";

export async function GET(request, context) {
  const { symbol } = await context.params;
  const { searchParams } = new URL(request.url);
  const exchange = searchParams.get("exchange");
  const upstreamUrl = new URL(`${API_BASE_URL}/api/valuation/${encodeURIComponent(symbol)}`);
  if (exchange) upstreamUrl.searchParams.set("exchange", exchange);
  const response = await fetch(upstreamUrl.toString(), {
    cache: "no-store",
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request, context) {
  const { symbol } = await context.params;
  const { searchParams } = new URL(request.url);
  const exchange = searchParams.get("exchange");
  const body = await request.text();
  const upstreamUrl = new URL(`${API_BASE_URL}/api/valuation/${encodeURIComponent(symbol)}`);
  if (exchange) upstreamUrl.searchParams.set("exchange", exchange);
  const response = await fetch(upstreamUrl.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
