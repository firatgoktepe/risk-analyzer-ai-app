"use client";

import { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Download,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateSafetyAnalysisPDF } from "@/lib/pdf-utils";
import type { AnalysisResult } from "@/types";

interface AnalysisResultsProps {
  results: AnalysisResult;
  onReset: () => void;
  photoName?: string;
  photoBase64?: string;
}

const getRiskIcon = (level: "low" | "medium" | "high") => {
  switch (level) {
    case "high":
      return <AlertTriangle className="w-5 h-5" />;
    case "medium":
      return <AlertCircle className="w-5 h-5" />;
    case "low":
      return <Info className="w-5 h-5" />;
  }
};

const getRiskStyles = (level: "low" | "medium" | "high") => {
  switch (level) {
    case "high":
      return {
        container:
          "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
        icon: "text-red-600 dark:text-red-400",
        badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        title: "text-red-900 dark:text-red-100",
      };
    case "medium":
      return {
        container:
          "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30",
        icon: "text-yellow-600 dark:text-yellow-400",
        badge:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        title: "text-yellow-900 dark:text-yellow-100",
      };
    case "low":
      return {
        container:
          "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
        icon: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        title: "text-blue-900 dark:text-blue-100",
      };
  }
};

export default function AnalysisResults({
  results,
  onReset,
  photoName,
  photoBase64,
}: AnalysisResultsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfError(null);

      await generateSafetyAnalysisPDF({
        analysisResults: results,
        photoName: photoName || "workplace-photo",
        analysisDate: new Date(),
        photoBase64: photoBase64,
      });

      // Success feedback could be added here
    } catch (error) {
      console.error("PDF generation error:", error);
      setPdfError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const hasRisks = results.risks && results.risks.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Results Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Safety Analysis Results
        </h2>
        {hasRisks ? (
          <p className="text-muted-foreground">
            Found {results.risks.length} potential safety{" "}
            {results.risks.length === 1 ? "risk" : "risks"}
          </p>
        ) : (
          <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span className="font-medium">
                No risks detected. Everything looks safe!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Risk List */}
      {hasRisks && (
        <div className="space-y-4">
          {results.risks.map((risk, index) => {
            const styles = getRiskStyles(risk.level);
            return (
              <div
                key={index}
                className={cn(
                  "border rounded-lg p-4 transition-all duration-200",
                  styles.container
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Risk Icon */}
                  <div className={cn("flex-shrink-0 mt-0.5", styles.icon)}>
                    {getRiskIcon(risk.level)}
                  </div>

                  {/* Risk Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={cn("font-semibold", styles.title)}>
                        {risk.title}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full uppercase tracking-wide",
                          styles.badge
                        )}
                      >
                        {risk.level} Risk
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      <strong>Recommendation:</strong> {risk.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PDF Error Message */}
      {pdfError && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{pdfError}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-colors",
            isGeneratingPDF
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary/90"
          )}
        >
          {isGeneratingPDF ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Report as PDF
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium transition-colors hover:bg-secondary/90"
        >
          <RotateCcw className="w-4 h-4" />
          Analyze New Photo
        </button>
      </div>

      {/* Summary Stats */}
      {hasRisks && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3 text-center">
            Risk Summary
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            {["high", "medium", "low"].map((level) => {
              const count = results.risks.filter(
                (r) => r.level === level
              ).length;
              return (
                <div key={level} className="space-y-1">
                  <div
                    className={cn(
                      "text-2xl font-bold",
                      level === "high"
                        ? "text-red-600 dark:text-red-400"
                        : level === "medium"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-blue-600 dark:text-blue-400"
                    )}
                  >
                    {count}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {level} Risk{count !== 1 ? "s" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
