"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

export default function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "tr" : "en";

    startTransition(() => {
      // Handle locale switching properly
      let newPath;

      if (newLocale === "en") {
        // Switching to English - remove /tr prefix if present, or go to root
        if (pathname.startsWith("/tr")) {
          newPath = pathname.replace(/^\/tr/, "") || "/";
        } else if (pathname.startsWith("/en")) {
          newPath = pathname.replace(/^\/en/, "") || "/";
        } else {
          newPath = "/";
        }
      } else {
        // Switching to Turkish - add /tr prefix, removing any existing locale prefix
        if (pathname.startsWith("/en")) {
          newPath = pathname.replace(/^\/en/, "/tr") || "/tr";
        } else if (pathname.startsWith("/tr")) {
          newPath = pathname; // Already Turkish
        } else {
          newPath = `/tr${pathname === "/" ? "" : pathname}`;
        }
      }

      // Use window.location for full page reload to avoid hydration issues
      window.location.href = newPath;
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className={`
        fixed top-4 left-4 z-50 flex items-center justify-center
        w-12 h-12 rounded-full border-2 border-border bg-background
        hover:bg-accent hover:text-accent-foreground
        transition-all duration-200 shadow-lg
        ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      title={locale === "en" ? "Switch to Turkish" : "İngilizce'ye geç"}
    >
      <span className="text-2xl">{locale === "en" ? "🇬🇧" : "🇹🇷"}</span>
    </button>
  );
}
