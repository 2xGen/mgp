import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About 2xGen - The Studio Behind MyGoProfile',
  description: '2xGen builds and operates digital platforms that combine strategic positioning, scalable architecture, and measurable impact.',
};

const platforms = [
  { name: 'TopTours.ai', tagline: 'AI-powered discovery for global travel experiences', domain: 'toptours.ai', url: 'https://toptours.ai' },
  { name: 'ArubaBuddies.com', tagline: 'Curated local trip planning & itineraries', domain: 'arubabuddies.com', url: 'https://arubabuddies.com' },
  { name: 'FactuurBaas', tagline: 'Streamlined invoicing for freelancers & small businesses', domain: 'factuurbaas.nl', url: 'https://factuurbaas.nl' },
  { name: 'OneHappyFinance', tagline: 'Transparent, actionable financial information for Aruba', domain: 'onehappyfinance.com', url: 'https://onehappyfinance.com' },
  { name: 'AruList', tagline: 'Community-driven marketplace supporting sustainable second-hand commerce', domain: 'arulist.com', url: 'https://arulist.com' },
  { name: 'TOF Sports', tagline: 'Digital and physical ecosystem for youth tennis & padel development', domain: 'tofsports.nl', url: 'https://tofsports.nl' },
  { name: 'MyGoProfile', tagline: 'AI-driven local profile management for businesses', domain: 'mygoprofile.com', url: 'https://mygoprofile.com' },
  { name: 'BiteReserve', tagline: 'Track exactly which guest sources send revenue, no guessing', domain: 'bitereserve.com', url: 'https://bitereserve.com' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '2xGen',
  url: 'https://mygoprofile.com/2xgen',
  description: '2xGen builds and operates digital platforms that combine strategic positioning, scalable architecture, and measurable impact.',
  knowsAbout: platforms.map((p) => ({
    '@type': 'SoftwareApplication',
    name: p.name,
    url: p.url,
    description: p.tagline,
  })),
};

export default function TwoXGenPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo />
            <span>MyGoProfile</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link href="/why-mygoprofile"><Button variant="ghost">Why MyGoProfile?</Button></Link>
            <Link href="/pricing"><Button variant="ghost">Pricing</Button></Link>
            <Link href="/resources"><Button variant="ghost">Resources</Button></Link>
            <Link href="/login"><Button>Start free trial</Button></Link>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold"><Logo /><span>MyGoProfile</span></Link>
                <Link href="/why-mygoprofile" className="text-muted-foreground hover:text-foreground">Why MyGoProfile?</Link>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
                <Link href="/resources" className="text-muted-foreground hover:text-foreground">Resources</Link>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">Start free trial</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20">
          <div className="container relative z-10 max-w-screen-lg text-center">
            <h1 className="font-headline text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Meet <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">2xGen</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
              2xGen builds and operates digital platforms that combine strategic positioning, scalable architecture, and measurable impact.
            </p>
          </div>
        </section>

        <section className="border-t py-12">
          <div className="container max-w-2xl space-y-6">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex flex-col gap-2 rounded-lg border bg-card p-5 transition-colors hover:bg-muted/30"
              >
                <h3 className="font-headline text-lg font-semibold">{platform.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {platform.tagline} ({platform.domain})
                </p>
                {platform.domain === 'mygoprofile.com' ? (
                  <Link href="/" className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline">
                    Visit MyGoProfile
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                ) : (
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Visit {platform.name}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t py-16">
          <div className="container max-w-2xl text-center">
            <p className="text-lg text-muted-foreground">
              Each platform reflects our philosophy: strategic positioning, compounding digital leverage, and long-term impact.
            </p>
            <Link href="/pricing" className="mt-8 inline-block">
              <Button size="lg" className="px-10 py-6 text-base">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
