"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import InstallInstructions from "./InstallInstructions";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [browserType, setBrowserType] = useState<
    "ios-safari" | "desktop" | "mobile-other"
  >("mobile-other");

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detect browser and platform
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const isDesktop = !isMobile;

    // Listen for the beforeinstallprompt event (Chrome/Edge only)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Only add beforeinstallprompt listener for Chrome/Edge
    if (!isSafari) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }
    window.addEventListener("appinstalled", handleAppInstalled);

    // Show install prompt based on browser capabilities
    const timer = setTimeout(() => {
      if (!isInstalled && !showInstallPrompt) {
        // For Safari (iOS), always show manual install instructions
        // For Chrome/Edge, only show if beforeinstallprompt didn't fire
        // For desktop Chrome, show with different messaging
        setShowInstallPrompt(true);
      }
    }, 10000); // Show after 10 seconds

    return () => {
      if (!isSafari) {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      }
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled, showInstallPrompt]);

  const handleInstallClick = async () => {
    // Detect browser and platform
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const isDesktop = !isMobile;

    if (deferredPrompt) {
      // Chrome/Edge with beforeinstallprompt support
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
      } catch (error) {
        console.log("Install prompt failed:", error);
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else {
      // Show instructions modal for browsers without beforeinstallprompt
      if (isIOS && isSafari) {
        setBrowserType("ios-safari");
      } else if (isDesktop) {
        setBrowserType("desktop");
      } else {
        setBrowserType("mobile-other");
      }
      setShowInstructions(true);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  // Don't show if already installed or dismissed
  if (
    isInstalled ||
    !showInstallPrompt ||
    sessionStorage.getItem("pwa-install-dismissed")
  ) {
    return null;
  }

  // Detect browser and platform for UI
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isDesktop = !isMobile;

  // Get appropriate button text and description
  const getInstallText = () => {
    if (deferredPrompt) {
      return {
        button: "Install",
        description:
          "Install this app on your device for quick access and offline use.",
      };
    } else if (isIOS && isSafari) {
      return {
        button: "Show Instructions",
        description: "Add this app to your home screen for quick access.",
      };
    } else if (isDesktop) {
      return {
        button: "Show Instructions",
        description: "Install this app on your computer for quick access.",
      };
    } else {
      return {
        button: "Show Instructions",
        description: "Add this app to your home screen for quick access.",
      };
    }
  };

  const { button, description } = getInstallText();

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Install App
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <Download className="h-3 w-3" />
              <span>{button}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200"
            >
              Not now
            </button>
          </div>
        </div>
      </div>

      <InstallInstructions
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        browserType={browserType}
      />
    </>
  );
}
