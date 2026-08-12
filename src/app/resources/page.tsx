
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Menu } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { cn } from '@/lib/utils';

const categories = {
    GBP_OPTIMIZATION: 'GBP Optimization',
    AI_SEO: 'AI + Local SEO',
    MULTI_LOCATION: 'Multi-Location & Agency',
    REVIEW_MANAGEMENT: 'Review Management',
};

const articles = [
    {
        title: "GBP Optimization Guide 2026: Complete Google Business Profile Checklist",
        description: "GBP optimization best practices 2026: NAP, categories, photos, reviews, posts, and Q&A — the full checklist that still works.",
        href: "/resources/google-business-profile-optimization",
        date: "November 2025",
        imageUrl: "https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/Why%20Your%20Google%20Business%20Profile%20is%20Non-Negotiable.jpg",
        category: categories.GBP_OPTIMIZATION,
        startHere: true,
    },
    {
        title: "Google Business Profile Mistakes to Avoid (Common Ranking Killers)",
        description: "Common Google Business Profile mistakes: inconsistent NAP, wrong categories, ignored reviews, stale photos — and how to fix them.",
        href: "/resources/top-google-business-profile-mistakes",
        date: "November 2025",
        imageUrl: "https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/Top%20Google%20Business%20Profile%20Mistakes%20That%20Are%20Costing%20You%20Customers.jpg",
        category: categories.GBP_OPTIMIZATION,
    },
     {
        title: "GBP Optimization for Near Me Searches: Rank in the Local Pack",
        description: "GBP optimization for near me searches: NAP, categories, local content, reviews, and photos so nearby customers find you.",
        href: "/resources/how-to-optimize-for-near-me-searches",
        date: "December 2025",
        imageUrl: "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/how%20to%20optimize%20your%20gbp.png",
        category: categories.GBP_OPTIMIZATION,
    },
    {
        title: "Best Time to Post on Google Business Profile 2026 (Data-Backed)",
        description: "Best time to post on Google My Business / GBP in 2026. How often to post, how long Google posts last (expire after 7 days), and peak times.",
        href: "/resources/best-time-to-post-on-google-business-profile",
        date: "December 2025",
        imageUrl: "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/best%20time%20to%20post.png",
        category: categories.GBP_OPTIMIZATION,
    },
     {
        title: "How Often to Upload Photos to Google Business Profile (7–10 Days)",
        description: "Recommended frequency for uploading photos to Google Business Profile: at least one new photo every 7–10 days for local SEO.",
        href: "/resources/how-often-to-update-photos-on-gbp",
        date: "December 2025",
        imageUrl: "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/how%20often%20should%20you%20post.png",
        category: categories.GBP_OPTIMIZATION,
    },
     {
        title: "Google Business Profile Categories List: How to Choose the Right One",
        description: "How to choose Google Business Profile / Google My Business categories: one specific primary + up to nine secondary.",
        href: "/resources/how-to-pick-google-business-categories",
        date: "January 2026",
        imageUrl: "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/google%20business%20categories.png",
        category: categories.GBP_OPTIMIZATION,
    },
    {
        title: "UTM Tagging for GBP: Track Your Google Business Profile Website Link",
        description: "Exact UTM parameters for your GBP website link so you can see profile traffic in Google Analytics — not buried in organic.",
        href: "/resources/how-to-use-utm-tracking-for-gbp",
        date: "January 2026",
        imageUrl: "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/utm%20tracking.png",
        category: categories.GBP_OPTIMIZATION,
    },
    {
        title: "AI Local SEO for Google Business Profile (Practical Guide)",
        description: "AI local SEO optimization for Google Business Profile: review replies, insights summaries, and keeping your listing active.",
        href: "/resources/ai-and-local-seo",
        date: "November 2025",
        imageUrl: "https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/AI%20and%20Local%20SEO.jpg",
        category: categories.AI_SEO,
    },
    {
        title: "AI for Google Business Profile: 7 Ways to Improve Rankings",
        description: "Seven practical ways AI improves GBP rankings: replies, posts, descriptions, insights, completeness, photos, and competitors.",
        href: "/resources/7-ways-ai-can-improve-gbp-rankings",
        date: "December 2025",
        imageUrl: "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/7%20Ways%20AI%20Can%20Improve%20Your%20Google%20Business%20Rankings.png",
        category: categories.AI_SEO,
    },
    {
        title: "Automate Review Replies for GBP: Pros, Cons & Safe AI Workflow",
        description: "Review response automation pros and cons — AI drafts, human approval, and GBP automation that doesn’t sound robotic.",
        href: "/resources/how-to-automate-gbp-review-replies-with-ai",
        date: "January 2026",
        imageUrl: "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/How%20to%20Automate%20GBP%20Review%20Replies%20with%20AI.png",
        category: categories.AI_SEO,
    },
     {
        title: "ChatGPT vs Gemini for Local SEO (vs a GBP Tool)",
        description: "Local SEO for ChatGPT and Gemini vs a specialized Google Business Profile tool — when copy-paste AI isn’t enough.",
        href: "/resources/comparing-chatgpt-gemini-mygoprofile",
        date: "January 2026",
        imageUrl: "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/Comparing%20ChatGPT,%20Gemini,%20and%20MyGoProfile%20for%20Local%20SEO%20Tasks.png",
        category: categories.AI_SEO,
    },
    {
        title: "What to Post on Google Business Profile: AI Content Ideas",
        description: "What to post on Google Business Profile: products, seasonal posts, FAQs, offers, and testimonials — with AI prompts.",
        href: "/resources/ai-powered-content-ideas-for-google-posts",
        date: "December 2025",
        imageUrl: "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/AI-Powered%20Content%20Ideas%20for%20Your%20Google%20Posts.png",
        category: categories.AI_SEO,
    },
    {
        title: "AI Overviews & Local SEO: How Google’s AI Impacts Local Search",
        description: "AI Overviews local SEO impact: why your Google Business Profile feeds Google’s AI answers and how to stay visible.",
        href: "/resources/future-of-local-search-with-ai-overviews",
        date: "January 2026",
        imageUrl: "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/Future%20of%20Local%20Search.png",
        category: categories.AI_SEO,
    },
    {
        title: "How to Manage Multiple Google Business Profile Accounts",
        description: "Manage multiple business profile accounts for franchises and agencies — consistency, localization, and multi-location software.",
        href: "/resources/multi-location-seo-management",
        date: "November 2025",
        imageUrl: "https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/Multi-Location%20SEO%20How%20to%20Manage%20Google%20Business%20Profiles%20at%20Scale.jpg",
        category: categories.MULTI_LOCATION,
    },
    {
        title: "Does Responding to Google Reviews Help SEO? Yes — Here’s Why",
        description: "Yes — responding to Google reviews helps local SEO. Google confirms it. See how replies boost trust, review volume, and rankings.",
        href: "/resources/does-responding-to-google-reviews-boost-seo",
        date: "February 2026",
        imageUrl: "https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/Does%20Responding%20to%20Google%20Reviews%20Boost%20Your%20Local%20SEO.jpg",
        category: categories.REVIEW_MANAGEMENT,
    }
];

const categoryOrder = [
    categories.GBP_OPTIMIZATION,
    categories.AI_SEO,
    categories.MULTI_LOCATION,
    categories.REVIEW_MANAGEMENT,
];

export default function ResourcesPage() {
    const [activeCategory, setActiveCategory] = useState<string>('All');

    const filteredArticles = activeCategory === 'All'
        ? articles
        : articles.filter(article => article.category === activeCategory);

    const sortedArticles = [...filteredArticles].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

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
                        <Link href="/resources" className="hover:text-foreground">
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
        <section className="py-20 text-center">
            <div className="container max-w-screen-lg">
                 <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Resources' },
                    ]}
                    className="mb-8 justify-center"
                />
                <h1 className="font-headline text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                    GBP Management <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">Guides</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                    Free Google Business Profile guides for 2026: GBP optimization, best time to post, does responding to reviews help SEO, categories, photos, UTM tagging, and multi-location management.
                </p>
            </div>
        </section>
        
        <section className="pb-20">
            <div className="container max-w-screen-lg">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                    <Button 
                        variant={activeCategory === 'All' ? 'default' : 'outline'}
                        onClick={() => setActiveCategory('All')}
                    >
                        All
                    </Button>
                    {categoryOrder.map(category => (
                        <Button 
                            key={category}
                            variant={activeCategory === category ? 'default' : 'outline'}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
                <div className="grid gap-8">
                    {sortedArticles.map((article, index) => (
                        <Link key={article.title} href={article.href} className="group block">
                            <Card className="grid grid-cols-1 md:grid-cols-3 overflow-hidden shadow-sm transition-shadow duration-300 group-hover:shadow-xl relative">
                                {(article as { startHere?: boolean }).startHere && (
                                    <span className="absolute top-3 left-3 z-10 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                                        Start here
                                    </span>
                                )}
                                <div className="relative h-48 w-full md:h-full">
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint="digital marketing"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <CardHeader>
                                        <p className="text-sm font-semibold text-primary">{article.category}</p>
                                        <CardTitle className="group-hover:text-primary pt-1">{article.title}</CardTitle>
                                        <CardDescription>{article.date}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{article.description}</p>
                                    </CardContent>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
                 {sortedArticles.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <p className="font-semibold">No articles in this category yet.</p>
                        <p>Check back soon!</p>
                    </div>
                )}
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
