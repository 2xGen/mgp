'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Loader2, Menu, Minus } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import SecurePayments from '@/components/landing/secure-payments';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/auth-provider';
import { useRouter } from 'next/navigation';
import {
  CORE_PLAN_FEATURES,
  PLAN_BLURBS,
  PLAN_COMPARISON_ROWS,
  PLAN_EXTRA_FEATURES,
  PLAN_LABELS,
  PLAN_PRICE_ANNUAL_EUR,
  PLAN_PRICE_ANNUAL_TOTAL_EUR,
  PLAN_PRICE_MONTHLY_EUR,
  planScaleLine,
  type PlanId,
} from '@/lib/plans';

const PLANS: PlanId[] = ['starter', 'growth', 'enterprise'];

export default function PricingPage() {
  const { isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [annual, setAnnual] = useState(true);

  const handleStartTrial = () => router.push('/login');

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
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
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
            <h1 className="font-headline text-4xl font-semibold tracking-tight md:text-5xl">
              Start free.{' '}
              <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                Upgrade as you grow.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Same powerful toolkit on every plan. Choose based on how many locations you manage — you pay for more businesses, not more AI.
            </p>

            <div className="mx-auto mt-8 inline-flex items-center gap-1 rounded-full border bg-background p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-medium transition-colors',
                  !annual ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors',
                  annual ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Annual
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none',
                    annual
                      ? 'bg-primary-foreground/15 text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  )}
                >
                  2 months free
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="pb-12 pt-2">
          <div className="container grid max-w-screen-xl grid-cols-1 gap-8 md:grid-cols-3 lg:items-stretch">
            {PLANS.map((planId) => {
              const popular = planId === 'growth';
              const monthlyList = PLAN_PRICE_MONTHLY_EUR[planId];
              const price = annual ? PLAN_PRICE_ANNUAL_EUR[planId] : monthlyList;
              const extras = PLAN_EXTRA_FEATURES[planId];

              return (
                <Card
                  key={planId}
                  className={cn(
                    'flex h-full flex-col border-2',
                    popular
                      ? 'relative border-primary shadow-xl shadow-primary/15 ring-2 ring-primary/10'
                      : 'border-border/60 transition-shadow hover:shadow-xl'
                  )}
                >
                  <CardHeader>
                    <div className="flex justify-end">
                      {popular ? (
                        <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                      ) : (
                        <Badge variant="secondary">{planId === 'enterprise' ? 'Teams' : 'Start here'}</Badge>
                      )}
                    </div>
                    <CardTitle className="font-headline pt-2 text-3xl">{PLAN_LABELS[planId]}</CardTitle>
                    <CardDescription>{PLAN_BLURBS[planId]}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col space-y-5">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">€{price}</span>
                        <span className="text-muted-foreground">/ mo</span>
                      </div>
                      {annual ? (
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            €{PLAN_PRICE_ANNUAL_TOTAL_EUR[planId]}/year
                          </span>
                          {' '}· billed yearly · 2 months free
                          <span className="mt-0.5 block text-xs">
                            vs €{monthlyList * 12}/year monthly
                          </span>
                        </p>
                      ) : (
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          or €{PLAN_PRICE_ANNUAL_TOTAL_EUR[planId]}/year (save 2 months)
                        </p>
                      )}
                      <p className="mt-3 text-sm font-semibold text-foreground">
                        {planScaleLine(planId)}
                      </p>
                      <p className="mt-2 text-sm text-primary">
                        14-day free trial · No credit card required
                      </p>
                    </div>

                    <ul className="space-y-2.5 border-t pt-5">
                      <li className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Full MyGoProfile toolkit
                      </li>
                      {CORE_PLAN_FEATURES.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {extras.length > 0 && (
                        <>
                          <li className="pt-2 text-xs font-semibold uppercase tracking-wide text-primary">
                            Included at this scale
                          </li>
                          {extras.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm font-medium">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      size="lg"
                      variant={popular ? 'default' : 'outline'}
                      onClick={handleStartTrial}
                      disabled={isAuthLoading}
                    >
                      {isAuthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Start free trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <div className="container mt-10 max-w-screen-md">
            <SecurePayments />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Billing is handled securely by Stripe. Cancel anytime from your account.
            </p>
          </div>
        </section>

        <section className="border-t py-16">
          <div className="container max-w-screen-lg">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <h2 className="font-headline text-2xl font-semibold tracking-tight md:text-3xl">
                Compare plans
              </h2>
              <p className="mt-2 text-muted-foreground">
                All plans include the full toolkit. Growth and Agency add multi-location tools as you scale.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 font-medium text-muted-foreground">Feature</th>
                    {PLANS.map((planId) => (
                      <th
                        key={planId}
                        className={cn(
                          'px-4 py-3 text-center font-semibold',
                          planId === 'growth' && 'bg-primary/5 text-primary'
                        )}
                      >
                        {PLAN_LABELS[planId]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLAN_COMPARISON_ROWS.map((row) => (
                    <tr key={row.label} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{row.label}</td>
                      {PLANS.map((planId) => {
                        const value = row.values[planId];
                        return (
                          <td
                            key={planId}
                            className={cn(
                              'px-4 py-3 text-center',
                              planId === 'growth' && 'bg-primary/[0.03]'
                            )}
                          >
                            {value === true ? (
                              <Check className="mx-auto h-4 w-4 text-brand-green" aria-label="Included" />
                            ) : value === false ? (
                              <Minus className="mx-auto h-4 w-4 text-muted-foreground/50" aria-label="Not included" />
                            ) : (
                              <span className="font-semibold tabular-nums">{value}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                Cancel anytime · Same core features on every plan · Scale when you need more locations
              </p>
              <p className="text-muted-foreground">
                Need more than 10 locations?{' '}
                <a href="mailto:hello@mygoprofile.com" className="font-semibold text-primary hover:underline">
                  Contact us
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
