"use client";

import { X, Share, Plus, Menu } from "lucide-react";

interface InstallInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
  browserType: "ios-safari" | "desktop" | "mobile-other";
}

export default function InstallInstructions({
  isOpen,
  onClose,
  browserType,
}: InstallInstructionsProps) {
  if (!isOpen) return null;

  const getInstructions = () => {
    switch (browserType) {
      case "ios-safari":
        return {
          title: "Install on iOS",
          steps: [
            {
              icon: <Share className="h-5 w-5 text-blue-600" />,
              text: "Tap the Share button (square with arrow up)",
            },
            {
              icon: <Plus className="h-5 w-5 text-green-600" />,
              text: "Scroll down and tap 'Add to Home Screen'",
            },
            {
              icon: <Plus className="h-5 w-5 text-green-600" />,
              text: "Tap 'Add' to confirm installation",
            },
          ],
        };
      case "desktop":
        return {
          title: "Install on Desktop",
          steps: [
            {
              icon: <Menu className="h-5 w-5 text-blue-600" />,
              text: "Click the menu button (⋮) in your browser",
            },
            {
              icon: <Plus className="h-5 w-5 text-green-600" />,
              text: "Look for 'Install Work Safety Analyzer'",
            },
            {
              icon: <Plus className="h-5 w-5 text-green-600" />,
              text: "Click 'Install' to add to your computer",
            },
          ],
        };
      case "mobile-other":
        return {
          title: "Install on Mobile",
          steps: [
            {
              icon: <Menu className="h-5 w-5 text-blue-600" />,
              text: "Open your browser menu",
            },
            {
              icon: <Plus className="h-5 w-5 text-green-600" />,
              text: "Look for 'Add to Home Screen' or 'Install App'",
            },
            {
              icon: <Plus className="h-5 w-5 text-green-600" />,
              text: "Follow the prompts to install",
            },
          ],
        };
      default:
        return { title: "Install App", steps: [] };
    }
  };

  const { title, steps } = getInstructions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">{step.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
