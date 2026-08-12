
import { Logo } from '@/components/icons';
import Link from 'next/link';
import CookieManager from '../cookie-manager';
import SecurePayments from '@/components/landing/secure-payments';

const popularGuides = [
  { label: 'Complete GBP optimization guide', href: '/resources/google-business-profile-optimization' },
  { label: 'Top GBP mistakes', href: '/resources/top-google-business-profile-mistakes' },
  { label: 'AI review replies', href: '/resources/how-to-automate-gbp-review-replies-with-ai' },
  { label: 'Multi-location GBP', href: '/resources/multi-location-seo-management' },
];

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container max-w-screen-xl py-8">
        <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Logo />
              <p className="font-semibold text-foreground">MyGoProfile</p>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Fix poor GBP management with AI. More traffic, faster review replies, one dashboard.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Product</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/why-mygoprofile" className="hover:text-primary hover:underline text-muted-foreground">
                  Why MyGoProfile
                </Link>
                <Link href="/pricing" className="hover:text-primary hover:underline text-muted-foreground">
                  Pricing
                </Link>
                <Link href="/resources" className="hover:text-primary hover:underline text-muted-foreground">
                  All guides
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Popular guides</p>
              <div className="flex flex-col gap-2 text-sm">
                {popularGuides.map(({ label, href }) => (
                  <Link key={href} href={href} className="hover:text-primary hover:underline text-muted-foreground">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Legal</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/terms" className="hover:text-primary hover:underline text-muted-foreground">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-primary hover:underline text-muted-foreground">
                  Privacy
                </Link>
                <Link href="/cookies" className="hover:text-primary hover:underline text-muted-foreground">
                  Cookies
                </Link>
                <CookieManager />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-6 border-t pt-6">
          <SecurePayments compact />
          <p className="text-center text-sm text-muted-foreground">
            Powered by{' '}
            <Link href="/2xgen" className="font-semibold text-primary hover:underline">
              2xGen
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
