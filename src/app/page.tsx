'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Play, Search, ListChecks, Sparkles, Check } from 'lucide-react';
import DashboardPreview from '@/components/landing/dashboard-preview';
import Link from 'next/link';
import AiReplyPreview from '@/components/landing/ai-reply-preview';
import MultiLocationPreview from '@/components/landing/multi-location-preview';
import TeamManagementPreview from '@/components/landing/team-management-preview';
import Footer from '@/components/landing/footer';
import PostPublishingPreview from '@/components/landing/post-publishing-preview';
import ProfileHealthPreview from '@/components/landing/profile-health-preview';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from './auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  PLAN_LABELS,
  PLAN_PRICE_MONTHLY_EUR,
  planScaleLine,
  type PlanId,
} from '@/lib/plans';
import { cn } from '@/lib/utils';

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: 'Diagnose',
    description: 'Profile Health finds what is incomplete, outdated, or holding you back on Google.',
  },
  {
    icon: ListChecks,
    title: 'Prioritize',
    description: 'A short “what to do next” list — high-impact fixes first, not endless charts.',
  },
  {
    icon: Sparkles,
    title: 'Fix',
    description: 'Use AI to draft posts and review replies, request more reviews — then re-check your score.',
  },
] as const;

const FAQS = [
  {
    q: 'Do I need to approve everything?',
    a: 'Yes. MyGoProfile drafts and prioritizes — you stay in control. Approve replies and posts before they go live.',
  },
  {
    q: "What's included on every plan?",
    a: 'The full toolkit: Profile Health, prioritized actions, AI posts, AI review replies, review request kit, and performance insights. Plans differ by locations and team seats.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — 14 days, no credit card. Start on Starter, Growth, or Agency and connect your Google Business Profile.',
  },
] as const;

const TEASER_PLANS: PlanId[] = ['starter', 'growth', 'enterprise'];

function PricingTeaser() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="container max-w-screen-lg">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
            Same toolkit.{' '}
            <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
              Pay for locations.
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every plan includes Diagnose → Prioritize → Fix. Choose based on how many locations you manage.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TEASER_PLANS.map((planId) => (
            <Link
              key={planId}
              href="/pricing"
              className={cn(
                'rounded-xl border bg-background/80 p-5 text-center backdrop-blur transition-shadow hover:shadow-lg',
                planId === 'growth' && 'border-primary ring-1 ring-primary/20'
              )}
            >
              {planId === 'growth' && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  Most popular
                </p>
              )}
              <p className="font-headline text-xl font-semibold">{PLAN_LABELS[planId]}</p>
              <p className="mt-1 text-2xl font-bold">
                €{PLAN_PRICE_MONTHLY_EUR[planId]}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{planScaleLine(planId)}</p>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          14-day free trial · Annual billing saves ~17% ·{' '}
          <Link href="/pricing" className="font-semibold text-primary hover:underline">
            See full pricing
          </Link>
        </p>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-xl items-center justify-between">
          <Link href="/" className="font-semibold">
            MyGoProfile
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
                <Link href="/" className="text-lg font-semibold">
                  MyGoProfile
                </Link>
                <Link href="/why-mygoprofile" className="text-muted-foreground hover:text-foreground">
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
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-background to-background" />
            <div className="hero-pattern absolute inset-0 opacity-40" />
            <div className="absolute left-1/2 top-24 h-[min(40rem,120vw)] w-[min(40rem,120vw)] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
          </div>

          {/* Hero + system */}
          <section className="relative overflow-hidden px-4 pb-16 pt-10 text-center md:pb-20 md:pt-14">
            <div className="container relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5">
              <p className="font-headline text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                MyGoProfile
              </p>
              <h1 className="font-headline text-4xl font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-[3.4rem]">
                Your Google Business Profile,{' '}
                <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                  made simple.
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                MyGoProfile finds what&apos;s holding your profile back, prioritizes what matters, and helps you fix it with AI — all from one dashboard.
              </p>
              <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="w-full px-10 py-6 text-lg font-bold shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
                  >
                    Start 14-day free trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      className="group w-full border-2 px-8 py-6 text-base font-semibold sm:w-auto"
                    >
                      <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20 transition-colors group-hover:bg-primary/20">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </span>
                      See how it works
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="aspect-video max-w-3xl border-0 p-0">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Your Google Business Profile, made simple</DialogTitle>
                      <DialogDescription>
                        Diagnose, prioritize, and fix your Google Business Profile with MyGoProfile.
                      </DialogDescription>
                    </DialogHeader>
                    <iframe
                      className="h-full w-full rounded-lg"
                      src="https://www.youtube.com/embed/6GiXMQMIXpw?autoplay=1"
                      title="MyGoProfile overview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-muted-foreground">No credit card · Plans from €29/mo</p>
            </div>

            <div className="container relative z-10 mx-auto mt-16 max-w-screen-lg md:mt-20">
              <div className="mx-auto mb-10 max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  The system
                </p>
                <h2 className="mt-2 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
                  Diagnose.{' '}
                  <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                    Prioritize. Fix.
                  </span>
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Not another analytics wall — a clear loop from problem to action.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {HOW_IT_WORKS.map((step, i) => (
                  <div key={step.title} className="text-center md:text-left">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary md:mx-0">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-1 font-headline text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Core product proof */}
          <section className="relative py-16 md:py-20">
            <div className="container max-w-screen-xl">
              <ProfileHealthPreview />
            </div>
          </section>

          {/* Pricing early — after the promise is clear */}
          <PricingTeaser />

          {/* Feature details */}
          <section className="relative py-16 md:py-20">
            <div className="container max-w-screen-xl">
              <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
                <div className="flex flex-col items-start gap-4">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    Your dashboard
                  </div>
                  <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                    Performance and activity —{' '}
                    <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                      at a glance
                    </span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Views, reviews, and how people find you on Google — plus recent activity — so you always know what moved and what needs attention.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-brand-green" />
                      Compare this period vs the last one
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-brand-green" />
                      Switch metrics without leaving the page
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-brand-green" />
                      Spot new reviews and profile updates fast
                    </li>
                  </ul>
                  <Link href="/login">
                    <Button size="lg" className="mt-2">
                      Start free trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="relative min-w-0">
                  <div className="rounded-2xl border bg-gradient-to-br from-background to-muted/40 p-3 shadow-xl shadow-primary/10 sm:p-4">
                    <DashboardPreview />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative py-16 md:py-20">
            <div className="container max-w-screen-xl">
              <AiReplyPreview />
            </div>
          </section>

          <section className="relative py-16 md:py-20">
            <div className="container max-w-screen-xl">
              <PostPublishingPreview />
            </div>
          </section>

          <section className="relative py-16 md:py-20">
            <div className="container max-w-screen-xl">
              <MultiLocationPreview />
            </div>
          </section>

          <section className="relative py-16 md:py-20">
            <div className="container max-w-screen-xl">
              <TeamManagementPreview />
            </div>
          </section>

          <section className="relative py-16">
            <div className="container max-w-screen-lg">
              <div className="mx-auto mb-8 max-w-2xl text-center">
                <h2 className="font-headline text-2xl font-semibold tracking-tight md:text-3xl">
                  Learn how to fix your GBP
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/resources/google-business-profile-optimization"
                  className="rounded-lg border bg-background/60 p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
                >
                  <p className="font-semibold">GBP optimization guide 2026</p>
                  <p className="mt-1 text-sm text-muted-foreground">Full checklist for local search.</p>
                </Link>
                <Link
                  href="/resources/top-google-business-profile-mistakes"
                  className="rounded-lg border bg-background/60 p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
                >
                  <p className="font-semibold">GBP mistakes to avoid</p>
                  <p className="mt-1 text-sm text-muted-foreground">Fix ranking killers fast.</p>
                </Link>
                <Link
                  href="/resources/how-to-automate-gbp-review-replies-with-ai"
                  className="rounded-lg border bg-background/60 p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
                >
                  <p className="font-semibold">Automate review replies</p>
                  <p className="mt-1 text-sm text-muted-foreground">Safe AI workflow, not robots.</p>
                </Link>
                <Link
                  href="/resources/multi-location-seo-management"
                  className="rounded-lg border bg-background/60 p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
                >
                  <p className="font-semibold">Manage multiple GBP accounts</p>
                  <p className="mt-1 text-sm text-muted-foreground">Multi-location without tab chaos.</p>
                </Link>
              </div>
            </div>
          </section>

          <section className="relative py-16">
            <div className="container max-w-screen-md">
              <h2 className="mb-8 text-center font-headline text-2xl font-semibold tracking-tight md:text-3xl">
                FAQ
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq) => (
                  <div key={faq.q} className="rounded-xl border bg-background/70 p-5">
                    <h3 className="font-semibold">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative py-20">
            <div className="container max-w-lg text-center">
              <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                Diagnose. Prioritize.{' '}
                <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                  Fix.
                </span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start free for 14 days. No credit card. Cancel anytime.
              </p>
              <Link href="/login" className="mt-8 inline-block">
                <Button size="lg" className="px-10 py-6 text-base font-bold">
                  Start free trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RedirectManager() {
  const { user, isLoading, isSubscriptionLoading, subscription, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;
    if (isLoading || isSubscriptionLoading) return;
    if (hasChecked) return;

    if (user) {
      if (role === 'owner' && !subscription) {
        router.push('/welcome');
      } else if (role === 'teamMember' || (role === 'owner' && subscription)) {
        router.push('/dashboard');
      }
      setHasChecked(true);
    } else {
      setHasChecked(true);
    }
  }, [user, isLoading, isSubscriptionLoading, subscription, role, router, pathname, hasChecked]);

  const showLoader = (isLoading || isSubscriptionLoading) && pathname === '/';

  if (showLoader) {
    return (
      <div className="fixed inset-0 z-[100] flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
}

export default function Home() {
  return (
    <>
      <RedirectManager />
      <LandingPage />
    </>
  );
}
