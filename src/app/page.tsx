
'use client';

import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Loader2, Play } from 'lucide-react';
import DashboardPreview from '@/components/landing/dashboard-preview';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import AiReplyPreview from '@/components/landing/ai-reply-preview';
import MultiLocationPreview from '@/components/landing/multi-location-preview';
import SecureConnectPreview from '@/components/landing/secure-connect-preview';
import TeamManagementPreview from '@/components/landing/team-management-preview';
import Footer from '@/components/landing/footer';
import LocationSummaryPreview from '@/components/landing/location-summary-preview';
import AiSummaryPreview from '@/components/landing/ai-summary-preview';
import PostPublishingPreview from '@/components/landing/post-publishing-preview';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from './auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-xl items-center justify-between">
          <Link href="#" className="flex items-center gap-2 font-semibold">
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
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <Logo />
                  <span>MyGoProfile</span>
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
        <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-start overflow-hidden px-4 pt-6 pb-20 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/90 to-transparent" />
          <div className="hero-pattern absolute inset-0 -z-10" />
          <div className="absolute left-1/2 top-1/2 -z-10 h-[min(80rem,180vw)] w-[min(80rem,180vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-3xl" />
          <div className="container relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/5">
              Your Google profile is losing you customers
            </div>
            <h1 className="font-headline text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
              Dominate
              <br />
              <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent [filter:drop-shadow(0_0_24px_hsl(var(--primary)/0.15))]">
                Local Search
              </span>
              <br />
              <span className="text-foreground/90">With AI-Powered</span>
              <br />
              <span className="text-foreground">GBP Management</span>
            </h1>
            <p className="max-w-xl text-xl font-medium leading-snug text-foreground/90 md:text-2xl">
              Reply to every review in minutes. One dashboard. Start free in 2 minutes.
            </p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Link href="/pricing">
                <Button size="lg" className="w-full sm:w-auto px-10 py-6 text-lg font-bold shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30">
                  Start free trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="group w-full sm:w-auto border-2 px-8 py-6 text-base font-semibold">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20 transition-colors group-hover:bg-primary/20 group-hover:ring-primary/30 mr-2">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </span>
                    See how it works
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl aspect-video p-0 border-0">
                  <DialogHeader className="sr-only">
                    <DialogTitle>GBP Management – How to fix your Google Business Profile</DialogTitle>
                    <DialogDescription>A short video showing how to fix poor GBP management with AI.</DialogDescription>
                  </DialogHeader>
                  <iframe
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/6GiXMQMIXpw?autoplay=1"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-muted-foreground">
              14-day free trial · No credit card required
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-brand-green" />
                40% more traffic
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-brand-green" />
                8–12 hrs saved/week
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-brand-green" />
                AI reply in one click
              </span>
            </div>
          </div>
        </section>

        <section className="relative py-24">
          <div className="container grid max-w-screen-xl grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-5">
              <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                One dashboard. All your locations. AI replies in{' '}
                <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                  one click
                </span>
                .
              </h2>
              <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
                Connect your Google Business Profile and manage everything from one place—reviews, posts, performance. Draft replies with AI, approve, and post. No more jumping between tabs or missing a review.
              </p>
              <Link href="/pricing">
                <Button size="lg" className="w-full sm:w-auto">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <DashboardPreview />
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container max-w-screen-xl">
             <AiReplyPreview />
          </div>
        </section>

        <section className="py-24">
          <div className="container max-w-screen-xl">
            <MultiLocationPreview />
          </div>
        </section>

        <section className="py-24">
          <div className="container max-w-screen-xl">
            <SecureConnectPreview />
          </div>
        </section>

        <section className="py-24">
          <div className="container max-w-screen-xl">
            <TeamManagementPreview />
          </div>
        </section>

        <section className="py-24">
          <div className="container max-w-screen-xl">
            <PostPublishingPreview />
          </div>
        </section>

        <section className="py-24">
          <div className="container max-w-screen-lg space-y-12">
             <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                From Data to Decisions, <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">Instantly</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Stop guessing. Our AI analyzes your performance data and delivers clear, actionable insights so you can make smarter marketing decisions in a fraction of the time.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <AiSummaryPreview />
              <LocationSummaryPreview />
            </div>
          </div>
        </section>

        <section className="py-24 border-t">
          <div className="container max-w-screen-lg">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                Learn how to fix your <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">GBP</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Free guides on optimization, AI review replies, and multi-location GBP management.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/resources/google-business-profile-optimization" className="group rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                <p className="font-semibold group-hover:text-primary">Complete Guide to GBP (2026)</p>
                <p className="mt-1 text-sm text-muted-foreground">Optimize every part of your profile for local search.</p>
              </Link>
              <Link href="/resources/top-google-business-profile-mistakes" className="group rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                <p className="font-semibold group-hover:text-primary">Top GBP mistakes</p>
                <p className="mt-1 text-sm text-muted-foreground">Fix the errors that hurt your ranking and customer trust.</p>
              </Link>
              <Link href="/resources/how-to-automate-gbp-review-replies-with-ai" className="group rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                <p className="font-semibold group-hover:text-primary">AI review replies</p>
                <p className="mt-1 text-sm text-muted-foreground">Reply to every review in minutes, not hours.</p>
              </Link>
              <Link href="/resources/multi-location-seo-management" className="group rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                <p className="font-semibold group-hover:text-primary">Multi-location GBP</p>
                <p className="mt-1 text-sm text-muted-foreground">Manage multiple locations from one dashboard.</p>
              </Link>
            </div>
            <p className="mt-6 text-center">
              <Link href="/resources" className="text-sm font-semibold text-primary hover:underline">
                View all GBP management guides →
              </Link>
            </p>
          </div>
        </section>

        <section className="border-t py-24">
           <div className="container max-w-lg text-center">
            <h2 className="font-headline text-4xl font-semibold tracking-tight">
              Don't Wait,{' '}
              <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                Dominate.
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Poor GBP management means they find your competition. Fix it in under 2 minutes.
            </p>
            <Link href="/pricing" className="mt-8 inline-block">
              <Button size="lg" className="px-6 py-5 text-sm md:px-10 md:py-6 md:text-base">
                Start Your Free Trial Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}

function RedirectManager() {
  const { user, isLoading, isSubscriptionLoading, subscription, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only run on the home page.
    if (pathname !== '/') {
      return;
    }
    
    // Wait until both initial authentication AND subscription checks are complete.
    if (isLoading || isSubscriptionLoading) {
      return;
    }

    // If we've already checked and redirected, do nothing.
    if (hasChecked) {
      return;
    }

    if (user) {
      // User is logged in. Now we decide where to send them based on a complete auth state.
      if (role === 'owner' && !subscription) {
        // Owner with no subscription goes to the welcome/pricing page.
        router.push('/welcome');
      } else if (role === 'teamMember' || (role === 'owner' && subscription)) {
        // Team members or owners with a subscription go to the dashboard.
        router.push('/dashboard');
      }
      setHasChecked(true);
    } else {
      // If there is no user and loading is finished, they are a visitor.
      // We let them stay on the landing page and mark the check as done.
      setHasChecked(true);
    }
    
  }, [user, isLoading, isSubscriptionLoading, subscription, role, router, pathname, hasChecked]);

  // Show a full-page loader ONLY if we are on the homepage AND the initial user/subscription data is loading.
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
