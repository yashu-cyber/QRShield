import type { Indicator } from "@/types/analysis";

type IndicatorCardProps = {
  indicator: Indicator;
};

export default function IndicatorCard({ indicator }: IndicatorCardProps) {
  const tone = indicator.severity === "HIGH" || indicator.severity === "CRITICAL" ? "high" : indicator.severity === "LOW" ? "low" : "suspicious";
  return (
    <article className={`indicator-card ${tone}`}>
      <span className="indicator-mark" aria-hidden="true">!</span>
      <div>
        <div className="indicator-heading">
          <h3>{indicator.type.replaceAll("_", " ")}</h3>
          <span className="indicator-severity">{indicator.severity}</span>
        </div>
        <p>{indicator.message}</p>
      </div>
    </article>
  );
}