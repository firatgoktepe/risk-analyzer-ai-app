"use client";

import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ErrorDisplayProps {
  message: string;
  onDismiss?: () => void;
  variant?: "error" | "warning";
}

export default function ErrorDisplay({
  message,
  onDismiss,
  variant = "error",
}: ErrorDisplayProps) {
  const t = useTranslations();
  const isError = variant === "error";

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto rounded-lg border p-4 mb-6",
        isError
          ? "bg-destructive/10 border-destructive/20 text-destructive"
          : "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 mt-0.5" />
        </div>

        {/* Error Message */}
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              "flex-shrink-0 p-1 rounded-md transition-colors",
              isError
                ? "hover:bg-destructive/20"
                : "hover:bg-yellow-200 dark:hover:bg-yellow-800"
            )}
            aria-label={t("errors.dismiss")}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
