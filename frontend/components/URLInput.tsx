"use client";

import { FormEvent, useState } from "react";
import AnalysisFeedback from "@/components/AnalysisFeedback";
import { analyzeURL } from "@/services/api";
import { useAnalysisRequest } from "@/components/useAnalysisRequest";

export default function URLInput() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const { status: analysisStatus, response, error: analysisError, run } = useAnalysisRequest();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) {
      setError("Enter a URL before continuing.");
      return;
    }
    try {
      const url = new URL(value.trim());
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      setError("Enter a valid URL beginning with http:// or https://.");
      return;
    }
    setError("");
    void run(() => analyzeURL(value.trim()));
  };

  return (
    <form className="input-interface form-interface" onSubmit={handleSubmit} noValidate>
      <div className="interface-intro">
        <span className="selected-panel-symbol" aria-hidden="true">URL</span>
        <div><h2>Suspicious URL</h2><p>Paste the URL you want to prepare for analysis.</p></div>
      </div>
      <div className="form-field">
        <label htmlFor="suspicious-url">URL address</label>
        <input id="suspicious-url" type="url" placeholder="https://example.com/login" value={value} onChange={(event) => setValue(event.target.value)} aria-invalid={Boolean(error)} />
      </div>
      <div className="interface-actions"><button className="primary-button form-submit" type="submit" disabled={analysisStatus === "loading"}>{analysisStatus === "loading" ? "Analyzing..." : "Analyze URL"} {analysisStatus !== "loading" && <span aria-hidden="true">-&gt;</span>}</button></div>
      {error && <p className="form-feedback error" role="alert">{error}</p>}
      <AnalysisFeedback status={analysisStatus} response={response} error={analysisError} />
    </form>
  );
}