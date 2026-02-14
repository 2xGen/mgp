
"use client";

import { useCookieConsent } from './cookie-consent-provider';
import { Button } from './ui/button';
import Link from 'next/link';

export default function CookieBanner() {
  const { showBanner, grantConsent, denyConsent } = useCookieConsent();

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4">
      <div className="max-w-screen-xl mx-auto p-6 bg-card border shadow-2xl rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-card-foreground">
            <h3 className="font-semibold">We Value Your Privacy</h3>
            <p className="text-muted-foreground mt-1">
              We use cookies to enhance your browsing experience and analyze site traffic to improve our service. By clicking "Accept", you help us make MyGoProfile better.
              Learn more in our{' '}
              <Link href="/cookies" className="font-semibold text-primary hover:underline">
                Cookie Policy
              </Link>.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={denyConsent}>Decline</Button>
            <Button onClick={grantConsent}>Accept</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
