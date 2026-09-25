"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import HistoryCard from "@/components/HistoryCard";
import { useAnalysisResult } from "@/components/AnalysisProvider";
import type { HistoryItem, InputType } from "@/types/analysis";

const filters: Array<"ALL" | InputType> = [
  "ALL",
  "QR",
  "URL",
  "SMS",
  "PHONE",
  "EMAIL",
  "SCREENSHOT",
];

const filterLabels: Record<"ALL" | InputType, string> = {
  ALL: "All",
  QR: "QR",
  URL: "URL",
  SMS: "SMS",
  PHONE: "Phone",
  EMAIL: "Email",
  SCREENSHOT: "Screenshot",
};

export default function HistoryList() {
  const router = useRouter();
  const { history, setResult } = useAnalysisResult();

  const [activeFilter, setActiveFilter] =
    useState<"ALL" | InputType>("ALL");

  const openResult = (item: HistoryItem) => {
    setResult(item.response);
    router.push("/result");
  };

  const filteredHistory = useMemo(() => {
    if (activeFilter === "ALL") {
      return history;
    }

    return history.filter(
      (item) => item.response.input_type === activeFilter
    );
  }, [history, activeFilter]);

  if (history.length === 0) {
    return (
      <div className="history-empty">
        <p className="eyebrow">
          <span className="status-dot" /> No scans yet
        </p>

        <h2>Your analyzed items will appear here.</h2>

        <a className="primary-button" href="/">
          Analyze Something <span aria-hidden="true">-&gt;</span>
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="history-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`history-filter ${
              activeFilter === filter ? "active" : ""
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filterLabels[filter]}
          </button>
        ))}
      </div>

      {filteredHistory.length > 0 ? (
        <div className="history-list">
          {filteredHistory.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onSelect={openResult}
            />
          ))}
        </div>
      ) : (
        <div className="history-empty">
          <p className="eyebrow">
            <span className="status-dot" /> No scans found
          </p>

          <h2>
            No {filterLabels[activeFilter]} scans yet.
          </h2>
        </div>
      )}
    </>
  );
}
