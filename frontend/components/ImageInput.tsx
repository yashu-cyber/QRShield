"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import AnalysisFeedback from "@/components/AnalysisFeedback";
import { analyzeImage } from "@/services/api";
import { useAnalysisRequest } from "@/components/useAnalysisRequest";

type ImageInputProps = {
  kind: "qr" | "screenshot";
};

const imageCopy = {
  qr: {
    title: "Upload a QR code image",
    description: "Add a clear image of the QR code to prepare it for analysis.",
    button: "Analyze QR",
    alt: "Selected QR code preview",
  },
  screenshot: {
    title: "Upload a suspicious screenshot",
    description: "Add a screenshot to prepare it for analysis.",
    button: "Analyze Screenshot",
    alt: "Selected screenshot preview",
  },
};

export default function ImageInput({ kind }: ImageInputProps) {
  const copy = imageCopy[kind];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const { status: analysisStatus, response, error: analysisError, run } = useAnalysisRequest();

  useEffect(() => () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage.previewUrl);
  }, [selectedImage]);

  const acceptFile = (nextFile: File | undefined) => {
    setError("");
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) {
      setError("Please choose an image file such as PNG, JPG, or WEBP.");
      return;
    }
    setSelectedImage({ file: nextFile, previewUrl: URL.createObjectURL(nextFile) });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  };

  const removeFile = () => {
    setSelectedImage(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (!selectedImage) {
      setError(`Choose an image before selecting ${copy.button}.`);
      return;
    }
    setError("");
    void run(() => analyzeImage(selectedImage.file, kind === "qr" ? "QR" : "SCREENSHOT"));
  };

  return (
    <div className="input-interface">
      <div className="interface-intro">
        <span className="selected-panel-symbol" aria-hidden="true">{kind === "qr" ? "QR" : "IMG"}</span>
        <div>
          <h2>{kind === "qr" ? "QR Code" : "Screenshot"}</h2>
          <p>{copy.description}</p>
        </div>
      </div>
      {!selectedImage ? (
        <div
          className={`drop-zone${isDragging ? " dragging" : ""}`}
          onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span className="drop-zone-mark" aria-hidden="true">+</span>
          <strong>{copy.title}</strong>
          <span>Drag and drop or browse from your device</span>
          <button className="secondary-button" type="button" onClick={() => fileInputRef.current?.click()}>Browse image</button>
          <input ref={fileInputRef} className="visually-hidden" type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="image-preview-wrap">
          <div className="image-preview">
            <Image src={selectedImage.previewUrl} alt={copy.alt} width={800} height={600} unoptimized />
          </div>
          <div className="file-details">
            <div>
              <strong>{selectedImage.file.name}</strong>
              <span>{Math.ceil(selectedImage.file.size / 1024)} KB</span>
            </div>
            <button className="text-button" type="button" onClick={() => fileInputRef.current?.click()}>Replace image</button>
            <input ref={fileInputRef} className="visually-hidden" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
      )}
      <div className="interface-actions">
        {selectedImage && <button className="secondary-button" type="button" onClick={removeFile}>Remove</button>}
        <button className="primary-button form-submit" type="button" onClick={handleAnalyze} disabled={analysisStatus === "loading"}>
          {analysisStatus === "loading" ? "Analyzing..." : copy.button}
          {analysisStatus !== "loading" && <span aria-hidden="true">-&gt;</span>}
        </button>
      </div>
      {error && <p className="form-feedback error" role="alert">{error}</p>}
      <AnalysisFeedback status={analysisStatus} response={response} error={analysisError} />
    </div>
  );
}