"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { fetchSearchSuggestions } from "@/lib/api";

export default function SearchHero({ compact, loading, onEvaluate, onReset, selection, error }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchError, setSearchError] = useState("");
  const [pending, setPending] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
        if (!query.trim()) {
          onReset?.();
        }
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onReset, query]);

  useEffect(() => {
    const selectedSymbol = selection?.symbol?.trim().toUpperCase();
    const normalizedQuery = query.trim().toUpperCase();

    if (!query.trim()) {
      setSuggestions([]);
      setSearchError("");
      return;
    }

    if (compact && selectedSymbol && normalizedQuery === selectedSymbol) {
      setSuggestions([]);
      setSearchError("");
      return;
    }

    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setPending(true);
      try {
        const payload = await fetchSearchSuggestions(query, 12);
        setSuggestions(payload.suggestions || []);
        setActiveIndex(0);
        setSearchError("");
      } catch (err) {
        setSuggestions([]);
        setSearchError(err.message || "Search unavailable.");
      } finally {
        setPending(false);
      }
    }, 180);
    return () => window.clearTimeout(debounceRef.current);
  }, [compact, query, selection]);

  useEffect(() => {
    if (selection?.symbol) {
      setQuery(selection.symbol);
      setSuggestions([]);
      setActiveIndex(0);
      setSearchError("");
    }
  }, [selection]);

  const helperMessage = useMemo(() => {
    if (error) return error;
    if (searchError) return searchError;
    if (loading) return `Loading ${selection?.symbol || "company"}...`;
    if (pending) return "Searching listed companies worldwide...";
    return "Search by ticker or company name. Typo-tolerant suggestions are enabled.";
  }, [error, searchError, loading, selection, pending]);

  function commitSelection(candidate) {
    if (!candidate) return;
    setQuery(candidate.symbol);
    setSuggestions([]);
    setSearchError("");
    onEvaluate(candidate);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!query.trim()) {
      setSuggestions([]);
      setSearchError("");
      onReset?.();
      return;
    }
    const candidate = suggestions[activeIndex] || suggestions[0];
    if (candidate) {
      commitSelection(candidate);
    }
  }

  function onKeyDown(event) {
    if (!suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const candidate = suggestions[activeIndex] || suggestions[0];
      if (candidate) commitSelection(candidate);
    }
    if (event.key === "Escape") {
      setSuggestions([]);
    }
  }

  return (
    <section className={`search-hero ${compact ? "compact" : ""}`}>
      <div className="search-copy">
        <h1 className="search-title">
          Search a public company, then <em>evaluate</em> it.
        </h1>
        <p className="search-subtitle">Search by ticker symbol or company name.</p>
      </div>
      <form className="search-card" onSubmit={handleSubmit} ref={wrapperRef}>
        <div className="search-row">
          <div className="search-input-wrap">
            <input
              className="search-input"
              value={query}
              onChange={(event) => {
                const nextValue = event.target.value;
                setQuery(nextValue);
                if (!nextValue.trim()) {
                  setSuggestions([]);
                  setSearchError("");
                  onReset?.();
                }
              }}
              onKeyDown={onKeyDown}
              placeholder="Search ticker or company name"
              aria-label="Search ticker or company name"
            />
          </div>
          <button className="evaluate-button" type="submit" disabled={loading || (!suggestions.length && !query.trim())}>
            {loading ? "Evaluating..." : "Evaluate"}
          </button>
        </div>
        {Boolean(suggestions.length) && (
          <div className="suggestions-panel">
            {suggestions.map((item, index) => (
              <button
                key={`${item.symbol}-${item.exchange}-${index}`}
                type="button"
                className={`suggestion-item ${index === activeIndex ? "active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commitSelection(item)}
              >
                <div className="suggestion-symbol">{item.symbol}</div>
                <div>
                  <div className="suggestion-name">{item.name}</div>
                  <span className="suggestion-meta">
                    {item.exchange || "Global listing"}
                    {item.currency ? ` • ${item.currency}` : ""}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className={`status-message ${error || searchError ? "error" : ""}`}>{helperMessage}</div>
      </form>
    </section>
  );
}
