export type RiskLevel = "LOW" | "SUSPICIOUS" | "MEDIUM" | "HIGH" | "CRITICAL";

export type InputType = "QR" | "URL" | "SMS" | "PHONE" | "EMAIL" | "SCREENSHOT";

export type Indicator = {
  type: string;
  severity: RiskLevel;
  message: string;
};

export type AnalysisResponse = {
  risk_score: number;
  risk_level: RiskLevel;
  threat_type: string;
  input_type: InputType;
  indicators: Indicator[];
  recommendation: string;
  analysis: string;
};

export type HistoryItem = {
  id: string;
  title: string;
  timestamp: string;
  response: AnalysisResponse;
};