export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function fetchSearchSuggestions(query, limit = 8) {
  const response = await fetch(`/api/proxy/search?query=${encodeURIComponent(query)}&limit=${limit}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.detail || "Search request failed.");
  }
  return response.json();
}

export async function fetchCompany(symbol, exchangeCode = "") {
  const response = await fetch(appendExchange(`/api/proxy/company/${encodeURIComponent(symbol)}`, exchangeCode), {
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.detail || `Failed to load ${symbol}.`);
  }
  return response.json();
}

function appendExchange(url, exchangeCode) {
  if (!exchangeCode) return url;
  const suffix = `exchange=${encodeURIComponent(exchangeCode)}`;
  return url.includes("?") ? `${url}&${suffix}` : `${url}?${suffix}`;
}

export async function fetchValuation(symbol, payload = null, exchangeCode = "") {
  const response = await fetch(appendExchange(`/api/proxy/valuation/${encodeURIComponent(symbol)}`, exchangeCode), {
    method: payload ? "POST" : "GET",
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.detail || `Failed to value ${symbol}.`);
  }
  return data;
}
