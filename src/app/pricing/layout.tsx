import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - GBP Management Plans',
  description:
    'Simple pricing for AI-powered Google Business Profile management: $29–$99/mo. AI review replies, one dashboard, multi-location. 14-day free trial, no credit card required.',
  openGraph: {
    title: 'Pricing | MyGoProfile - GBP Management',
    description: 'Plans from $29/mo. AI review replies, one dashboard. 14-day free trial.',
    url: 'https://mygoprofile.com/pricing',
    siteName: 'MyGoProfile',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
