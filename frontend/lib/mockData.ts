import type { AnalysisResponse, InputType } from "@/types/analysis";

export const mockURLResponse: AnalysisResponse = {
  risk_score: 87,
  risk_level: "HIGH",
  threat_type: "PHISHING",
  input_type: "URL",
  indicators: [{ type: "SUSPICIOUS_DOMAIN", severity: "HIGH", message: "The destination uses a suspicious domain pattern." }],
  recommendation: "Do not enter credentials or personal information.",
  analysis: "This demo response represents a URL analysis returned by the mock service.",
};

export const mockQRResponse: AnalysisResponse = {
  risk_score: 64,
  risk_level: "MEDIUM",
  threat_type: "SUSPICIOUS_LINK",
  input_type: "QR",
  indicators: [{ type: "REDIRECT_CHAIN", severity: "MEDIUM", message: "The QR destination may pass through multiple redirects." }],
  recommendation: "Review the destination carefully before opening it.",
  analysis: "This demo response represents a QR image analysis returned by the mock service.",
};

export const mockSMSResponse: AnalysisResponse = {
  risk_score: 78,
  risk_level: "HIGH",
  threat_type: "SOCIAL_ENGINEERING",
  input_type: "SMS",
  indicators: [{ type: "URGENCY_LANGUAGE", severity: "HIGH", message: "The message uses urgency to encourage immediate action." }],
  recommendation: "Do not follow links or share verification codes.",
  analysis: "This demo response represents a message analysis returned by the mock service.",
};

export const mockPhoneResponse: AnalysisResponse = {
  risk_score: 42,
  risk_level: "MEDIUM",
  threat_type: "UNKNOWN_CONTACT",
  input_type: "PHONE",
  indicators: [{ type: "CONTEXT_REQUIRED", severity: "MEDIUM", message: "Additional context would be needed to assess this contact." }],
  recommendation: "Verify the caller through a trusted channel.",
  analysis: "This demo response does not determine whether the phone number is fraudulent.",
};

export const mockEmailResponse: AnalysisResponse = {
  risk_score: 81,
  risk_level: "HIGH",
  threat_type: "PHISHING",
  input_type: "EMAIL",
  indicators: [{ type: "BRAND_IMPERSONATION", severity: "HIGH", message: "The sender and subject may imitate a trusted organization." }],
  recommendation: "Do not reply or enter credentials from this message.",
  analysis: "This demo response represents an email analysis returned by the mock service.",
};

export const mockScreenshotResponse: AnalysisResponse = {
  risk_score: 59,
  risk_level: "MEDIUM",
  threat_type: "SUSPICIOUS_CONTENT",
  input_type: "SCREENSHOT",
  indicators: [{ type: "REVIEW_REQUIRED", severity: "MEDIUM", message: "The screenshot has been queued for a future content review flow." }],
  recommendation: "Avoid interacting with the content until it has been verified.",
  analysis: "This demo response represents a screenshot analysis returned by the mock service.",
};

export const mockImageResponses: Record<"QR" | "SCREENSHOT", AnalysisResponse> = {
  QR: mockQRResponse,
  SCREENSHOT: mockScreenshotResponse,
};

export const mockTextResponses: Record<"SMS", AnalysisResponse> = {
  SMS: mockSMSResponse,
};

export const responseForInput = (inputType: InputType): AnalysisResponse => {
  if (inputType === "QR" || inputType === "SCREENSHOT") return mockImageResponses[inputType];
  if (inputType === "SMS") return mockTextResponses.SMS;
  if (inputType === "URL") return mockURLResponse;
  if (inputType === "PHONE") return mockPhoneResponse;
  return mockEmailResponse;
};