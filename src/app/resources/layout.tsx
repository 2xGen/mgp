import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GBP Management Guides – Fix Poor Google Business Profile',
  description:
    'Fix poor GBP management with free guides: optimization, AI review replies, local SEO, and multi-location. Step-by-step Google Business Profile advice that gets you more customers.',
  openGraph: {
    title: 'GBP Management Guides – Fix Poor Google Business Profile',
    description:
      'Free guides to fix poor GBP management: optimization, AI reviews, local SEO. Practical Google Business Profile advice.',
    url: 'https://mygoprofile.com/resources',
    siteName: 'MyGoProfile',
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
