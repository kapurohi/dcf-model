"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BlockMath, InlineMath } from "react-katex";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

import { primerSections } from "@/content/dcfPrimer";

function PrimerVisual({ type }) {
  if (type === "inputs") {
    return (
      <div className="info-stage-art info-art-inputs" aria-hidden="true">
        <div className="info-orbit info-orbit-a" />
        <div className="info-orbit info-orbit-b" />
        <div className="info-pill info-pill-top">Market data</div>
        <div className="info-pill info-pill-bottom">Financial base</div>
        <div className="info-data-column">
          <span>Price</span>
          <span>Shares</span>
          <span>Revenue</span>
          <span>Cash</span>
          <span>Debt</span>
        </div>
      </div>
    );
  }

  if (type === "drivers") {
    return (
      <div className="info-stage-art info-art-drivers" aria-hidden="true">
        <div className="info-driver-ring" />
        <div className="info-driver-core">DCF</div>
        <div className="info-driver-label growth">Growth</div>
        <div className="info-driver-label margin">Margin</div>
        <div className="info-driver-label capex">CapEx</div>
        <div className="info-driver-label nwc">NWC</div>
        <div className="info-driver-label wacc">WACC</div>
      </div>
    );
  }

  if (type === "ufcf") {
    return (
      <div className="info-stage-art info-art-equation" aria-hidden="true">
        <div className="info-equation-node">Revenue</div>
        <div className="info-equation-link" />
        <div className="info-equation-node">EBITDA</div>
        <div className="info-equation-link" />
        <div className="info-equation-node">EBIT</div>
        <div className="info-equation-link" />
        <div className="info-equation-node accent">UFCF</div>
      </div>
    );
  }

  if (type === "valuation") {
    return (
      <div className="info-stage-art info-art-valuation" aria-hidden="true">
        <div className="info-valuation-column">
          <span>PV of UFCF</span>
          <span>Terminal value</span>
          <span>Enterprise value</span>
          <span>Equity value</span>
        </div>
        <div className="info-valuation-price">$</div>
      </div>
    );
  }

  if (type === "analysis") {
    return (
      <div className="info-stage-art info-art-analysis" aria-hidden="true">
        <div className="info-mini-panel">
          <span>Cards</span>
          <strong>Value</strong>
        </div>
        <div className="info-mini-panel">
          <span>Forecast</span>
          <strong>Why</strong>
        </div>
        <div className="info-mini-panel">
          <span>Audit</span>
          <strong>Source</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="info-stage-art info-art-hero" aria-hidden="true">
      <div className="info-grid-fade" />
      <svg viewBox="0 0 620 420" className="info-stage-svg">
        <path d="M30 338H590" stroke="rgba(220,229,244,0.15)" strokeWidth="2" />
        <path d="M68 304L150 262L232 274L316 202L404 214L492 146L562 94" stroke="var(--chart-reference)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M68 304L150 262L232 274L316 202L404 214L492 146L562 94" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 10" />
      </svg>
      <div className="info-pill info-pill-top">Future cash</div>
      <div className="info-pill info-pill-bottom">Present value</div>
    </div>
  );
}

function FormulaGroup({ title, latex, description }) {
  return (
    <div className="info-detail-block">
      <div className="info-detail-label">{title}</div>
      <div className="info-math-wrap">
        <BlockMath math={latex} />
      </div>
      <p>{description}</p>
    </div>
  );
}

function Glossary({ items }) {
  if (!items?.length) return null;

  return (
    <div className="info-detail-block">
      <div className="info-detail-label">Notation</div>
      <div className="info-glossary">
        {items.map(([symbol, meaning]) => (
          <div key={`${symbol}-${meaning}`} className="info-glossary-row">
            <div className="info-glossary-symbol">
              <InlineMath math={symbol} />
            </div>
            <div className="info-glossary-meaning">{meaning}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildDetailPages(section) {
  const pages = [];

  const introItems = [
    ...(section.detailBody || []).map((paragraph) => ({ type: "paragraph", value: paragraph })),
    ...(section.detailBullets?.length ? [{ type: "bullets", value: section.detailBullets }] : []),
  ];

  if (introItems.length) {
    pages.push(introItems);
  }

  if (section.formulas?.length) {
    for (let index = 0; index < section.formulas.length; index += 2) {
      pages.push(
        section.formulas.slice(index, index + 2).map((formula) => ({
          type: "formula",
          value: formula,
        })),
      );
    }
  }

  if (section.glossary?.length) {
    pages.push([{ type: "glossary", value: section.glossary }]);
  }

  return pages.length ? pages : [[]];
}

function PrimerSection({ section, index }) {
  const [open, setOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const alternate = index % 2 === 1;
  const detailPages = useMemo(() => buildDetailPages(section), [section]);

  function handleOpen() {
    setPageIndex(0);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setPageIndex(0);
  }

  return (
    <section className="info-section">
      <div className={`info-window ${alternate ? "theme-light-front layout-reverse" : "theme-navy-front"} ${open ? "is-open" : ""}`}>
        <div className={`info-front ${open ? "is-hidden" : ""}`} aria-hidden={open}>
          <div className="info-front-copy">
            <div className="info-section-label">
              <span>{section.label}</span>
              <em>{section.kicker}</em>
            </div>
            <h2 className="info-front-title">{section.title}</h2>
            <p className="info-front-summary">{section.summary}</p>
            {section.shortPoints ? (
              <ul className="info-front-points">
                {section.shortPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            <button type="button" className="info-detail-trigger" onClick={handleOpen}>
              More details
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="info-front-visual">
            <PrimerVisual type={section.visual} />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              className="info-back"
              initial={{ x: "100%", opacity: 0.92 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.92 }}
              transition={{ type: "spring", stiffness: 180, damping: 26 }}
            >
              <div className="info-back-shell">
                <div className="info-back-header">
                  <div className="info-section-label">
                    <span>{section.label}</span>
                    <em>{section.kicker}</em>
                  </div>
                </div>

                <div className="info-back-grid">
                  <div className="info-back-copy">
                    <div className="info-back-copy-head">
                      <h3 className="info-back-title">{section.detailTitle}</h3>
                      {detailPages.length > 1 ? (
                        <div className="info-page-counter">
                          Page {pageIndex + 1} of {detailPages.length}
                        </div>
                      ) : null}
                    </div>

                    <div className="info-back-page">
                      {detailPages[pageIndex].map((item, itemIndex) => {
                        if (item.type === "paragraph") {
                          return (
                            <p key={`${item.value}-${itemIndex}`} className="info-back-paragraph">
                              {item.value}
                            </p>
                          );
                        }

                        if (item.type === "bullets") {
                          return (
                            <ul key={`bullets-${itemIndex}`} className="info-back-list">
                              {item.value.map((bullet) => (
                                <li key={bullet}>{bullet}</li>
                              ))}
                            </ul>
                          );
                        }

                        if (item.type === "formula") {
                          return <FormulaGroup key={item.value.title} {...item.value} />;
                        }

                        if (item.type === "glossary") {
                          return <Glossary key={`glossary-${itemIndex}`} items={item.value} />;
                        }

                        return null;
                      })}
                    </div>

                    {detailPages.length > 1 ? (
                      <div className="info-back-pagination">
                        <div className="info-back-pagination-left">
                          <button type="button" className="info-back-button" onClick={handleClose}>
                            <ArrowLeft size={16} />
                            Back
                          </button>
                        </div>
                        <div className="info-back-pagination-right">
                          <button
                            type="button"
                            className="info-page-button"
                            onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
                            disabled={pageIndex === 0}
                          >
                            <ArrowLeft size={16} />
                            Previous
                          </button>
                          <button
                            type="button"
                            className="info-page-button"
                            onClick={() => setPageIndex((current) => Math.min(detailPages.length - 1, current + 1))}
                            disabled={pageIndex === detailPages.length - 1}
                          >
                            Next
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="info-back-pagination">
                        <div className="info-back-pagination-left">
                          <button type="button" className="info-back-button" onClick={handleClose}>
                            <ArrowLeft size={16} />
                            Back
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function DcfPrimerTab() {
  return (
    <section className="info-shell">
      {primerSections.map((section, index) => (
        <PrimerSection key={section.id} section={section} index={index} />
      ))}
    </section>
  );
}
