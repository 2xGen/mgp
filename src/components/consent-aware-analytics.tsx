"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useCookieConsent } from "./cookie-consent-provider";

/**
 * Client-only mount avoids @vercel/analytics Suspense SSR/CSR hydration mismatch.
 * Events are dropped until cookie consent is granted.
 */
export default function ConsentAwareAnalytics() {
  const { consentStatus } = useCookieConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Analytics
      beforeSend={(event) => {
        if (consentStatus !== "granted") return null;
        return event;
      }}
    />
  );
}
