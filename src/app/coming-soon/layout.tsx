import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'At Capacity — Join the Waitlist | MyGoProfile',
  description: "We've reached our maximum users and are scaling to welcome more. Join the waitlist and we'll notify you when we're ready for you.",
  robots: 'index, follow',
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
