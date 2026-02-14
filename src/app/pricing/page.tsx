
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, ShieldCheck, Loader2, Menu, Star } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { startFreeTrial } from '../actions';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const starterFeatures = [
    "1 Location",
    "1 Team Member",
    "AI-Powered Review Replies",
    "Local SEO Insights & Recommendations",
    "Unified Dashboard",
    "Email Support",
];

const growthFeatures = [
    "3 Locations",
    "3 Team Members",
    "All Starter Features",
    "Multi-Location Leaderboard",
    "Advanced Performance Analytics",
    "Priority Support",
];

const enterpriseFeatures = [
    "Up to 10 Locations",
    "Up to 5 Team Members",
    "All Growth Features",
    "Early Access to New Features",
];

const comparisonData = [
    { platformType: 'Enterprise Platforms', pricing: '$200–$500+/mo', notes: 'Complex setups, sales calls, long contracts.' },
    { platformType: 'SMB Tools', pricing: '$50–$150+/mo', notes: 'Often limited in AI features and team access.' },
    { platformType: 'MyGoProfile', pricing: '$29–$99/mo', notes: 'Simple, transparent pricing with AI review replies, multi-location support, and built-in team access.', isYou: true },
];

export default function PricingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/coming-soon');
  }, [router]);

  return null;
}

function PricingPageContent() {
  const { isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const handleStartTrial = () => router.push('/coming-soon');

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
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
        <section className="relative py-16 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 to-transparent" />
          <div className="hero-pattern absolute inset-0 -z-10 opacity-40" />
          <div className="container relative max-w-screen-lg">
            <h1 className="font-headline text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Plans that <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">Scale with Your Business</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Google Business Profile management with AI review replies. No hidden fees, no contracts. Start free.
            </p>
          </div>
        </section>

        <section className="pt-4 pb-16">
            <div className="container grid max-w-screen-xl grid-cols-1 gap-8 md:grid-cols-3 lg:items-start">
                {/* Starter Plan */}
                <Card className="h-full flex flex-col transition-shadow hover:shadow-xl border-2 border-transparent">
                    <CardHeader>
                        <div className="flex justify-end">
                            <Badge variant="secondary">Base Plan</Badge>
                        </div>
                        <CardTitle className="font-headline text-3xl pt-2">Starter</CardTitle>
                        <CardDescription>For single-location businesses who want to dominate local search.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-grow">
                        <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-bold">$29</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                        <div className="rounded-lg border border-primary/20 bg-primary/5 py-3 px-4 text-center">
                          <p className="text-sm font-semibold text-primary">14-day free trial</p>
                          <p className="text-xs text-muted-foreground">No credit card required</p>
                        </div>
                        <ul className="space-y-3">
                            {starterFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="h-4 w-4 shrink-0 text-brand-green" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={handleStartTrial}
                            disabled={isAuthLoading}
                        >
                            {isAuthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Start Your 14-Day Free Trial
                        </Button>
                    </CardFooter>
                </Card>

                {/* Growth Plan */}
                <Card className="border-2 border-primary shadow-xl shadow-primary/15 h-full flex flex-col relative ring-2 ring-primary/10">
                     <CardHeader>
                        <div className="flex justify-end">
                            <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                        </div>
                        <CardTitle className="font-headline text-3xl pt-2">Growth</CardTitle>
                        <CardDescription>For small chains or agencies managing multiple locations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-grow">
                        <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-bold">$49</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                         <div className="rounded-lg border border-primary/20 bg-primary/5 py-3 px-4 text-center">
                          <p className="text-sm font-semibold text-primary">14-day free trial</p>
                          <p className="text-xs text-muted-foreground">No credit card required</p>
                        </div>
                        <ul className="space-y-3">
                            {growthFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="h-4 w-4 shrink-0 text-brand-green" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={handleStartTrial}
                            disabled={isAuthLoading}
                        >
                            {isAuthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Start Your 14-Day Free Trial
                        </Button>
                    </CardFooter>
                </Card>

                {/* Enterprise Plan */}
                 <Card className="h-full flex flex-col transition-shadow hover:shadow-xl border-2 border-transparent">
                    <CardHeader>
                        <div className="flex justify-end">
                            <Badge variant="secondary" className="border border-primary/30 text-primary">Best Value</Badge>
                        </div>
                        <CardTitle className="font-headline text-3xl pt-2">Enterprise</CardTitle>
                        <CardDescription>For agencies and businesses ready to scale.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-grow">
                        <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-bold">$99</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                         <div className="rounded-lg border border-primary/20 bg-primary/5 py-3 px-4 text-center">
                          <p className="text-sm font-semibold text-primary">14-day free trial</p>
                          <p className="text-xs text-muted-foreground">No credit card required</p>
                        </div>
                        <ul className="space-y-3">
                            {enterpriseFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Star className="h-4 w-4 shrink-0 text-amber-500 fill-amber-500" />
                                    <span className="font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={handleStartTrial}
                            disabled={isAuthLoading}
                        >
                            {isAuthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Start Your 14-Day Free Trial
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="container max-w-screen-md text-center mt-12 space-y-3">
                <p className="text-muted-foreground">Need more than 10 locations? <a href="mailto:hello@mygoprofile.com" className="font-semibold text-primary hover:underline">Contact us</a> for a custom enterprise solution.</p>
                <p className="text-muted-foreground">New to Google Business Profile? <Link href="/resources" className="font-semibold text-primary hover:underline">Read our free GBP management guides</Link> to get the most out of your trial.</p>
            </div>
        </section>

        <section className="py-16 border-t bg-muted/20">
            <div className="container max-w-screen-lg">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">Market Comparison</h2>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                        Most local business reputation and GBP management platforms charge hundreds per month per location — often with hidden fees, contracts, or required upgrades for multi-location access and team collaboration.
                    </p>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground font-semibold">With MyGoProfile, you get:</p>
                </div>
                <Card className="mt-8 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Platform Type</TableHead>
                                <TableHead>Typical Pricing</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comparisonData.map((item) => (
                                <TableRow key={item.platformType} className={cn(item.isYou ? 'bg-primary/10' : 'hover:bg-muted/50 transition-colors')}>
                                    <TableCell className={cn("font-semibold", item.isYou && 'text-primary')}>{item.platformType}</TableCell>
                                    <TableCell className="font-medium">{item.pricing}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.notes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
                <p className="mt-6 text-center text-lg text-muted-foreground">
                    You get the power of enterprise-level AI features — at a price built for small businesses and agencies.
                </p>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
