"use client";

import { Brain, Zap } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border rounded-lg p-8 text-center">
        <div className="space-y-6">
          {/* Animated Icons */}
          <div className="flex justify-center items-center gap-4">
            <div className="relative">
              <Brain className="w-8 h-8 text-primary animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Zap className="w-4 h-4 text-yellow-500 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Analyzing Your Photo
            </h3>
            <p className="text-muted-foreground">
              AI is examining the workplace for potential safety risks...
            </p>
          </div>

          {/* Progress Spinner */}
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>

          {/* Analysis Steps */}
          <div className="space-y-3 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-muted-foreground">
                Processing image data...
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-300" />
              <span className="text-muted-foreground">
                Identifying safety elements...
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-700" />
              <span className="text-muted-foreground">
                Evaluating risk levels...
              </span>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="text-xs text-muted-foreground">
            This usually takes 10-30 seconds
          </div>
        </div>
      </div>
    </div>
  );
}
