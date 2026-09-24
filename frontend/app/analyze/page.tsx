import { Suspense } from "react";
import AnalyzeInterface from "@/components/AnalyzeInterface";

export default function AnalyzePage() {
  return (
    <main className="analyze-page page-width">
      <div className="analyze-heading">
        <p className="eyebrow"><span className="status-dot" /> Analyze</p>
        <h1>Analyze Something<span>.</span></h1>
        <p className="hero-description">Choose the type of content you want to check.</p>
      </div>
      <Suspense fallback={<div className="analyze-loading" aria-label="Loading analyzer" />}>
        <AnalyzeInterface />
      </Suspense>
    </main>
  );
}