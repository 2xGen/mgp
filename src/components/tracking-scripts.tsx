"use client";

import { useCookieConsent } from "./cookie-consent-provider";
import Script from "next/script";
import { useEffect } from "react";

export default function TrackingScripts() {
    const { consentStatus } = useCookieConsent();
    
    useEffect(() => {
        if (consentStatus === 'granted') {
            // Logic to initialize Metricool tracker if it's not already loaded.
            // The script tag itself will handle loading, this is for re-initialization on consent change.
            if (typeof (window as any).beTracker === 'function') {
                (window as any).beTracker.t({ hash: "9e14adf51469a619f86cfa6b2ea4ad56" });
            }
        }
    }, [consentStatus]);
    
    if (consentStatus !== 'granted') {
        return null;
    }
    
    return (
        <>
            <Script id="metricool-tracker" strategy="afterInteractive">
              {`
                function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"9e14adf51469a619f86cfa6b2ea4ad56"})});
              `}
            </Script>
        </>
    );
}
