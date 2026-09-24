"use client";

import { useRouter } from "next/navigation";
import HistoryCard from "@/components/HistoryCard";
import { useAnalysisResult } from "@/components/AnalysisProvider";
import type { HistoryItem } from "@/types/analysis";

export default function HistoryList() {
  const router = useRouter();
  const { history, setResult } = useAnalysisResult();

  const openResult = (item: HistoryItem) => {
    setResult(item.response);
    router.push("/result");
  };

  if (history.length === 0) {
    return (
      <div className="history-empty">
        <p className="eyebrow"><span className="status-dot" /> No scans yet</p>
        <h2>Your analyzed items will appear here.</h2>
        <a className="primary-button" href="/analyze">Analyze Something <span aria-hidden="true">-&gt;</span></a>
      </div>
    );
  }

  return <div className="history-list">{history.map((item) => <HistoryCard key={item.id} item={item} onSelect={openResult} />)}</div>;
}