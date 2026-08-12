
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu, Zap, Bot, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const imageUrl = "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/Future%20of%20Local%20Search.png";

export const metadata: Metadata = {
  title: 'AI Overviews & Local SEO: How Google\u2019s AI Impacts Local Search',
  description: 'AI Overviews local SEO impact explained: why your Google Business Profile feeds Google\u2019s AI answers, and how to win visibility when AI Overviews change local search behavior.',
  keywords: ['ai overviews local seo impact', 'googles ai overviews and local seo', 'how ai overviews change legal local search behavior', 'Google AI Overviews', 'AI Overviews local business', 'future of local search', 'GBP for AI search'],
  openGraph: {
    title: 'AI Overviews & Local SEO: How Google\u2019s AI Impacts Local Search',
    description: 'AI Overviews local SEO impact explained: why your Google Business Profile feeds Google\u2019s AI answers, and how to win visibility when AI Overviews change local search behavior.',
    url: '/resources/future-of-local-search-with-ai-overviews',
    siteName: 'MyGoProfile',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'A futuristic search interface showing an AI-generated overview.',
      },
    ],
    locale: 'en_US',
    type: 'article',
    publishedTime: new Date().toISOString(),
    authors: ['MyGoProfile'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Overviews & Local SEO: How Google\u2019s AI Impacts Local Search',
    description: 'AI Overviews local SEO impact explained: why your Google Business Profile feeds Google\u2019s AI answers, and how to win visibility when AI Overviews change local search behavior.',
    images: [imageUrl],
  },
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'How Google\u2019s AI Overviews Impact Local SEO',
  description: 'AI Overviews local SEO impact explained: why your Google Business Profile feeds Google\u2019s AI answers, and how to win visibility when AI Overviews change local search behavior.',
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
      name: 'What are Google AI Overviews and how do they affect local businesses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI Overviews are AI-generated answers at the top of Google search. For local queries, Google\u2019s AI often pulls from your Google Business Profile—description, services, reviews, replies, photos, posts, Q&A. If your profile is incomplete or negative, you may be left out or summarized poorly. A complete, active, well-reviewed GBP helps you get featured in the overview.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get my business in Google AI Overviews?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fill every field on your GBP, get and respond to reviews, publish Google Posts and new photos regularly, and keep your Q&A updated. The AI favors businesses that look current, complete, and trusted. There\u2019s no direct "submit to AI Overviews" button; optimization and consistency are what matter.',
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
            name: 'Future of Local Search with AI Overviews',
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

export default function BlogPost() {
    const currentPage = allArticles.find(article => article.href.includes('/future-of-local-search-with-ai-overviews'));
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
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold"><Logo /><span>MyGoProfile</span></Link>
                <Link href="/why-mygoprofile" className="text-muted-foreground hover:text-foreground">Why MyGoProfile?</Link>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
                 <Link href="/resources" className="text-muted-foreground hover:text-foreground">Resources</Link>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">Start free trial</Link>
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
                    { label: 'Future of Local Search with AI Overviews' },
                ]}
                className="mb-8"
            />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">How Google's AI Overviews Impact Local SEO</h1>
            <p className="lead mt-4 text-xl text-muted-foreground">Google is rolling out AI-generated answers at the top of its search results. Here's what it means for your local business and why your GBP is now more critical than ever.</p>
          </div>
        </div>
        <article className="container max-w-screen-md prose prose-lg prose-blue dark:prose-invert mt-12">
            <div className="relative mb-12 h-64 w-full overflow-hidden rounded-xl md:h-80">
                <Image
                    src={imageUrl}
                    alt="How Google's AI Overviews Impact Local SEO"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            
            <p>The traditional "10 blue links" on Google are fading away. In their place, Google is integrating **AI Overviews** (formerly known as Search Generative Experience or SGE), which provide direct, AI-generated answers to user queries. For local searches like "best pizza near me," this means Google's AI will summarize information and present a curated list of businesses directly in the answer.</p>
            <p>This is the biggest shift in search in a decade, and it has profound implications for local businesses.</p>
            
            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Layers className="h-8 w-8" />Your GBP is Now the Primary Source for Google's AI</h2>
            <p>Where does Google's AI get the information to create these overviews? For local businesses, the number one source is your Google Business Profile. The AI synthesizes information from:</p>
            <ul>
                <li>Your business description, services, and attributes.</li>
                <li>Your customer reviews and your replies to them.</li>
                <li>Your photos and Google Posts.</li>
                <li>Your Q&A section.</li>
            </ul>
            <p>If your profile is incomplete, outdated, or has negative sentiment, the AI will either ignore you or, worse, summarize that negative information for all to see. In this new world, a poorly managed GBP is a direct liability.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Zap className="h-8 w-8" />How to Win in the Age of AI Overviews</h2>
            <p>The goal is no longer just to rank in the top three; it's to be featured prominently and positively within the AI Overview. Here's how:</p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">1. Complete Every Single Field</h3>
            <p>Every empty field on your GBP is a missed opportunity to feed the AI information. Fill out your services, products, accessibility attributes, and write a detailed, keyword-rich business description. This structured data is exactly what the AI is looking for.</p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">2. Cultivate and Manage Reviews</h3>
            <p>Reviews are now more important than ever. The AI will analyze review sentiment and content to make judgments like "Customers frequently mention the fast service." A consistent stream of positive reviews is crucial. Furthermore, your replies provide context for the AI, showing that you are an engaged and customer-focused business.</p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">3. Keep Your Profile Active</h3>
            <p>Regularly publishing Google Posts and uploading new photos sends strong signals of activity. The AI is designed to favor businesses that are current and relevant. An active profile is a trusted source of information for the AI to pull from.</p>
            
            <div className="not-prose">
                <Card className="my-12 bg-primary/5 border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                            <Bot className="h-7 w-7" />
                        </div>
                        <CardTitle className="mt-4 text-2xl font-bold">Future-Proof Your Local SEO</CardTitle>
                        <p className="text-muted-foreground">MyGoProfile is built for the new era of search. Our tools help you maintain a perfectly optimized, active, and engaging GBP—the key to being featured in Google's AI Overviews.</p>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild size="lg">
                            <Link href="/pricing">
                                Get Started for Free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-4">The Bottom Line</h2>
            <p>AI Overviews represent a shift from &quot;searching for websites&quot; to &quot;getting answers.&quot; For local businesses, your Google Business Profile is the central pillar. Treat it as a dynamic, data-rich resource for Google&apos;s AI. For a full checklist, see our <Link href="/resources/google-business-profile-optimization">complete GBP optimization guide</Link>.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3" id="faq"><HelpCircle className="h-8 w-8" /> AI Overviews and Local Search FAQ</h2>
            <p className="text-muted-foreground mb-6">Short answers on how AI Overviews affect local businesses.</p>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">What are Google AI Overviews and how do they affect local businesses?</h3>
                <p>AI Overviews are AI-generated answers at the top of search. For local queries, Google often pulls from your GBP—description, services, reviews, replies, photos, posts, Q&A. An incomplete or poorly reviewed profile may be left out or summarized badly. A complete, active, well-reviewed profile helps you get featured.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I get my business in Google AI Overviews?</h3>
                <p>Fill every GBP field, get and respond to reviews, publish posts and new photos regularly, and keep Q&A updated. The AI favors businesses that look current, complete, and trusted. Optimization and consistency are what matter; there&apos;s no separate submission.</p>
              </div>
            </div>

             <div className="not-prose">
                <section className="border-t my-16 py-16">
                  <div className="container max-w-screen-md">
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
