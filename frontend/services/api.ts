import {
  mockEmailResponse,
  mockImageResponses,
  mockPhoneResponse,
  mockSMSResponse,
  mockURLResponse,
} from "@/lib/mockData";
import type { AnalysisResponse } from "@/types/analysis";

const MOCK_DELAY_MS = 650;

const resolveMock = (response: AnalysisResponse): Promise<AnalysisResponse> =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve({ ...response, indicators: [...response.indicators] }), MOCK_DELAY_MS);
  });

export async function analyzeQR(file: File): Promise<AnalysisResponse> {
  void file;
  return resolveMock(mockImageResponses.QR);
}

export async function analyzeURL(url: string): Promise<AnalysisResponse> {
  void url;
  return resolveMock(mockURLResponse);
}

export async function analyzeText(text: string): Promise<AnalysisResponse> {
  void text;
  return resolveMock(mockSMSResponse);
}

export async function analyzePhone(phone: string, context?: string): Promise<AnalysisResponse> {
  void phone;
  void context;
  return resolveMock(mockPhoneResponse);
}

export async function analyzeEmail(sender: string, subject: string, body: string): Promise<AnalysisResponse> {
  void sender;
  void subject;
  void body;
  return resolveMock(mockEmailResponse);
}

export async function analyzeImage(file: File, inputType: "QR" | "SCREENSHOT"): Promise<AnalysisResponse> {
  void file;
  return resolveMock(mockImageResponses[inputType]);
}