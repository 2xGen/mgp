'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { joinWaitlist } from '../actions';
import { useToast } from '@/hooks/use-toast';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const result = await joinWaitlist(email.trim());
    setIsSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      setEmail('');
      toast({ title: "You're on the list!", description: "We'll notify you when we're live again." });
    } else {
      toast({ title: result.error ?? 'Something went wrong', variant: 'destructive' });
    }
  };

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
            <Link href="/coming-soon">
              <Button>Join waitlist</Button>
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
                <Link href="/coming-soon" className="text-muted-foreground hover:text-foreground">
                  Join waitlist
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 to-transparent" />
          <div className="hero-pattern absolute inset-0 -z-10 opacity-40" />
          <div className="container relative max-w-screen-md mx-auto px-4">
            <h1 className="font-headline text-4xl font-semibold tracking-tight md:text-5xl">
              We&apos;ve reached our capacity — join the waitlist
            </h1>
            <p className="mx-auto mt-6 text-lg text-muted-foreground max-w-xl">
              We&apos;ve hit our maximum number of users and are scaling to welcome more — without compromising on the quality you expect. Join the waitlist and we&apos;ll notify you as soon as we&apos;re ready for you.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-11"
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="h-11 px-6" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Notify me'}
                </Button>
              </form>
            ) : (
              <div className="mt-10 flex items-center justify-center gap-2 text-primary font-medium">
                <CheckCircle className="h-5 w-5" />
                You&apos;re on the list. We&apos;ll email you when we&apos;re live again.
              </div>
            )}

            <p className="mt-8 text-sm text-muted-foreground">
              In the meantime, explore our <Link href="/resources" className="text-primary hover:underline">guides and resources</Link> on Google Business Profile optimization.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
