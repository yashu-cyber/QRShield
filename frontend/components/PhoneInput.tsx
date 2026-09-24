"use client";

import { FormEvent, useState } from "react";
import AnalysisFeedback from "@/components/AnalysisFeedback";
import { analyzePhone } from "@/services/api";
import { useAnalysisRequest } from "@/components/useAnalysisRequest";

export default function PhoneInput() {
  const [phone, setPhone] = useState("");
  const [context, setContext] = useState("");
  const [error, setError] = useState("");
  const { status: analysisStatus, response, error: analysisError, run } = useAnalysisRequest();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phone.trim()) {
      setError("Enter a phone number before continuing.");
      return;
    }
    if (!/^[+\d][\d\s().-]{6,}$/.test(phone.trim())) {
      setError("Enter a valid phone number with at least 7 digits.");
      return;
    }
    setError("");
    void run(() => analyzePhone(phone.trim(), context.trim() || undefined));
  };

  return (
    <form className="input-interface form-interface" onSubmit={handleSubmit} noValidate>
      <div className="interface-intro"><span className="selected-panel-symbol" aria-hidden="true">TEL</span><div><h2>Phone number</h2><p>Provide the number and any useful context for later analysis.</p></div></div>
      <div className="form-fields-two"><div className="form-field"><label htmlFor="phone-number">Phone number</label><input id="phone-number" type="tel" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(event) => setPhone(event.target.value)} aria-invalid={Boolean(error)} /></div><div className="form-field"><label htmlFor="phone-context">Optional message or context</label><input id="phone-context" type="text" placeholder="Payment request received" value={context} onChange={(event) => setContext(event.target.value)} /></div></div>
      <div className="interface-actions"><button className="primary-button form-submit" type="submit" disabled={analysisStatus === "loading"}>{analysisStatus === "loading" ? "Analyzing..." : "Analyze Phone"} {analysisStatus !== "loading" && <span aria-hidden="true">-&gt;</span>}</button></div>
      {error && <p className="form-feedback error" role="alert">{error}</p>}
      <AnalysisFeedback status={analysisStatus} response={response} error={analysisError} />
    </form>
  );
}