"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa-utils";

export default function PWAProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register service worker in production
    if (process.env.NODE_ENV === "production") {
      registerServiceWorker();
    }
  }, []);

  return <>{children}</>;
}
