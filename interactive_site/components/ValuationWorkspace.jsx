"use client";

import { useEffect, useState } from "react";

import AssumptionsPanel from "@/components/valuation/AssumptionsPanel";
import AuditSection from "@/components/valuation/AuditSection";
import BridgeSection from "@/components/valuation/BridgeSection";
import ChartsPanel from "@/components/valuation/ChartsPanel";
import ForecastTable from "@/components/valuation/ForecastTable";
import SensitivityGrid from "@/components/valuation/SensitivityGrid";
import SummaryCards from "@/components/valuation/SummaryCards";
import { fetchValuation } from "@/lib/api";
import { formatCompactCurrency, formatPlainNumber } from "@/lib/formatters";
import {
  adjustProjectionYears,
  buildValuationPayload,
  cloneScenarioState,
  createScenarioStateFromValuation,
  setFlatSeriesValue,
  setScalarValue,
  setSeriesMode,
  setYearSeriesValue,
  validateScenarioState,
} from "@/lib/valuation";

export default function ValuationWorkspace({ visible, loading, selection }) {
  const [baseState, setBaseState] = useState(null);
  const [baseDefaults, setBaseDefaults] = useState(null);
  const [valuationResult, setValuationResult] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [running, setRunning] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");
  const [runErrors, setRunErrors] = useState([]);

  const selectionExchangeCode = selection?.exchange_code || selection?.exchangeCode || "";

  useEffect(() => {
    if (!visible || !selection?.symbol) return;
    let cancelled = false;

    async function bootstrap() {
      setBootstrapping(true);
      setWorkspaceError("");
      setRunErrors([]);
      try {
        const payload = await fetchValuation(selection.symbol, null, selectionExchangeCode);
        if (cancelled) return;
        const initialState = createScenarioStateFromValuation(payload);
        setBaseState(cloneScenarioState(initialState));
        setBaseDefaults(cloneScenarioState(initialState));
        setValuationResult(payload);
      } catch (error) {
        if (!cancelled) {
          setWorkspaceError(error.message || "Unable to initialize valuation workspace.");
        }
      } finally {
        if (!cancelled) {
          setBootstrapping(false);
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [selection?.symbol, selectionExchangeCode, visible]);

  const activeState = baseState;
  const activeResult = valuationResult;
  const busy = loading || bootstrapping || running;

  const company = activeResult?.company;
  const summary = activeResult?.summary;
  const assumptionsUsed = activeResult?.assumptions_used;
  const assumptionsSource = activeResult?.assumptions_source;
  const currency = company?.currency || selection?.currency || "USD";

  useEffect(() => {
    if (!activeState || !selection?.symbol || bootstrapping) return;

    const validationErrors = validateScenarioState(activeState);
    setRunErrors(validationErrors);
    if (validationErrors.length) return;

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setRunning(true);
      try {
        const payload = buildValuationPayload(activeState);
        const result = await fetchValuation(selection.symbol, payload, selectionExchangeCode);
        if (cancelled) return;
        setValuationResult(result);
        setWorkspaceError("");
      } catch (error) {
        if (!cancelled) {
          setWorkspaceError(error.message || "Unable to update valuation.");
        }
      } finally {
        if (!cancelled) {
          setRunning(false);
        }
      }
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [activeState, bootstrapping, selection?.symbol, selectionExchangeCode]);

  function updateActiveState(updater) {
    setBaseState((current) => updater(current));
  }

  async function handleRunValuation() {
    if (!activeState || !selection?.symbol) return;

    const validationErrors = validateScenarioState(activeState);
    if (validationErrors.length) {
      setRunErrors(validationErrors);
      return;
    }

    setRunning(true);
    setWorkspaceError("");
    setRunErrors([]);
    try {
      const payload = buildValuationPayload(activeState);
      const result = await fetchValuation(selection.symbol, payload, selectionExchangeCode);
      setValuationResult(result);
    } catch (error) {
      setWorkspaceError(error.message || "Unable to run valuation.");
    } finally {
      setRunning(false);
    }
  }

  function handleResetScenario() {
    if (!baseDefaults) return;
    setBaseState(cloneScenarioState(baseDefaults));
    setRunErrors([]);
  }

  return (
    <section className={`workspace workspace-v2 ${visible ? "visible" : ""}`}>
      {(busy && !company) ? <div className="status-message">Preparing valuation workspace...</div> : null}
      {workspaceError ? <div className="status-message error workspace-error">{workspaceError}</div> : null}
      {visible && company && summary ? (
        <>
          <header className="panel premium-panel workspace-header-panel">
            <div className="workspace-header-top">
              <div className="workspace-company-lockup">
                <p className="workspace-section-label">Discounted Cash Flow Analysis</p>
                <h2>{company.name}</h2>
                <div className="workspace-company-meta">
                  <span>{company.symbol}</span>
                  <span>{company.exchange || selection?.exchange || "Global listing"}</span>
                  <span>{currency}</span>
                </div>
              </div>
              <div className="workspace-company-facts">
                <div>
                  <span>Market Cap</span>
                  <strong>{formatCompactCurrency(company.market_cap, currency)}</strong>
                </div>
                <div>
                  <span>TTM Revenue</span>
                  <strong>{formatCompactCurrency(company.ttm_revenue, currency)}</strong>
                </div>
                <div>
                  <span>Shares Outstanding</span>
                  <strong>{formatPlainNumber(company.shares_outstanding, 0)}</strong>
                </div>
              </div>
            </div>
            <SummaryCards summary={summary} currency={currency} />
          </header>

          <div className="workspace-main-grid">
            <div className="workspace-column workspace-column-wide">
              <ChartsPanel
                forecast={activeResult?.forecast}
                bridge={activeResult?.bridge}
                currency={currency}
              />
              <BridgeSection bridge={activeResult?.bridge} assumptionsUsed={assumptionsUsed} currency={currency} />
              <ForecastTable forecast={activeResult?.forecast} currency={currency} />
              <AuditSection
                diagnostics={activeResult?.diagnostics}
                dataQuality={activeResult?.data_quality}
                assumptionsSource={assumptionsSource}
              />
              <SensitivityGrid sensitivity={activeResult?.sensitivity} currency={currency} />
            </div>

            <div className="workspace-column workspace-column-side">
              <AssumptionsPanel
                scenarioState={activeState}
                onProjectionYearsChange={(projectionYears) => updateActiveState((state) => adjustProjectionYears(state, projectionYears))}
                onSeriesModeChange={(field, mode) => updateActiveState((state) => setSeriesMode(state, field, mode))}
                onFlatSeriesChange={(field, value) => updateActiveState((state) => setFlatSeriesValue(state, field, value))}
                onYearSeriesChange={(field, index, value) => updateActiveState((state) => setYearSeriesValue(state, field, index, value))}
                onScalarChange={(field, value) => updateActiveState((state) => setScalarValue(state, field, value))}
                runErrors={runErrors}
                busy={busy}
                onRun={handleRunValuation}
                onReset={handleResetScenario}
              />
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
