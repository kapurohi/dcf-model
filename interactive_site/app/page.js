"use client";

import { useMemo, useState } from "react";

import DcfPrimerTab from "@/components/DcfPrimerTab";
import Navbar from "@/components/Navbar";
import SearchHero from "@/components/SearchHero";
import ValuationWorkspace from "@/components/ValuationWorkspace";

export default function HomePage() {
  const [selection, setSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("information");

  const compact = useMemo(() => Boolean(selection), [selection]);

  async function handleEvaluate(suggestion) {
    if (!suggestion?.symbol) return;
    setError("");
    setSelection(suggestion);
  }

  function handleReset() {
    setSelection(null);
    setError("");
    setLoading(false);
  }

  return (
    <div className="page-shell">
      <div className="ambient-layer" />
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className={`main-stage ${compact ? "main-stage-compact" : ""}`}>
        {activeTab === "information" ? <DcfPrimerTab /> : null}

        {activeTab === "analysis" ? (
          <>
            <SearchHero
              compact={compact}
              loading={loading}
              onEvaluate={handleEvaluate}
              onReset={handleReset}
              selection={selection}
              error={error}
            />
            <ValuationWorkspace
              visible={Boolean(selection)}
              loading={loading}
              selection={selection}
            />
          </>
        ) : null}
      </main>
    </div>
  );
}
