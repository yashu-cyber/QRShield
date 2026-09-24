import type { AnalysisResponse } from "@/types/analysis";

type AnalysisStatus = "idle" | "loading" | "success" | "error";

type AnalysisFeedbackProps = {
  status: AnalysisStatus;
  response: AnalysisResponse | null;
  error: string | null;
};

export default function AnalysisFeedback({ status, response, error }: AnalysisFeedbackProps) {
  if (status === "idle") return null;
  if (status === "loading") return <p className="analysis-feedback loading" role="status">Analyzing...</p>;
  if (status === "error") return <p className="analysis-feedback error" role="alert">{error ?? "The demo analysis could not be completed."}</p>;
  if (!response) return null;

  return (
    <div className="analysis-feedback result" role="status" aria-live="polite">
      <div className="result-heading">
        <span className="result-indicator" aria-hidden="true" />
        <strong>Analysis completed.</strong>
        <span className="demo-label">Demo response</span>
      </div>
      <div className="result-values">
        <span>Risk: <strong>{response.risk_level}</strong></span>
        <span>Threat: <strong>{response.threat_type}</strong></span>
      </div>
    </div>
  );
}