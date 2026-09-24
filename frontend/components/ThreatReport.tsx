"use client";

import { useState } from "react";
import IndicatorCard from "@/components/IndicatorCard";
import RiskBadge from "@/components/RiskBadge";
import { useAnalysisResult } from "@/components/AnalysisProvider";

export default function ThreatReport() {
  const { result } = useAnalysisResult();
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!result) {
    return (
      <main className="result-empty page-width">
        <p className="eyebrow"><span className="status-dot" /> Threat analysis</p>
        <h1>No analysis result yet<span>.</span></h1>
        <p>Complete an analysis to review its result here.</p>
        <a className="primary-button" href="/analyze">Start an Analysis <span aria-hidden="true">-&gt;</span></a>
      </main>
    );
  }

  const threatLabel = result.threat_type.replaceAll("_", " ");

  return (
    <main className="result-page page-width">
      <header className="result-header">
        <div>
          <p className="eyebrow"><span className="status-dot" /> Threat analysis</p>
          <h1>Analysis complete<span>.</span></h1>
          <p className="result-subtitle">Review the response before deciding what to do next.</p>
        </div>
        <div className="result-input-type"><span>INPUT TYPE</span><strong>{result.input_type}</strong></div>
      </header>

      <section className="score-overview" aria-labelledby="risk-summary-heading">
        <div className="score-card">
          <p className="eyebrow">Risk score</p>
          <p className="score-value"><strong>{result.risk_score}</strong><span>/ 100</span></p>
          <RiskBadge level={result.risk_level} />
        </div>
        <div className="threat-card">
          <p className="eyebrow">Threat type</p>
          <h2 id="risk-summary-heading">{threatLabel}</h2>
          <p className="threat-status">{result.threat_type} DETECTED</p>
        </div>
      </section>

      <section className="result-section" aria-labelledby="indicators-heading">
        <div className="result-section-heading">
          <div><p className="eyebrow">Indicators</p><h2 id="indicators-heading">Why was this flagged?</h2></div>
          <span className="section-count">{result.indicators.length} found</span>
        </div>
        <div className="indicator-list">
          {result.indicators.map((indicator, index) => <IndicatorCard key={`${indicator.type}-${index}`} indicator={indicator} />)}
        </div>
      </section>

      <section className="recommendation-card" aria-labelledby="recommendation-heading">
        <p className="eyebrow">Recommendation</p>
        <h2 id="recommendation-heading">{result.recommendation}</h2>
      </section>

      <section className="analysis-section result-section" aria-labelledby="analysis-heading">
        <p className="eyebrow">Analysis</p>
        <h2 id="analysis-heading">What the response means</h2>
        <p>{result.analysis}</p>
      </section>

      <div className="result-actions">
        <button className={`result-action${isEvidenceOpen ? " active" : ""}`} type="button" aria-expanded={isEvidenceOpen} onClick={() => setIsEvidenceOpen(!isEvidenceOpen)}>
          <span><strong>View Evidence</strong><small>Available response details</small></span><span aria-hidden="true">{isEvidenceOpen ? "-" : "+"}</span>
        </button>
        <button className={`result-action${isPreviewOpen ? " active" : ""}`} type="button" aria-expanded={isPreviewOpen} onClick={() => setIsPreviewOpen(!isPreviewOpen)}>
          <span><strong>Safe Preview</strong><small>Inspect content without opening it</small></span><span aria-hidden="true">{isPreviewOpen ? "-" : "+"}</span>
        </button>
      </div>
      {isEvidenceOpen && <div className="result-disclosure"><p>Detailed evidence will appear here when available.</p></div>}
      {isPreviewOpen && <div className="result-disclosure"><p>Safe preview is not available for this result.</p></div>}
    </main>
  );
}