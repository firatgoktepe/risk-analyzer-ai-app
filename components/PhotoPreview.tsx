"use client";

import Image from "next/image";
import { RotateCcw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadedPhoto } from "@/types";

interface PhotoPreviewProps {
  photo: UploadedPhoto;
  onAnalyze: () => void;
  onReset: () => void;
  isAnalyzing: boolean;
  hasResults: boolean;
}

export default function PhotoPreview({
  photo,
  onAnalyze,
  onReset,
  isAnalyzing,
  hasResults,
}: PhotoPreviewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Photo Display */}
      <div className="relative">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={photo.preview}
            alt="Uploaded workplace photo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* File Info */}
        <div className="mt-2 text-sm text-muted-foreground">
          <p>
            {photo.file.name} • {(photo.file.size / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {!hasResults && (
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-colors",
              isAnalyzing
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/90"
            )}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze Safety Risks
              </>
            )}
          </button>
        )}

        <button
          onClick={onReset}
          disabled={isAnalyzing}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium transition-colors",
            isAnalyzing
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-secondary/90"
          )}
        >
          <RotateCcw className="w-4 h-4" />
          Upload New Photo
        </button>
      </div>

      {/* Analysis Tips */}
      {!hasResults && !isAnalyzing && (
        <div className="bg-accent/50 border border-accent rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Analysis Tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Ensure the photo clearly shows the work area</li>
            <li>• Include workers, equipment, and surroundings</li>
            <li>• Good lighting helps improve analysis accuracy</li>
            <li>• Multiple angles may reveal different risks</li>
          </ul>
        </div>
      )}
    </div>
  );
}
