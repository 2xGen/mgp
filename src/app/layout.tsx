
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AuthProvider } from "./auth-provider";
import { Inter, Lexend } from "next/font/google";
import { CookieConsentProvider } from "@/components/cookie-consent-provider";
import CookieBanner from "@/components/cookie-banner";
import TrackingScripts from "@/components/tracking-scripts";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" });

const logoUrl = "https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/MGP%20logo120px.png";
const faviconUrl =
  "https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/MGP%20logo%20fav.png";
const ogImageUrl = "https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/opengraph.jpg";

const title = "GBP Management – Fix Poor Google Business Profile with AI";
const description = "Poor GBP management costs you customers. Fix it with AI-powered Google Business Profile management: AI-powered review replies, one dashboard, more local traffic.";


export const metadata: Metadata = {
  metadataBase: new URL('https://mygoprofile.com'),
  title: { default: title, template: '%s | MyGoProfile' },
  description: description,
  verification: {
    google: 'zhi3OMPWC6QozOcvsYOlRuh5y7bPK8HnnvAqSpuFRfE',
  },
  icons: {
    icon: faviconUrl,
    shortcut: faviconUrl,
    apple: faviconUrl,
  },
  openGraph: {
    siteName: 'MyGoProfile',
    url: 'https://mygoprofile.com',
    title: title,
    description: description,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'GBP Management – Fix poor Google Business Profile with AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
          {/* The favicon link is now managed by the metadata object */}
      </head>
      <body className={`${inter.variable} ${lexend.variable} font-body antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <CookieConsentProvider>
            {children}
            <Toaster />
            <CookieBanner />
            <Suspense fallback={null}>
              <TrackingScripts />
            </Suspense>
          </CookieConsentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
