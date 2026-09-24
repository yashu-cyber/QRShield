"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import EmailInput from "@/components/EmailInput";
import ImageInput from "@/components/ImageInput";
import PhoneInput from "@/components/PhoneInput";
import SMSInput from "@/components/SMSInput";
import URLInput from "@/components/URLInput";

const inputTypes = [
  { id: "qr", label: "QR Code", symbol: "QR", message: "QR image analysis interface will appear here." },
  { id: "url", label: "URL", symbol: "URL", message: "URL analysis interface will appear here." },
  { id: "sms", label: "SMS", symbol: "SMS", message: "SMS analysis interface will appear here." },
  { id: "phone", label: "Phone", symbol: "TEL", message: "Phone analysis interface will appear here." },
  { id: "email", label: "Email", symbol: "@", message: "Email analysis interface will appear here." },
  { id: "screenshot", label: "Screenshot", symbol: "IMG", message: "Screenshot analysis interface will appear here." },
];

export default function AnalyzeInterface() {
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");
  const initialType = inputTypes.find((inputType) => inputType.id === requestedType)?.id ?? "qr";
  const [selectedType, setSelectedType] = useState(initialType);
  const selectedInput = inputTypes.find((inputType) => inputType.id === selectedType) ?? inputTypes[0];

  const renderInputInterface = () => {
    switch (selectedType) {
      case "qr":
        return <ImageInput kind="qr" />;
      case "url":
        return <URLInput />;
      case "sms":
        return <SMSInput />;
      case "phone":
        return <PhoneInput />;
      case "email":
        return <EmailInput />;
      case "screenshot":
        return <ImageInput kind="screenshot" />;
      default:
        return null;
    }
  };

  return (
    <section className="analyze-workspace" aria-labelledby="input-selector-heading">
      <div className="selector-header">
        <div>
          <p className="eyebrow">Input type</p>
          <h2 id="input-selector-heading">What would you like to check?</h2>
        </div>
        <span className="selector-count">{inputTypes.length} options</span>
      </div>
      <div className="selector-grid" role="group" aria-label="Select content type">
        {inputTypes.map((inputType) => {
          const isSelected = inputType.id === selectedType;
          return (
            <button
              className={`selector-option${isSelected ? " selected" : ""}`}
              key={inputType.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedType(inputType.id)}
            >
              <span className="input-symbol" aria-hidden="true">{inputType.symbol}</span>
              <span>{inputType.label}</span>
              {isSelected && <span className="selector-check" aria-hidden="true">OK</span>}
            </button>
          );
        })}
      </div>
      <div className="selected-panel" aria-live="polite">
        <div className="selected-panel-topline">
          <p className="eyebrow">Selected interface</p>
          <span className="selected-badge">{selectedInput.label}</span>
        </div>
        {renderInputInterface()}
      </div>
    </section>
  );
}