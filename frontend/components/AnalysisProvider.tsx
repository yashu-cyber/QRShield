"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { mockHistory } from "@/lib/mockHistory";
import type { AnalysisResponse, HistoryItem } from "@/types/analysis";

type AnalysisContextValue = {
  result: AnalysisResponse | null;
  setResult: (result: AnalysisResponse) => void;
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  clearResult: () => void;
};

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);

  const addHistory = (item: HistoryItem) => {
    setHistory((currentHistory) => [item, ...currentHistory]);
  };

  return (
    <AnalysisContext.Provider value={{ result, setResult, history, addHistory, clearResult: () => setResult(null) }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisResult() {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error("useAnalysisResult must be used within AnalysisProvider");
  return context;
}