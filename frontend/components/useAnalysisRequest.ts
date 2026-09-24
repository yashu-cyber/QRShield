"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalysisResult } from "@/components/AnalysisProvider";
import type { AnalysisResponse, HistoryItem } from "@/types/analysis";

export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export function useAnalysisRequest() {
  const router = useRouter();
  const { setResult, addHistory } = useAnalysisResult();
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStatus("idle");
    setResponse(null);
    setError(null);
  };

  const run = async (request: () => Promise<AnalysisResponse>) => {
    setStatus("loading");
    setResponse(null);
    setError(null);
    try {
      const result = await request();
      setResponse(result);
      setStatus("success");
      setResult(result);
      const historyItem: HistoryItem = {
        id: `analysis-${result.input_type}-${Date.now()}`,
        title: `${result.input_type} analysis`,
        timestamp: "Just now",
        response: result,
      };
      addHistory(historyItem);
      router.push("/result");
    } catch {
      setError("The demo analysis could not be completed.");
      setStatus("error");
    }
  };

  return { status, response, error, reset, run };
}