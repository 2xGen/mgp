
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu, Zap, Bot, ArrowRight, XCircle, ListChecks, Camera, UserCheck, HelpCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const imageUrl = "https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/Top%20Google%20Business%20Profile%20Mistakes%20That%20Are%20Costing%20You%20Customers.jpg";

export const metadata: Metadata = {
  title: 'Google Business Profile Mistakes to Avoid (Common Ranking Killers)',
  description: 'Common Google Business Profile mistakes that hurt rankings: inconsistent NAP, wrong categories, ignored reviews, stale photos. Fix them so your GBP shows up in search.',
  keywords: ['google business profile mistakes to avoid', 'google my business mistakes', 'what are common google profile mistakes', 'google business profile mistakes', 'common google business profile mistakes', 'gbp not appearing in search', 'why is my Google Business not showing up', 'GBP not showing up', 'local SEO errors', 'fix my GBP'],
  openGraph: {
    title: 'Google Business Profile Mistakes to Avoid (Common Ranking Killers)',
    description: 'Common Google Business Profile mistakes that hurt rankings: inconsistent NAP, wrong categories, ignored reviews, stale photos. Fix them so your GBP shows up in search.',
    url: '/resources/top-google-business-profile-mistakes',
    siteName: 'MyGoProfile',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'A magnifying glass over a Google Business Profile, highlighting common mistakes.',
      },
    ],
    locale: 'en_US',
    type: 'article',
    publishedTime: new Date().toISOString(),
    authors: ['MyGoProfile'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Google Business Profile Mistakes to Avoid (Common Ranking Killers)',
    description: 'Common Google Business Profile mistakes that hurt rankings: inconsistent NAP, wrong categories, ignored reviews, stale photos. Fix them so your GBP shows up in search.',
    images: [imageUrl],
  },
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'Common Google Business Profile Mistakes (And How to Fix Them)',
  description: 'Common Google Business Profile mistakes that hurt rankings: inconsistent NAP, wrong categories, ignored reviews, stale photos. Fix them so your GBP shows up in search.',
  image: imageUrl,
  datePublished: new Date().toISOString(),
  author: {
    '@type': 'Organization',
    name: 'MyGoProfile',
    url: 'https://mygoprofile.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'MyGoProfile',
    logo: {
      '@type': 'ImageObject',
      url: 'https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/MGP%20logo120px.png',
    },
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the most common Google Business Profile mistakes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most common Google Business Profile mistakes are: (1) Inconsistent NAP (name, address, phone) across your website and other listings, (2) wrong or incomplete categories, (3) ignoring reviews or not responding to them, and (4) few or outdated photos. Fixing these often resolves why your GBP is not appearing in search.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is my GBP not appearing in search?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your GBP may not be appearing in search because of inconsistent NAP data, wrong or missing categories, no or low engagement with reviews, or a bare or outdated photo gallery. Google may also not show your profile if it is unverified, suspended, or has policy violations. Audit NAP, categories, reviews, and photos first; see our complete GBP optimization guide for step-by-step fixes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I fix my Google Business Profile so it shows up?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use one consistent NAP everywhere, pick the most specific primary category and add relevant secondary categories, respond to every review and ask happy customers for reviews, and add at least one new photo weekly. For a full checklist, use our complete guide to Google Business Profile optimization.',
      },
    },
  ],
};

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://mygoprofile.com',
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'Resources',
            item: 'https://mygoprofile.com/resources',
        },
        {
            '@type': 'ListItem',
            position: 3,
            name: 'Top Google Business Profile Mistakes',
        },
    ],
};

const allArticles = [
    { title: "The Complete Guide to Google Business Profile Optimization", href: "/resources/google-business-profile-optimization" },
    { title: "AI and Local SEO: How AI Transforms Google Business Profile Management", href: "/resources/ai-and-local-seo" },
    { title: "Multi-Location SEO: How to Manage Google Business Profiles at Scale", href: "/resources/multi-location-seo-management" },
    { title: "Top Google Business Profile Mistakes That Are Costing You Customers", href: "/resources/top-google-business-profile-mistakes" },
    { title: "Does Responding to Google Reviews Boost Your Local SEO?", href: "/resources/does-responding-to-google-reviews-boost-seo" },
    { title: "How to Optimize Your GBP for “Near Me” Searches", href: "/resources/how-to-optimize-for-near-me-searches" },
    { title: "The Best Time to Post on Google Business Profile (Based on Data)", href: "/resources/best-time-to-post-on-google-business-profile" },
    { title: "How Often Should You Update Photos on Your GBP?", href: "/resources/how-often-to-update-photos-on-gbp" },
    { title: "Google Business Categories: How to Pick the Right One (and Why It Matters)", href: "/resources/how-to-pick-google-business-categories" },
    { title: "How to Use UTM Tracking for Your GBP Website Link", href: "/resources/how-to-use-utm-tracking-for-gbp" },
];


export default function BlogPostPage3() {
    const currentPage = allArticles.find(article => article.href.includes('/top-google-business-profile-mistakes'));
    const otherArticles = allArticles.filter(article => article.href !== currentPage?.href);
  return (
    <div className="flex min-h-screen w-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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

      <main className="flex-1 py-16">
        <div className="container max-w-screen-md">
           <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Resources', href: '/resources' },
                    { label: 'Top Google Business Profile Mistakes' },
                ]}
                className="mb-8"
            />
            <div className="text-center">
              <h1 className="!text-4xl !font-bold !tracking-tight md:!text-5xl">Common Google Business Profile Mistakes (And How to Fix Them)</h1>
              <p className="lead !text-xl !font-semibold mt-4">Wondering, "Why is my Google Business Profile not showing up?"</p>
            </div>
        </div>
        <article className="container max-w-screen-md prose prose-lg prose-blue dark:prose-invert mt-12">
            <div className="relative mb-12 h-64 w-full overflow-hidden rounded-xl md:h-80">
                <Image
                    src={imageUrl}
                    alt="Common Google Business Profile mistakes: NAP, categories, reviews, photos"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            
            <p>You might be making one of these common but costly local SEO errors. This guide reveals the top Google Business Profile mistakes and how to fix them to reclaim your lost customers. Your Google Business Profile (GBP) is your most powerful tool for attracting local customers. Yet, many businesses unknowingly sabotage their own efforts with simple, fixable mistakes. These errors can make your profile invisible in search results—so if you're asking &quot;why is my GBP not appearing in search?&quot;, the cause is often one of the common Google Business Profile mistakes below. Let's dive into the biggest GBP mistakes and how you can correct them today.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3" id="why-not-showing"><Search className="h-8 w-8" /> Why Your GBP Isn&apos;t Appearing in Search</h2>
            <p>When your Google Business Profile isn&apos;t showing up in local search, it&apos;s usually due to a few fixable issues: <strong>inconsistent NAP</strong> (Google doesn&apos;t trust your listing), <strong>wrong or incomplete categories</strong> (you&apos;re not matching the right searches), <strong>ignored reviews</strong> (low engagement signal), or <strong>no or stale photos</strong> (profile looks inactive). Less often, a suspended or unverified profile can keep you out of results. The four mistakes below are the most common reasons a GBP is not appearing in search—and each has a clear fix. For a full optimization checklist, see our <Link href="/resources/google-business-profile-optimization">complete guide to Google Business Profile optimization</Link>.</p>
            
            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><XCircle className="h-8 w-8" /> Mistake #1: Inconsistent NAP Information</h2>
            <p><strong>The Problem:</strong> Your business's Name, Address, and Phone number (NAP) are not identical across all online platforms (your website, GBP, Yelp, Facebook, etc.). A slight variation like "St." vs. "Street" or "(555)" vs. "555" can confuse Google's algorithm.</p>
            <p><strong>Why It's Costly:</strong> Inconsistent NAP data erodes Google's trust in your business. If Google isn't confident about your location or contact info, it won't confidently show your profile to searchers. This is a primary reason why a Google Business Profile might not be showing up in search results.</p>
            <p><strong>The Fix:</strong> Conduct an audit of your online listings. Choose one official NAP format and meticulously update every single mention of your business online to match it. Consistency is key.</p>
            
            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><ListChecks className="h-8 w-8" /> Mistake #2: Wrong or Incomplete Categories</h2>
            <p><strong>The Problem:</strong> You've either chosen a primary category that doesn't accurately represent your main service, or you haven't selected any secondary categories.</p>
            <p><strong>Why It's Costly:</strong> Categories are the primary way you tell Google what your business does. If you're a "Pizzeria" but your primary category is just "Restaurant," you'll miss out on searches specifically for pizza. Failing to add "Catering" or "Italian Restaurant" as secondary categories means you won't appear for those searches either.</p>
            <p><strong>The Fix:</strong> Review your categories. Your primary category should be the most specific and accurate description of your core business. Then, add as many relevant secondary categories as possible to cover all the services you offer. For a step-by-step approach, read our guide on <Link href="/resources/how-to-pick-google-business-categories">how to pick the right Google Business categories</Link>.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><UserCheck className="h-8 w-8" /> Mistake #3: Ignoring Your Reviews</h2>
            <p><strong>The Problem:</strong> You aren't actively encouraging new reviews and, even worse, you're not responding to the ones you do get.</p>
            <p><strong>Why It's Costly:</strong> Reviews are a massive local SEO ranking factor. A steady stream of positive reviews signals trustworthiness to Google. Ignoring them—especially negative ones—tells both customers and Google that you don't value feedback. This lack of engagement is a red flag for the algorithm.</p>
            <p><strong>The Fix:</strong> Create a simple process to ask every happy customer for a review. More importantly, commit to responding to every single review. Thank positive reviewers and professionally address negative feedback. This engagement is a powerful signal that your business is active and customer-focused. Learn more in our guide on <Link href="/resources/does-responding-to-google-reviews-boost-seo">how responding to reviews boosts local SEO</Link>.</p>
            
            <div className="not-prose">
                <Card className="my-12 bg-primary/5 border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                            <Bot className="h-7 w-7" />
                        </div>
                        <CardTitle className="mt-4 text-2xl font-bold">Respond in Seconds with AI</CardTitle>
                        <p className="text-muted-foreground">MyGoProfile's AI drafts perfect, on-brand replies in seconds. Save hours every week and never let a customer go unanswered.</p>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild size="lg">
                            <Link href="/pricing">
                                Start Your Free Trial
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Camera className="h-8 w-8" /> Mistake #4: A Barren or Outdated Photo Section</h2>
            <p><strong>The Problem:</strong> You have few to no photos, or the photos you do have are low-quality, unprofessional, or years out of date.</p>
            <p><strong>Why It's Costly:</strong> Photos are the first thing a potential customer looks at to judge the quality and legitimacy of your business. A profile with no photos looks abandoned or untrustworthy. It also misses a key opportunity to showcase your products, services, and team.</p>
            <p><strong>The Fix:</strong> Commit to uploading at least one new, high-quality photo every week. Showcase your storefront, interior, products, services in action, and friendly team members. A vibrant photo gallery keeps your profile fresh and engaging. See <Link href="/resources/how-often-to-update-photos-on-gbp">how often to update photos on your GBP</Link> for a data-backed approach.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3" id="faq"><HelpCircle className="h-8 w-8" /> Common Google Business Profile Mistakes FAQ</h2>
            <p className="text-muted-foreground mb-6">Quick answers to why your GBP might not be appearing in search and how to fix the most common mistakes.</p>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">What are the most common Google Business Profile mistakes?</h3>
                <p>The most common Google Business Profile mistakes are: (1) <strong>Inconsistent NAP</strong> (name, address, phone) across your website and other listings, (2) <strong>wrong or incomplete categories</strong>, (3) <strong>ignoring reviews</strong> or not responding to them, and (4) <strong>few or outdated photos</strong>. Fixing these often resolves why your GBP is not appearing in search.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Why is my GBP not appearing in search?</h3>
                <p>Your GBP may not be appearing in search because of inconsistent NAP data, wrong or missing categories, no or low engagement with reviews, or a bare or outdated photo gallery. Google may also not show your profile if it is unverified, suspended, or has policy violations. Audit NAP, categories, reviews, and photos first; for a full checklist, see our <Link href="/resources/google-business-profile-optimization">complete guide to Google Business Profile optimization</Link>.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I fix my Google Business Profile so it shows up?</h3>
                <p>Use one consistent NAP everywhere, pick the most specific primary category and add relevant secondary categories, respond to every review and ask happy customers for reviews, and add at least one new photo weekly. For a full step-by-step checklist, use our <Link href="/resources/google-business-profile-optimization">complete guide to Google Business Profile optimization</Link>.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-4">Conclusion: Turn Your Mistakes into Strengths</h2>
            <p>If you're asking &quot;Why is my Google Business not showing up?&quot; or &quot;Why is my GBP not appearing in search?&quot;, the answer likely lies in one of these common Google Business Profile mistakes. The good news is that every one is fixable. By systematically correcting your NAP, optimizing your categories, engaging with reviews, and building a strong photo gallery, you can resolve these errors and turn your profile into a powerful tool for attracting local customers.</p>
            
            <div className="not-prose">
                <section className="border-t my-16 py-16">
                   <div className="container max-w-lg text-center">
                    <h2 className="font-headline text-4xl font-semibold tracking-tight">
                      Don't Wait,{' '}
                      <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                        Dominate.
                      </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                      Stop letting simple mistakes cost you customers. Get started with MyGoProfile in under 2 minutes.
                    </p>
                    <Link href="/pricing" className="mt-8 inline-block">
                      <Button size="lg" className="px-6 py-5 text-sm md:px-10 md:py-6 md:text-base">
                        Start Your Free Trial Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                  <div className="container max-w-screen-md mt-24">
                        <h3 className="text-xl font-bold text-center mb-6">Explore Other Guides</h3>
                        <div className="space-y-3">
                            {otherArticles.map(article => (
                                <Button key={article.href} variant="outline" className="w-full justify-start text-left h-auto" asChild>
                                    <Link href={article.href}>
                                        <div className="flex flex-col">
                                            <span>{article.title}</span>
                                        </div>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                        <p className="mt-6 text-center">
                          <Link href="/resources" className="text-sm font-semibold text-primary hover:underline">View all GBP management guides →</Link>
                        </p>
                    </div>
                </section>
            </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
