import type { RiskLevel } from "@/types/analysis";

type RiskBadgeProps = {
  level: RiskLevel;
};

export default function RiskBadge({ level }: RiskBadgeProps) {
  const tone = level === "LOW" ? "low" : level === "HIGH" || level === "CRITICAL" ? "high" : "suspicious";
  return <span className={`risk-badge ${tone}`}><span className="risk-badge-dot" aria-hidden="true" />{level} RISK</span>;
}