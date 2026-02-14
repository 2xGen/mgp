
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu, Zap, ArrowRight, Bot, MapPin, ListChecks, Heart, ThumbsUp, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const imageUrl = "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/how%20to%20optimize%20your%20gbp.png";

export const metadata: Metadata = {
  title: 'How to Optimize Your GBP for “Near Me” Searches',
  description: 'Rank for "near me" searches: NAP consistency, right categories, local content, reviews, and geotagged photos. Get your Google Business Profile in front of nearby customers.',
  keywords: ['near me searches', 'optimize GBP for near me', 'rank for near me searches', 'google business profile near me', 'local SEO near me', 'GBP near me optimization'],
  openGraph: {
    title: 'How to Optimize Your GBP for “Near Me” Searches',
    description: 'Rank for "near me" searches with NAP, categories, local content, reviews, and photos. Get visible to nearby customers.',
    url: '/resources/how-to-optimize-for-near-me-searches',
    siteName: 'MyGoProfile',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'How to optimize your Google Business Profile for "near me" searches: map, location, and local SEO.',
      },
    ],
    locale: 'en_US',
    type: 'article',
    publishedTime: new Date().toISOString(),
    authors: ['MyGoProfile'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Optimize Your GBP for “Near Me” Searches',
    description: 'Rank for "near me" searches: NAP, categories, local content, reviews, geotagged photos.',
    images: [imageUrl],
  },
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'How to Optimize Your GBP for “Near Me” Searches',
  description: 'Rank for "near me" searches with NAP consistency, categories, local content, reviews, and geotagged photos. Get your Google Business Profile in front of nearby customers.',
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
      name: 'What are "near me" searches?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '"Near me" searches are queries like "restaurants near me," "plumber near me," or "coffee shop near me" where the user wants to find a local business. Google uses the searcher\'s location (and sometimes the query) to show the Local Pack and Maps results. These searches are highly intent-driven—people are ready to visit or call.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Google rank businesses for "near me" searches?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Google ranks businesses for "near me" using three main factors: relevance (does your business match the search?), distance (how close you are to the searcher), and prominence (reviews, consistency, completeness of your GBP). You can\'t change distance, but you can improve relevance and prominence with consistent NAP, the right categories, local content, reviews, and photos.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why isn\'t my business showing for "near me" searches?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Common reasons include inconsistent NAP across the web, a primary category that\'s too broad or wrong, few or no reviews, not responding to reviews, or a sparse/outdated photo gallery. Fix NAP first, then categories, then focus on reviews and fresh photos. See our guide on common GBP mistakes if your profile isn\'t showing up at all.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I rank for "near me" searches?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Keep NAP identical everywhere, choose the most specific primary category and add relevant secondary categories, use local keywords in your description and Google Posts, get and respond to reviews, and upload geotagged photos regularly. For a full checklist, use our complete guide to Google Business Profile optimization.',
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
            name: 'How to Optimize Your GBP for "Near Me" Searches',
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
    const currentPage = allArticles.find(article => article.href.includes('/how-to-optimize-for-near-me-searches'));
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
                    { label: 'How to Optimize for "Near Me" Searches' },
                ]}
                className="mb-8"
            />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">How to Optimize Your GBP for “Near Me” Searches</h1>
            <p className="lead mt-4 text-xl text-muted-foreground">"Near me" searches are the lifeblood of local businesses. This guide covers the essential strategies to ensure your Google Business Profile appears at the top when high-intent customers are searching nearby.</p>
          </div>
        </div>
        <article className="container max-w-screen-md prose prose-lg prose-blue dark:prose-invert mt-12">
            <div className="relative mb-12 h-64 w-full overflow-hidden rounded-xl md:h-80">
                <Image
                    src={imageUrl}
                    alt="How to Optimize Your GBP for “Near Me” Searches"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            
            <p>Searches containing phrases like &quot;restaurants near me&quot; or &quot;plumber near me&quot; have exploded in recent years. These are not casual browsers; they are customers with immediate needs, ready to make a decision. Winning these searches means winning more business, period. For a full breakdown, see our <Link href="/resources/google-business-profile-optimization">complete guide to GBP optimization</Link>. Google&apos;s algorithm for &quot;near me&quot; searches prioritizes three factors: <strong>relevance, distance, and prominence</strong>. While you can&apos;t change your physical distance from the searcher, you have complete control over relevance and prominence. If your business isn&apos;t showing up in local search at all, start with our guide on <Link href="/resources/top-google-business-profile-mistakes">common Google Business Profile mistakes</Link>.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><MapPin className="h-8 w-8" />1. Master NAP Consistency</h2>
            <p>Your business's <strong>Name, Address, and Phone Number (NAP)</strong> must be perfectly consistent across the web. This is the bedrock of local SEO. Any variation, no matter how small ("St." vs. "Street", "Co." vs. "Company"), erodes Google's confidence in your location data. If Google isn't 100% sure where you are, it won't show you in "near me" results. Audit your website footer, contact page, social media profiles, and other online directories to ensure they match your GBP exactly.</p>
            
            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><ListChecks className="h-8 w-8" />2. Choose the Right Categories</h2>
            <p>Your primary GBP category is the most important signal you can send to Google about what your business does. Be as specific as possible. Don't choose "Restaurant" if you can choose "Pizza Restaurant." Then, add as many relevant secondary categories as possible ("Italian Restaurant," "Catering," "Food Delivery") to capture related searches. Learn more about <Link href="/resources/how-to-pick-google-business-categories">how to pick the right categories</Link>.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Zap className="h-8 w-8" />3. Localize Your Content</h2>
            <p>Sprinkle local keywords naturally throughout your GBP content. Mention your neighborhood, city, and nearby landmarks in your business description and Google Posts. For example, instead of "We serve delicious coffee," try "Serving delicious coffee to the Downtown community since 2010." This reinforces your local relevance.</p>
            
            <div className="not-prose">
                <Card className="my-12 bg-primary/5 border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                            <Bot className="h-7 w-7" />
                        </div>
                        <CardTitle className="mt-4 text-2xl font-bold">Never Miss a Local Opportunity</CardTitle>
                        <p className="text-muted-foreground">MyGoProfile's AI helps you stay optimized, ensuring you're always visible to nearby customers.</p>
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

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Heart className="h-8 w-8" />4. Encourage and Respond to Reviews</h2>
            <p>A steady stream of positive reviews is a huge prominence signal. Google sees that local customers trust your business. Just as importantly, <Link href="/resources/does-responding-to-google-reviews-boost-seo">responding to those reviews</Link> (both positive and negative) shows Google that you are an active, engaged business owner. In your replies, you can even mention your city or services naturally to further boost local signals.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><ThumbsUp className="h-8 w-8" />5. Use Geotagged Photos</h2>
            <p>When you upload photos of your storefront, products, or team, make sure they are geotagged with your business's latitude and longitude. While Google strips this data publicly, many SEO experts believe it is used internally as another signal to confirm your precise location, strengthening your case for "near me" searches. Find out <Link href="/resources/how-often-to-update-photos-on-gbp">how often you should update your photos</Link>.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3" id="faq"><HelpCircle className="h-8 w-8" /> "Near Me" Searches FAQ</h2>
            <p className="text-muted-foreground mb-6">Quick answers to how "near me" searches work and how to get your business in front of nearby customers.</p>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">What are "near me" searches?</h3>
                <p>&quot;Near me&quot; searches are queries like &quot;restaurants near me,&quot; &quot;plumber near me,&quot; or &quot;coffee shop near me&quot; where the user wants to find a local business. Google uses the searcher&apos;s location (and sometimes the query) to show the Local Pack and Maps results. These searches are highly intent-driven—people are ready to visit or call.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How does Google rank businesses for "near me" searches?</h3>
                <p>Google ranks businesses for &quot;near me&quot; using three main factors: <strong>relevance</strong> (does your business match the search?), <strong>distance</strong> (how close you are to the searcher), and <strong>prominence</strong> (reviews, consistency, completeness of your GBP). You can&apos;t change distance, but you can improve relevance and prominence with consistent NAP, the right categories, local content, reviews, and photos.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Why isn&apos;t my business showing for "near me" searches?</h3>
                <p>Common reasons include inconsistent NAP across the web, a primary category that&apos;s too broad or wrong, few or no reviews, not responding to reviews, or a sparse or outdated photo gallery. Fix NAP first, then categories, then focus on reviews and fresh photos. If your profile isn&apos;t showing up at all, see our guide on <Link href="/resources/top-google-business-profile-mistakes">common Google Business Profile mistakes</Link>.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How can I rank for "near me" searches?</h3>
                <p>Keep NAP identical everywhere, choose the most specific primary category and add relevant secondary categories, use local keywords in your description and Google Posts, get and respond to reviews, and upload geotagged photos regularly. For a full checklist, use our <Link href="/resources/google-business-profile-optimization">complete guide to Google Business Profile optimization</Link>.</p>
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
