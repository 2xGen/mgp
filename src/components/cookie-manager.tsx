"use client";

import { useCookieConsent } from "./cookie-consent-provider";

export default function CookieManager() {
    const { resetConsent } = useCookieConsent();

    return (
        <button onClick={resetConsent} className="hover:text-primary hover:underline">
            Manage Cookies
        </button>
    )
}
