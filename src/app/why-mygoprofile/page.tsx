import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Check,
  ArrowRight,
  Clock,
  TrafficCone,
  Hourglass,
  Bot,
  BarChart,
  Users,
  ShieldCheck,
  Lock,
  Monitor,
  Menu,
  HeartPulse,
  ListChecks,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const canonicalPath = '/why-mygoprofile';
const canonicalUrl = `https://mygoprofile.com${canonicalPath}`;

export const metadata: Metadata = {
  title: 'Why MyGoProfile? GBP Management Software That Puts Your Profile on Autopilot',
  description:
    'MyGoProfile is Google Business Profile (GBP) management software that finds what holds your profile back, prioritizes fixes, and uses AI for posts and review replies — from one dashboard. 14-day free trial.',
  keywords: [
    'MyGoProfile',
    'goprofile',
    'GBP management',
    'Google Business Profile management',
    'GBP management software',
    'Google Business Profile software',
    'AI Google Business Profile',
    'multi-location GBP management',
    'GBP optimization tool',
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: 'Why MyGoProfile? GBP Management That Puts Your Profile on Autopilot',
    description:
      'Diagnose your Google Business Profile, see what to fix next, and use AI to reply to reviews and publish posts — all in one GBP management dashboard.',
    url: canonicalUrl,
    siteName: 'MyGoProfile',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why MyGoProfile? GBP Management Software',
    description:
      'Profile Health, prioritized actions, and AI for reviews and posts — Google Business Profile management in one place.',
  },
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Why MyGoProfile? GBP Management Software',
  description:
    'MyGoProfile is GBP management software that diagnoses your Google Business Profile, prioritizes fixes, and helps you act with AI.',
  url: canonicalUrl,
  isPartOf: {
    '@type': 'WebSite',
    name: 'MyGoProfile',
    url: 'https://mygoprofile.com',
  },
  about: {
    '@type': 'SoftwareApplication',
    name: 'MyGoProfile',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'EUR',
      description: 'Starter plan from €29/mo · 14-day free trial',
    },
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is MyGoProfile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MyGoProfile (sometimes searched as “goprofile”) is Google Business Profile management software. It scores your profile health, shows what to fix next, and uses AI to help draft review replies and Google posts from one dashboard.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is GBP management software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GBP management software helps you run your Google Business Profile without living in Google’s native tools: track performance, reply to reviews, publish posts, manage photos and locations, and keep the profile optimized for local search. MyGoProfile focuses on diagnose → prioritize → fix with AI assistance.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is MyGoProfile different from ChatGPT or Gemini for GBP?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'General AI chatbots can draft copy if you paste context. MyGoProfile is connected to your Google Business Profile, so it already knows the review, rating, and performance data — and you can act from the same dashboard. See our ChatGPT vs Gemini vs MyGoProfile comparison for details.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can MyGoProfile manage multiple Google Business Profiles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Growth and Agency plans support multiple locations with comparison and multi-location overview tools, plus team seats so you can assign people without sharing your Google password.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free trial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every plan includes a 14-day free trial with no credit card required. Plans start at €29/mo for one location.',
      },
    },
  ],
};

const painPoints = [
  {
    icon: Clock,
    title: 'Unanswered reviews',
    description:
      'Slow or missing review replies hurt trust — and Google treats engagement as a local SEO signal.',
    stat: '100%',
    stat_description: 'response rate is the bar competitive profiles aim for.',
  },
  {
    icon: TrafficCone,
    title: 'Neglected GBP management',
    description:
      'Incomplete hours, stale photos, and outdated categories mean customers searching nearby never see you.',
    stat: 'Profile gaps',
    stat_description: 'quietly kill Local Pack visibility over time.',
  },
  {
    icon: Hourglass,
    title: 'Manual multi-location chaos',
    description:
      'Logging in and out of Google accounts to manage several profiles doesn’t scale for owners or agencies.',
    stat: 'Hours/week',
    stat_description: 'lost switching tabs instead of fixing what matters.',
  },
];

const solutions = [
  {
    icon: HeartPulse,
    title: 'Profile Health & diagnosis',
    description:
      'See what’s holding your Google Business Profile back — incomplete fields, freshness gaps, and engagement issues — in one score.',
    benefit: 'Know what’s wrong',
  },
  {
    icon: ListChecks,
    title: 'What to do next',
    description:
      'A short prioritized action list so GBP management isn’t another analytics dump — you know the highest-impact fixes first.',
    benefit: 'Clear next steps',
  },
  {
    icon: Bot,
    title: 'AI review replies',
    description:
      'Draft on-brand replies in seconds (friendly, formal, concise). You approve before posting — safe human-in-the-loop automation.',
    benefit: 'Reply without the blank page',
  },
  {
    icon: Sparkles,
    title: 'AI Google posts',
    description:
      'Draft announcements, offers, and events, add photos, and publish to Search and Maps to keep the profile active.',
    benefit: 'Stay fresh on Google',
  },
  {
    icon: BarChart,
    title: 'Performance insights',
    description:
      'Views, searches, calls, and directions — this period vs the last — so you see what moved and what needs attention.',
    benefit: 'Data you can act on',
  },
  {
    icon: Monitor,
    title: 'Multi-location GBP management',
    description:
      'Compare locations, catch profiles that need replies, and run multiple businesses from one screen on Growth and Agency.',
    benefit: 'Scale without tab chaos',
  },
];

const securityPoints = [
  {
    icon: ShieldCheck,
    title: 'No shared passwords',
    description: 'We never ask for or store your Google password. Your credentials stay private.',
  },
  {
    icon: Lock,
    title: 'Google OAuth 2.0',
    description: 'Connections use Google’s official authentication — the same standard APIs Google provides.',
  },
  {
    icon: Check,
    title: 'API-compliant by design',
    description: 'Built on Google’s Business Profile APIs for reliability and policy-aligned access.',
  },
  {
    icon: Users,
    title: 'Role-based team access',
    description: 'Invite teammates to specific locations without sharing your master Google login.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Connect your GBP',
    description: 'Securely link your Google Business Profile with Google OAuth. No password sharing.',
  },
  {
    step: 2,
    title: 'Diagnose & prioritize',
    description: 'Profile Health scores the listing and shows a short “what to do next” list.',
  },
  {
    step: 3,
    title: 'Fix with AI',
    description: 'Draft replies and posts, request more reviews, then re-check your score — from one dashboard.',
  },
];

const guideLinks = [
  {
    href: '/resources/google-business-profile-optimization',
    title: 'Complete GBP optimization guide',
    blurb: 'NAP, categories, photos, posts, and reviews — the full checklist.',
  },
  {
    href: '/resources/does-responding-to-google-reviews-boost-seo',
    title: 'Does responding to reviews help SEO?',
    blurb: 'Why reply rate matters for local ranking and trust.',
  },
  {
    href: '/resources/how-to-automate-gbp-review-replies-with-ai',
    title: 'Automate GBP review replies safely',
    blurb: 'Human-in-the-loop AI — not robotic auto-posting.',
  },
  {
    href: '/resources/multi-location-seo-management',
    title: 'Multi-location GBP management',
    blurb: 'Run multiple profiles without losing local relevance.',
  },
  {
    href: '/resources/comparing-chatgpt-gemini-mygoprofile',
    title: 'ChatGPT vs Gemini vs MyGoProfile',
    blurb: 'Why a specialized GBP tool beats copy-paste AI.',
  },
  {
    href: '/resources/top-google-business-profile-mistakes',
    title: 'Top Google Business Profile mistakes',
    blurb: 'NAP, categories, reviews, and photos that cost customers.',
  },
];

const faqs = [
  {
    q: 'What is MyGoProfile?',
    a: 'MyGoProfile (also found when people search “goprofile”) is Google Business Profile management software. It diagnoses your listing with Profile Health, prioritizes fixes, and uses AI to help with review replies and Google posts — all in one dashboard.',
  },
  {
    q: 'What does GBP management mean?',
    a: 'GBP management is the ongoing work of keeping your Google Business Profile accurate, active, and competitive: hours, categories, photos, posts, reviews, Q&A, and performance. Manual GBP management eats hours; MyGoProfile turns it into a clear diagnose → fix workflow.',
  },
  {
    q: 'How is this different from managing GBP inside Google?',
    a: 'Google’s tools show you the profile and raw insights. MyGoProfile adds a decision layer: health scoring, prioritized actions, AI drafts, review request kit, team access, and multi-location comparison — without logging into each account separately.',
  },
  {
    q: 'Can I manage multiple Google Business Profiles?',
    a: 'Yes. Starter covers 1 location; Growth up to 3; Agency up to 10 — with location comparison and overview on multi-location plans. Ideal for multi-location businesses, franchises, and agencies.',
  },
  {
    q: 'Is there a free trial of MyGoProfile?',
    a: 'Yes — 14 days, no credit card. Same toolkit on every plan; you mainly pay for more locations. See pricing for Starter (€29), Growth (€49), and Agency (€99).',
  },
];

const gradientText =
  'bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent';

export default function WhyMyGoProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo />
            <span>MyGoProfile</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link href="/why-mygoprofile">
              <Button variant="ghost">Why MyGoProfile?</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/resources">
              <Button variant="ghost">Resources</Button>
            </Link>
            <Link href="/login">
              <Button>Start free trial</Button>
            </Link>
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
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <Logo />
                  <span>MyGoProfile</span>
                </Link>
                <Link href="/why-mygoprofile" className="hover:text-foreground">
                  Why MyGoProfile?
                </Link>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
                <Link href="/resources" className="text-muted-foreground hover:text-foreground">
                  Resources
                </Link>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  Start free trial
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-16 md:py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 to-transparent" />
          <div className="hero-pattern absolute inset-0 -z-10 opacity-40" />
          <div className="container relative max-w-screen-lg">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Why MyGoProfile?' },
              ]}
            />
            <div className="mt-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                GBP management software
              </p>
              <h1 className="mt-3 font-headline text-4xl font-semibold tracking-tight md:text-5xl">
                Why{' '}
                <span className={gradientText}>
                  MyGoProfile
                </span>{' '}
                for Google Business Profile management?
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
                MyGoProfile (the product people often search as “goprofile”) puts your{' '}
                <strong className="font-medium text-foreground">Google Business Profile on autopilot</strong>
                : we find what’s holding your listing back, tell you what to fix, and use AI to help you
                fix it — reviews, posts, and multi-location GBP management in one dashboard.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/login">
                  <Button size="lg" className="px-8 py-6 text-base">
                    Start 14-day free trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                    See pricing
                  </Button>
                </Link>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                No credit card · Plans from €29/mo · Same toolkit, priced by locations
              </p>
            </div>
          </div>
        </section>

        <section className="bg-muted/20 py-16">
          <div className="container max-w-screen-lg">
            <h2 className="text-center font-headline text-3xl font-semibold tracking-tight md:text-4xl">
              Poor{' '}
              <span className={gradientText}>GBP management</span>{' '}
              costs you customers
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-muted-foreground">
              Most local businesses don’t lose visibility because of bad service — they lose it because
              reviews sit unanswered, photos go stale, and nobody owns day-to-day Google Business Profile
              management. MyGoProfile is built to close that gap.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {painPoints.map((point) => (
                <Card key={point.title} className="text-left">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-destructive/10 text-destructive">
                        <point.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{point.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                    <div className="mt-4 border-t pt-4">
                      <p className="text-2xl font-bold text-destructive">{point.stat}</p>
                      <p className="text-xs text-muted-foreground">{point.stat_description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-screen-lg">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                How{' '}
                <span className={gradientText}>MyGoProfile</span>{' '}
                improves GBP management
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Not another metrics wall. A workflow: <strong className="text-foreground">diagnose → prioritize → fix</strong>{' '}
                — the same core product whether you run one location or ten.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {solutions.map((solution) => (
                <Card key={solution.title} className="text-left shadow-sm transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <solution.icon className="h-6 w-6" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{solution.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{solution.description}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-brand-green/10 p-3 text-sm font-semibold text-green-700 dark:text-green-400">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>{solution.benefit}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/15 py-16">
          <div className="container max-w-screen-lg text-center">
            <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
              How it{' '}
              <span className={gradientText}>works</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Connect once. See what’s wrong. Fix it with AI — then keep your Google Business Profile healthy.
            </p>
            <div className="relative mt-14 grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-border md:block" />
              {howItWorks.map((step) => (
                <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-primary bg-background text-lg font-bold text-primary">
                    {step.step}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-screen-lg text-center">
            <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
              Secure{' '}
              <span className={gradientText}>GBP management</span>
              {' — '}backed by Google OAuth
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              Team members get access inside MyGoProfile. Your Google password never leaves Google.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {securityPoints.map((point) => (
                <div key={point.title} className="flex flex-col items-center text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-primary bg-background text-primary">
                    <point.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{point.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-screen-lg">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                Free guides on{' '}
                <span className={gradientText}>GBP management</span>
                {' & '}local SEO
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Deep-dive articles that pair with the product — optimization, review replies, photos, and multi-location.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guideLinks.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="rounded-xl border bg-background p-5 text-left transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
                >
                  <p className="font-semibold text-foreground">{guide.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{guide.blurb}</p>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-center">
              <Link href="/resources" className="text-sm font-semibold text-primary hover:underline">
                View all GBP management guides →
              </Link>
            </p>
          </div>
        </section>

        <section className="bg-muted/10 py-16">
          <div className="container max-w-screen-md">
            <div className="mb-10 flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="font-headline text-3xl font-semibold tracking-tight">
                <span className={gradientText}>MyGoProfile</span> FAQ
              </h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-xl border bg-background p-5">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-lg text-center">
            <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
              Put your Google Business Profile{' '}
              <span className={gradientText}>
                on autopilot
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free for 14 days. No credit card. Cancel anytime.
            </p>
            <Link href="/login" className="mt-8 inline-block">
              <Button size="lg" className="px-10 py-6 text-base">
                Start free trial
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
