"use client";

import { FormEvent, useState } from "react";
import AnalysisFeedback from "@/components/AnalysisFeedback";
import { analyzeEmail } from "@/services/api";
import { useAnalysisRequest } from "@/components/useAnalysisRequest";

export default function EmailInput() {
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const { status: analysisStatus, response, error: analysisError, run } = useAnalysisRequest();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sender.trim() || !subject.trim() || !body.trim()) {
      setError("Complete the sender, subject, and email body fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender.trim())) {
      setError("Enter a valid sender email address.");
      return;
    }
    setError("");
    void run(() => analyzeEmail(sender.trim(), subject.trim(), body.trim()));
  };

  return (
    <form className="input-interface form-interface" onSubmit={handleSubmit} noValidate>
      <div className="interface-intro"><span className="selected-panel-symbol" aria-hidden="true">@</span><div><h2>Suspicious email</h2><p>Provide the email details to prepare them for later analysis.</p></div></div>
      <div className="form-fields-two"><div className="form-field"><label htmlFor="sender-email">Sender email</label><input id="sender-email" type="email" placeholder="security@example.com" value={sender} onChange={(event) => setSender(event.target.value)} aria-invalid={Boolean(error)} /></div><div className="form-field"><label htmlFor="email-subject">Subject</label><input id="email-subject" type="text" placeholder="Urgent account verification" value={subject} onChange={(event) => setSubject(event.target.value)} /></div></div>
      <div className="form-field"><label htmlFor="email-body">Email body</label><textarea id="email-body" rows={7} placeholder="Your account requires verification..." value={body} onChange={(event) => setBody(event.target.value)} aria-invalid={Boolean(error)} /></div>
      <div className="interface-actions"><button className="primary-button form-submit" type="submit" disabled={analysisStatus === "loading"}>{analysisStatus === "loading" ? "Analyzing..." : "Analyze Email"} {analysisStatus !== "loading" && <span aria-hidden="true">-&gt;</span>}</button></div>
      {error && <p className="form-feedback error" role="alert">{error}</p>}
      <AnalysisFeedback status={analysisStatus} response={response} error={analysisError} />
    </form>
  );
}