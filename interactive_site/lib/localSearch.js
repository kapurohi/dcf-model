// lib/stockSearch.js
// Search scoring engine and NLP query parser.
// Scoring tiers (lower = better match):
//   0  exact ticker
//   1  ticker starts-with
//   2  name starts-with
//   3  any word in name starts-with query
//   4  ticker contains
//   5  name contains
//   6  fuzzy ticker (Levenshtein 1)
//   7  fuzzy name word (Levenshtein ≤2)
//   99 no match

import { STOCKS, ALIASES, TICKER_DISPLAY_NAME, EXCHANGE_DISPLAY } from "@/lib/stocksData";
export { STOCKS } from "@/lib/stocksData";

const EXCHANGE_CURRENCY = {
  us: "USD",
  uk: "GBP",
  de: "EUR",
  fr: "EUR",
  hk: "HKD",
  in: "INR",
  jp: "JPY",
  au: "AUD",
  sg: "SGD",
};

// ── Levenshtein distance ──────────────────────────────────────────────────
function lev(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 3) return 99; // fast reject
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

// ── Score a single stock against a query ─────────────────────────────────
export function scoreMatch(stock, q) {
  const tl   = stock.ticker.toLowerCase();
  const nl   = stock.name.toLowerCase();
  const words = nl.split(/[\s\-&(),.]+/).filter(w => w.length >= 2);

  if (tl === q)                                            return 0;
  if (tl.startsWith(q))                                   return 1;
  if (nl.startsWith(q))                                   return 2;
  if (words.some(w => w.startsWith(q)))                   return 3;
  if (tl.includes(q))                                     return 4;
  if (nl.includes(q))                                     return 5;

  // Fuzzy — only for queries 3+ chars to avoid false positives
  if (q.length >= 3) {
    if (lev(tl, q) === 1)                                 return 6;
    if (words.some(w => w.length >= 3 && lev(w, q) <= (q.length <= 4 ? 1 : 2))) return 7;
  }

  return 99;
}

// ── Multi-word query scoring ──────────────────────────────────────────────
// "hdfc bank" should score higher than just "hdfc" alone
function scoreMultiWord(stock, words) {
  if (words.length <= 1) return scoreMatch(stock, words[0] ?? "");
  const scores = words.map(w => scoreMatch(stock, w));
  const best   = Math.min(...scores);
  const allMatch = scores.every(s => s < 99);
  // Bonus if all words match: multi-word full match scores better
  return allMatch ? best - 0.5 : best;
}

// ── Main search function ──────────────────────────────────────────────────
export function searchStocks(query, limit = 50) {
  if (!query) return [];
  const q     = query.trim().toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length >= 1);

  return STOCKS
    .map(s => {
      const score = words.length > 1
        ? scoreMultiWord(s, words)
        : scoreMatch(s, q);
      return { s, score };
    })
    .filter(({ score }) => score < 99)
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      // Tiebreak: marketCap weight (mega > large > mid > small)
      const capW = { mega: 0, large: 1, mid: 2, small: 3 };
      const capA = capW[a.s.marketCap] ?? 4;
      const capB = capW[b.s.marketCap] ?? 4;
      if (capA !== capB) return capA - capB;
      return a.s.name.localeCompare(b.s.name);
    })
    .slice(0, limit)
    .map(({ s }) => ({
      ticker:       s.ticker,
      name:         s.name,
      exchange:     EXCHANGE_DISPLAY[s.exchange] ?? s.exchange ?? "",
      exchangeCode: s.exchange,
      currency:     EXCHANGE_CURRENCY[s.exchange] ?? "USD",
      sector:       s.sector,
      type:         s.type,
      country:      s.country,
      local:        true,
    }));
}

// ── Fuzzy ticker suggestions ("Did you mean?") ───────────────────────────
export function fuzzyMatchTicker(input) {
  return fuzzySearchTickers(input, 1)[0] ?? null;
}

export function fuzzySearchTickers(input, limit = 3) {
  if (!input || input.length < 3) return [];
  const q = input.toLowerCase().trim();
  if (!q.includes(" ") && q.length <= 6) return [];

  const maxDist = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3;
  const seen    = new Set();
  const scored  = [];

  for (const [alias, ticker] of Object.entries(ALIASES)) {
    if (alias.includes(" ") && !q.includes(" ")) continue;
    const dist = lev(q, alias);
    if (dist > 0 && dist <= maxDist && !seen.has(ticker)) {
      seen.add(ticker);
      scored.push({ ticker, alias, dist });
    }
  }

  return scored
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map(({ ticker, alias, dist }) => ({
      ticker,
      displayName:  TICKER_DISPLAY_NAME[ticker] ?? ticker,
      matchedAlias: alias,
      confidence:   dist === 1 ? "high" : "medium",
    }));
}

// ── NLP query parser ──────────────────────────────────────────────────────
const RANGE_KEYWORDS = {
  "today":"1D","1 day":"1D","one day":"1D","daily":"1D",
  "this week":"5D","5 day":"5D","five day":"5D","past week":"5D","last week":"5D",
  "1 month":"1M","one month":"1M","past month":"1M","last month":"1M","30 days":"1M",
  "6 month":"6M","six month":"6M","half year":"6M","past 6 months":"6M",
  "this year":"YTD","year to date":"YTD","ytd":"YTD",
  "1 year":"1Y","one year":"1Y","past year":"1Y","last year":"1Y","12 months":"1Y",
  "5 year":"5Y","five year":"5Y","past 5 years":"5Y",
  "all time":"MAX","max":"MAX","maximum":"MAX","history":"MAX","historical":"MAX",
};

export function parseNLQuery(input) {
  const raw = input.trim();
  const q   = raw.toLowerCase()
    .replace(/'s|\u2019s/g, "")
    .replace(/[^a-z0-9\s.]/g, " ")
    .replace(/\s+/g, " ");

  // 1. Check aliases (longest first)
  let ticker = null;
  const sortedAliases = Object.entries(ALIASES).sort((a,b) => b[0].length - a[0].length);
  for (const [alias, t] of sortedAliases) {
    if (q.includes(alias)) { ticker = t; break; }
  }

  // 2. Check for explicit ticker symbols (AAPL, BT.A, RELIANCE, 0700, 9618)
  if (!ticker) {
    for (const w of raw.trim().split(/\s+/)) {
      if (/^[A-Z]{1,10}(\.[A-Z]{1,2})?$/.test(w) ||
          /^[0-9]{4}$/.test(w)) { ticker = w; break; }
    }
  }

  const now      = new Date();
  const thisYear = now.getFullYear();
  const pad      = n => String(n).padStart(2, "0");
  const toD1     = y => `${y}0101`;
  const toD2     = y => `${y}1231`;
  const lastTradingDay = () => {
    const d = new Date(now);
    const day = d.getUTCDay();
    if (day === 0) d.setUTCDate(d.getUTCDate() - 2);
    if (day === 6) d.setUTCDate(d.getUTCDate() - 1);
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}`;
  };

  function resolveYear(phrase) {
    phrase = phrase.trim();
    if (/^\d{4}$/.test(phrase))     return parseInt(phrase);
    if (phrase === "this year")     return thisYear;
    if (phrase === "last year")     return thisYear - 1;
    if (phrase === "two years ago") return thisYear - 2;
    const m = phrase.match(/(\d+)\s+years?\s+ago/);
    if (m) return thisYear - parseInt(m[1]);
    return null;
  }

  function extractCustomDates(q) {
    const fromTo = q.match(/(?:from|between)\s+([\w\s]+?)\s+(?:to|and|until|through)\s+([\w\s]+?)(?:\s|$)/);
    if (fromTo) {
      const y1 = resolveYear(fromTo[1].trim()), y2 = resolveYear(fromTo[2].trim());
      if (y1 && y2) return { d1: toD1(Math.min(y1,y2)), d2: toD2(Math.max(y1,y2)) };
    }
    const inYear   = q.match(/(?:in|during)\s+(\d{4})/);
    if (inYear)    { const y = parseInt(inYear[1]); return { d1: toD1(y), d2: toD2(y) }; }
    const bareYear = q.match(/\b(20[0-2]\d)\b/);
    if (bareYear)  { const y = parseInt(bareYear[1]); return { d1: toD1(y), d2: toD2(y) }; }
    return null;
  }

  let range = null, customD1 = null, customD2 = null;
  const hasRelational = /\b(after|before|between|from|during|in|until|since)\b/.test(q);
  if (hasRelational || /\b20[0-2]\d\b/.test(q)) {
    const dates = extractCustomDates(q);
    if (dates) { customD1 = dates.d1; customD2 = dates.d2; }
  }
  if (!customD1) {
    for (const [kw, r] of Object.entries(RANGE_KEYWORDS).sort((a,b) => b[0].length - a[0].length)) {
      if (q.includes(kw)) { range = r; break; }
    }
  }

  let suggestions = [];
  if (!ticker) {
    const stripped = q
      .replace(/\b(show|me|tell|about|what|is|how|has|the|stock|price|chart|performance|of|for|over|in|last|past|this|next|from|to|and|between)\b/g, " ")
      .replace(/\d+\s*(month|week|year|day)s?/g, " ")
      .replace(/\s+/g, " ").trim();
    const words = stripped.split(" ").filter(w => w.length >= 2);
    const mainWord = words[0] ?? stripped;

    // Path A: short, looks like a ticker → navigate directly
    if (words.length === 1 && mainWord.length <= 10 &&
        (/^[a-z]{2,10}$/.test(mainWord) || /^[0-9]{4}$/.test(mainWord))) {
      ticker = mainWord.toUpperCase();
    } else {
      // Path B: fuzzy multi-word suggestions
      const seenTickers = new Set();
      for (const c of [stripped, ...words.filter(w => w.length >= 3)]) {
        for (const match of fuzzySearchTickers(c, 3)) {
          if (!seenTickers.has(match.ticker)) {
            seenTickers.add(match.ticker);
            suggestions.push(match);
          }
        }
        if (suggestions.length >= 3) break;
      }
    }
  }

  return { ticker, range, customD1, customD2, suggestions };
}
