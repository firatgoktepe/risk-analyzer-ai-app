"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoPreview from "@/components/PhotoPreview";
import AnalysisResults from "@/components/AnalysisResults";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";

import type { UploadedPhoto, AnalysisResult } from "@/types";

export default function Home() {
  const t = useTranslations();
  const [uploadedPhoto, setUploadedPhoto] = useState<UploadedPhoto | null>(
    null
  );
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = (photo: UploadedPhoto) => {
    setUploadedPhoto(photo);
    setAnalysisResults(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedPhoto) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Call the AI analysis API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64Image: uploadedPhoto.base64,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const analysisResult = await response.json();
      setAnalysisResults(analysisResult);
    } catch (err) {
      console.error("Analysis error:", err);
      let errorMessage = t("errors.generic");

      if (err instanceof Error) {
        if (err.message.includes("API key")) {
          errorMessage = t("errors.apiKey");
        } else if (err.message.includes("quota")) {
          errorMessage = t("errors.quota");
        } else if (
          err.message.includes("network") ||
          err.message.includes("fetch")
        ) {
          errorMessage = t("errors.network");
        }
      }

      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedPhoto(null);
    setAnalysisResults(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const handleRemoveError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 mt-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>

        {/* Error Display */}
        {error && (
          <ErrorDisplay message={error} onDismiss={handleRemoveError} />
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {!uploadedPhoto ? (
            <PhotoUpload onPhotoUpload={handlePhotoUpload} />
          ) : (
            <>
              <PhotoPreview
                photo={uploadedPhoto}
                onAnalyze={handleAnalyze}
                onReset={handleReset}
                isAnalyzing={isAnalyzing}
                hasResults={!!analysisResults}
              />

              {isAnalyzing && <LoadingSpinner />}

              {analysisResults && !isAnalyzing && (
                <AnalysisResults
                  results={analysisResults}
                  onReset={handleReset}
                  photoName={uploadedPhoto?.file.name}
                  photoBase64={uploadedPhoto?.base64}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
