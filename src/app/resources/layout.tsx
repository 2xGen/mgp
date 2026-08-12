import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GBP Management Guides 2026 – Google Business Profile Optimization & AI',
  description:
    'Free GBP management guides: best time to post on Google Business Profile, does responding to reviews help SEO, GBP optimization 2026, categories, photos, UTM tagging, and multi-location management.',
  keywords: [
    'GBP management',
    'GBP optimization',
    'google business profile guides',
    'best time to post on google business profile',
    'does responding to reviews help seo',
    'google business profile mistakes',
    'gbp guide 2026',
  ],
  alternates: {
    canonical: 'https://mygoprofile.com/resources',
  },
  openGraph: {
    title: 'GBP Management Guides 2026 – Optimization, Reviews & AI',
    description:
      'Practical Google Business Profile guides: posting times, review replies & SEO, categories, photos, near me optimization, and multi-location GBP management.',
    url: 'https://mygoprofile.com/resources',
    siteName: 'MyGoProfile',
    type: 'website',
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
