import RiskBadge from "@/components/RiskBadge";
import type { HistoryItem } from "@/types/analysis";

type HistoryCardProps = {
  item: HistoryItem;
  onSelect: (item: HistoryItem) => void;
};

const inputLabels: Record<HistoryItem["response"]["input_type"], string> = {
  QR: "QR CODE",
  URL: "URL",
  SMS: "SMS",
  PHONE: "PHONE",
  EMAIL: "EMAIL",
  SCREENSHOT: "SCREENSHOT",
};

export default function HistoryCard({ item, onSelect }: HistoryCardProps) {
  const threatLabel = item.response.threat_type.replaceAll("_", " ");

  return (
    <button className="history-card" type="button" onClick={() => onSelect(item)}>
      <span className="history-card-main">
        <span className="history-card-title">{item.title}</span>
        <span className="history-card-meta"><span>{inputLabels[item.response.input_type]}</span><span className="history-dot" aria-hidden="true" />{threatLabel}</span>
      </span>
      <span className="history-card-side">
        <RiskBadge level={item.response.risk_level} />
        <span className="history-card-time">{item.timestamp}</span>
      </span>
      <span className="history-card-arrow" aria-hidden="true">-&gt;</span>
    </button>
  );
}