"use client";

import { useCallback, useState } from "react";
import { Upload, Camera, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { UploadedPhoto } from "@/types";

interface PhotoUploadProps {
  onPhotoUpload: (photo: UploadedPhoto) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function PhotoUpload({ onPhotoUpload }: PhotoUploadProps) {
  const t = useTranslations();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return (
          t("errors.invalidFormat") ||
          "Please upload a valid image file (JPEG, PNG, or WebP)"
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return t("errors.fileSize") || "File size must be less than 10MB";
      }
      return null;
    },
    [t]
  );

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setUploadError(null);

      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        setIsProcessing(false);
        return;
      }

      try {
        // Create preview URL
        const preview = URL.createObjectURL(file);

        // Convert to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Failed to read file"));
            }
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });

        onPhotoUpload({
          file,
          preview,
          base64,
        });
      } catch (error) {
        console.error("Photo processing error:", error);
        setUploadError(
          t("errors.processing") ||
            "Failed to process the image. Please try again."
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [onPhotoUpload, t, validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleCameraCapture = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
          isProcessing && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
            <Upload
              className={cn(
                "w-8 h-8 transition-colors",
                isDragOver ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {t("upload.title")}
            </h3>
            <p className="text-muted-foreground">{t("upload.dragAndDrop")}</p>
            <p className="text-sm text-muted-foreground">
              {t("upload.supportedFormats")}
            </p>
          </div>

          {/* File Input */}
          <div className="space-y-3">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium cursor-pointer transition-colors hover:bg-primary/90",
                isProcessing && "opacity-50 cursor-not-allowed"
              )}
            >
              <ImageIcon className="w-4 h-4" />
              {t("upload.chooseFromGallery")}
            </label>
          </div>

          {/* Mobile Camera Input */}
          <div className="md:hidden">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
              id="camera-capture"
              disabled={isProcessing}
            />
            <label
              htmlFor="camera-capture"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium cursor-pointer transition-colors hover:bg-secondary/90",
                isProcessing && "opacity-50 cursor-not-allowed"
              )}
            >
              <Camera className="w-4 h-4" />
              {t("upload.takePhoto")}
            </label>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              {t("upload.analyzing")}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive font-medium">{uploadError}</p>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {t("upload.helpText") ||
            "Upload a clear photo of your workplace for AI-powered safety analysis"}
        </p>
      </div>
    </div>
  );
}
