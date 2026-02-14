
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Clock, TrafficCone, Hourglass, Bot, BarChart, Users, ShieldCheck, Lock, Monitor, StepForward, Menu } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why MyGoProfile? - GBP Management with AI Review Replies',
  description: 'Slow replies and a neglected Google Business Profile cost you customers. MyGoProfile fixes it: AI review replies, one dashboard, multi-location, secure team access. Start free.',
  openGraph: {
    title: 'Why MyGoProfile? - GBP Management with AI',
    description: 'Reply to every review in minutes. One dashboard, AI drafts, no shared passwords. Start free.',
    url: 'https://mygoprofile.com/why-mygoprofile',
    siteName: 'MyGoProfile',
  },
}

const painPoints = [
    {
        icon: Clock,
        title: "Slow Replies",
        description: "Customers expect responses within 24 hours. Delays cost you reputation and future business.",
        stat: "15–20%",
        stat_description: "of customers may leave due to slow responses."
    },
    {
        icon: TrafficCone,
        title: "Poor Optimization",
        description: "An unoptimized profile means you're invisible to customers searching for your services nearby.",
        stat: "60%",
        stat_description: "of potential local customers never find you."
    },
    {
        icon: Hourglass,
        title: "Manual Chaos",
        description: "Managing multiple locations manually takes hours each week that could be spent growing your business.",
        stat: "8–12 hours",
        stat_description: "per week lost to manual tasks."
    }
];

const solutions = [
    {
        icon: Bot,
        title: "AI-Drafted Review Responses",
        description: "Get professional response drafts in seconds. Review, approve, or edit before posting.",
        benefit: "Never miss a customer again"
    },
    {
        icon: BarChart,
        title: "Performance Optimization",
        description: "Data-driven insights to improve your GBP ranking and capture more local searches.",
        benefit: "Reply to every review in minutes"
    },
    {
        icon: Monitor,
        title: "Multi-Location Management",
        description: "Manage all your business locations from one dashboard. Scale without the complexity.",
        benefit: "90% time savings"
    },
    {
        icon: Check,
        title: "Optimization Checklist",
        description: "Step-by-step guidance to ensure your GBP is fully optimized and compliant.",
        benefit: "Complete profile optimization"
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Assign roles & permissions to team members without ever sharing your Google login.",
        benefit: "Secure team access"
    },
    {
        icon: ShieldCheck,
        title: "Enterprise Security",
        description: "Bank-level security with role-based access control, keeping your Google account protected.",
        benefit: "Enterprise-grade security"
    }
];

const securityPoints = [
    {
        icon: ShieldCheck,
        title: "No Shared Passwords",
        description: "We never ask for or store your Google password. Your credentials remain private."
    },
    {
        icon: Lock,
        title: "Google OAuth 2.0",
        description: "Every login and connection is handled directly through Google’s own secure authentication system."
    },
    {
        icon: Check,
        title: "Compliant by Design",
        description: "Our platform follows Google’s official API policies, ensuring long-term reliability and security."
    },
    {
        icon: Users,
        title: "Role-Based Access",
        description: "Owners can grant and revoke team member access safely — without ever giving away account credentials."
    }
];


const howItWorks = [
    {
        step: 1,
        title: "Connect Your Profile",
        description: "Connect your Google Business Profile in under 2 minutes. No technical expertise required."
    },
    {
        step: 2,
        title: "Start Optimizing",
        description: "Our AI will immediately start improving your profile and drafting review responses for your approval."
    },
    {
        step: 3,
        title: "See Results Fast",
        description: "Most businesses see improved rankings and more customer inquiries within 30 days."
    }
];


export default function WhyMyGoProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
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
        {/* Hero Section */}
        <section className="relative py-20 text-center">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 to-transparent" />
            <div className="hero-pattern absolute inset-0 -z-10 opacity-40" />
            <div className="container relative max-w-screen-lg">
                 <h1 className="font-headline text-4xl font-semibold tracking-tight md:text-5xl">
                    Your Google Business Profile Is <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">Costing You Customers</span> — Let’s Fix That.
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
                    Reply to every review in minutes with AI. One dashboard, multi-location, no shared passwords. Start free.
                </p>
                 <Link href="/pricing" className="mt-8 inline-block">
                    <Button size="lg" className="px-8 py-6 text-base">
                        Start free — No credit card required
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </section>
        
        {/* Pain Points Section */}
        <section className="py-20 text-center bg-muted/20">
            <div className="container max-w-screen-lg">
                 <h2 className="font-headline text-4xl font-semibold tracking-tight md:text-5xl">The Real Problem</h2>
                <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                    Most local businesses lose customers every day — not because of bad service, but because reviews go unanswered and profiles get neglected. MyGoProfile helps you reply to every review with AI and stay on top of your GBP from one dashboard.
                </p>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
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

        {/* The Solution Section */}
        <section className="py-20">
            <div className="container max-w-screen-lg text-center">
                <h2 className="font-headline text-4xl font-semibold tracking-tight md:text-5xl">
                    The <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">MyGoProfile</span> Solution
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                    Turn these pain points into your greatest competitive advantages.
                </p>
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {solutions.map((solution) => (
                        <Card key={solution.title} className="text-left shadow-sm hover:shadow-lg transition-shadow">
                            <CardHeader>
                                 <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                     <solution.icon className="h-6 w-6" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="font-semibold">{solution.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{solution.description}</p>
                            </CardContent>
                            <CardContent>
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

        {/* Security Section */}
        <section className="py-20">
            <div className="container max-w-screen-lg text-center">
                <h2 className="font-headline text-4xl font-semibold tracking-tight md:text-5xl">
                    Bank-Level Security, <br /> Backed by <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">Google</span>
                </h2>
                <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
                    We take security seriously. MyGoProfile is built 100% on Google’s official authentication and API systems.
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
                <p className="mx-auto mt-12 text-lg font-semibold text-muted-foreground">
                    You stay in full control. We simply provide the tools to manage, optimize, and grow your profiles.
                </p>
            </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20">
            <div className="container max-w-screen-lg text-center">
                 <h2 className="font-headline text-4xl font-semibold tracking-tight md:text-5xl">How It Works</h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                    Simple steps to transform your Google Business Profile.
                </p>
                <div className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
                     <div className="absolute top-1/2 left-0 hidden h-px w-full -translate-y-1/2 bg-border md:block" />
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
        
        {/* Guides section – internal linking */}
        <section className="py-20 border-t">
          <div className="container max-w-screen-lg text-center">
            <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
              Go deeper: free GBP management guides
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Learn how to fix poor GBP management with step-by-step guides on optimization, AI review replies, and multi-location.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/resources/google-business-profile-optimization" className="text-primary font-semibold hover:underline">
                Complete GBP guide
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/resources/ai-and-local-seo" className="text-primary font-semibold hover:underline">
                AI & local SEO
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/resources/multi-location-seo-management" className="text-primary font-semibold hover:underline">
                Multi-location
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/resources" className="text-primary font-semibold hover:underline">
                All guides
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24">
           <div className="container max-w-lg text-center">
            <h2 className="font-headline text-4xl font-semibold tracking-tight">
              Ready to Turn Pain Into Gain?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop letting your Google Business Profile be a liability. Start turning it into your most powerful customer acquisition tool.
            </p>
            <Link href="/pricing" className="mt-8 inline-block">
              <Button size="lg" className="px-10 py-6 text-base">
                View Plans & Get Started
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
