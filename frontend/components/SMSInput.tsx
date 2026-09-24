"use client";

import { FormEvent, useState } from "react";
import AnalysisFeedback from "@/components/AnalysisFeedback";
import { analyzeText } from "@/services/api";
import { useAnalysisRequest } from "@/components/useAnalysisRequest";

export default function SMSInput() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { status: analysisStatus, response, error: analysisError, run } = useAnalysisRequest();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) {
      setError("Paste a message before continuing.");
      return;
    }
    setError("");
    void run(() => analyzeText(message.trim()));
  };

  return (
    <form className="input-interface form-interface" onSubmit={handleSubmit} noValidate>
      <div className="interface-intro"><span className="selected-panel-symbol" aria-hidden="true">SMS</span><div><h2>Suspicious message</h2><p>Paste the suspicious message here to prepare it for analysis.</p></div></div>
      <div className="form-field"><label htmlFor="suspicious-message">Message</label><textarea id="suspicious-message" rows={7} placeholder="Your bank account will be blocked..." value={message} onChange={(event) => setMessage(event.target.value)} aria-invalid={Boolean(error)} /><span className="character-count">{message.length} characters</span></div>
      <div className="interface-actions"><button className="primary-button form-submit" type="submit" disabled={analysisStatus === "loading"}>{analysisStatus === "loading" ? "Analyzing..." : "Analyze Message"} {analysisStatus !== "loading" && <span aria-hidden="true">-&gt;</span>}</button></div>
      {error && <p className="form-feedback error" role="alert">{error}</p>}
      <AnalysisFeedback status={analysisStatus} response={response} error={analysisError} />
    </form>
  );
}