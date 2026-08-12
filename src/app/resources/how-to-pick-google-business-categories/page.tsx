
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu, Zap, ArrowRight, Bot, ListChecks, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const imageUrl = "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/google%20business%20categories.png";

export const metadata: Metadata = {
  title: 'Google Business Profile Categories List: How to Choose the Right One',
  description: 'How to choose Google Business Profile categories: one specific primary + up to 9 secondary. Includes tips for Google My Business categories and why your category list matters for local SEO.',
  keywords: ['google business categories list', 'google my business categories', 'google business categories', 'google my business category', 'choose category', 'how to pick google business categories', 'google business profile categories', 'gbp categories', 'primary category gbp', 'secondary categories google business'],
  openGraph: {
    title: 'Google Business Profile Categories List: How to Choose the Right One',
    description: 'How to choose Google Business Profile categories: one specific primary + up to 9 secondary. Includes tips for Google My Business categories and why your category list matters for local SEO.',
    url: '/resources/how-to-pick-google-business-categories',
    siteName: 'MyGoProfile',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'How to pick Google Business Profile categories: primary and secondary.',
      },
    ],
    locale: 'en_US',
    type: 'article',
    publishedTime: new Date().toISOString(),
    authors: ['MyGoProfile'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Google Business Profile Categories List: How to Choose the Right One',
    description: 'How to choose Google Business Profile categories: one specific primary + up to 9 secondary. Includes tips for Google My Business categories and why your category list matters for local SEO.',
    images: [imageUrl],
  },
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'Google Business Profile Categories: How to Choose the Right One',
  description: 'How to choose Google Business Profile categories: one specific primary + up to 9 secondary. Includes tips for Google My Business categories and why your category list matters for local SEO.',
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
      name: 'How do I pick the right Google Business Profile category?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Choose one primary category that is the most specific match for your main business (e.g. "Pizza restaurant" not "Restaurant"). Add up to nine secondary categories for other services or features. Be specific, think like a customer, and check what top-ranking competitors in your area use.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many categories can you have on Google Business Profile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You get one primary category and up to nine secondary categories (10 total). The primary category has the most weight for ranking; secondaries help you show up for related searches.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between primary and secondary Google Business categories?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The primary category is the single best description of your core business and carries the most ranking weight. Secondary categories represent other services, features, or aspects of your business. You can have one primary and up to nine secondary.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you change your Google Business Profile category?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can change your primary and secondary categories at any time in your Business Profile settings. Use the same guidelines: pick the most specific primary and add relevant secondaries. Changes can take a little time to reflect in search.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do Google Business Profile categories matter for local SEO?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Categories are a primary way you tell Google what your business is. They directly affect which searches you appear in. Wrong or vague categories mean showing up in irrelevant searches or not showing up at all. The right categories help you rank for "near me" and category-based local searches.',
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
            name: 'Google Business Categories: How to Pick the Right One',
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
    const currentPage = allArticles.find(article => article.href.includes('/how-to-pick-google-business-categories'));
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
                    { label: 'How to Pick Google Business Categories' },
                ]}
                className="mb-8"
            />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Google Business Profile Categories: How to Choose the Right One</h1>
            <p className="lead mt-4 text-xl text-muted-foreground">Choosing your GBP categories seems simple, but it's one of the most critical local SEO decisions you'll make. This guide shows you how to do it right.</p>
          </div>
        </div>
        <article className="container max-w-screen-md prose prose-lg prose-blue dark:prose-invert mt-12">
            <div className="relative mb-12 h-64 w-full overflow-hidden rounded-xl md:h-80">
                <Image
                    src={imageUrl}
                    alt="How to pick Google Business Profile categories: primary and secondary"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            
            <p>Of all the fields in your Google Business Profile, your categories have one of the most direct and powerful impacts on your ranking. They are the primary way you tell Google what your business is and what kind of customers you serve. Getting them wrong means showing up in irrelevant searches—or not showing up at all. It's a cornerstone of our <Link href="/resources/google-business-profile-optimization">GBP optimization guide</Link>.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><ListChecks className="h-8 w-8" />Primary vs. Secondary Categories</h2>
            <p>Google allows you to choose one <strong>primary category</strong> and up to nine <strong>secondary categories</strong>.</p>
            <ul>
                <li><strong>Primary Category:</strong> This is your most important category. It should represent the core identity of your business. If you're a restaurant that sells mainly pizza, your primary category should be "Pizza restaurant," not just "Restaurant."</li>
                <li><strong>Secondary Categories:</strong> These are for the other services or aspects of your business. For that same pizza restaurant, secondary categories could be "Italian restaurant," "Catering," "Bar," and "Food delivery."</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3">How to Choose Your Primary Category</h2>
            <p>Your primary category carries the most weight. Follow these rules to select the best one:</p>
            <ol>
                <li><strong>Be Specific:</strong> Always choose the most specific category that accurately describes your main business. "Nail salon" is better than "Beauty salon." "Criminal justice attorney" is better than "Law firm."</li>
                <li><strong>Think Like a Customer:</strong> What is the main term a customer would use to find a business like yours? That should guide your choice.</li>
                <li><strong>Spy on Competitors:</strong> Search for your main keyword in your area and see what primary category the top-ranking businesses are using. This is a strong clue as to what Google values for that search term.</li>
            </ol>
            
            <div className="not-prose">
                <Card className="my-12 bg-primary/5 border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                            <Bot className="h-7 w-7" />
                        </div>
                        <CardTitle className="mt-4 text-2xl font-bold">Optimize Your Profile with Confidence</CardTitle>
                        <p className="text-muted-foreground">MyGoProfile's optimization checklist guides you through every step, including category selection, to ensure your GBP is perfectly configured.</p>
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

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3">Leveraging Secondary Categories</h2>
            <p>Once your primary category is set, use secondary categories to capture a wider range of relevant searches.</p>
            <ul>
                <li><strong>Cover All Your Services:</strong> If your plumbing company also does "HVAC contractor" work, add it as a secondary category.</li>
                <li><strong>List Features and Amenities:</strong> A "Restaurant" can add "Bar" or "Outdoor seating."</li>
                <li><strong>Don't Add Everything:</strong> Only choose categories that are genuinely part of your business. Adding "Vegan restaurant" when you only have one vegan option is misleading and can hurt your credibility.</li>
            </ul>
            
            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3">The Bottom Line</h2>
            <p>Choosing your Google Business Categories is a strategic decision, not an afterthought. By selecting a specific primary category and a comprehensive set of secondary categories, you provide Google with a clear, powerful signal about your business&apos;s identity. This clarity is rewarded with higher rankings in the searches that matter most to your bottom line, like <Link href="/resources/how-to-optimize-for-near-me-searches">&quot;near me&quot; searches</Link>.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3" id="faq"><HelpCircle className="h-8 w-8" /> Google Business Categories FAQ</h2>
            <p className="text-muted-foreground mb-6">Quick answers to how to pick categories, primary vs secondary, and why they matter for local SEO.</p>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I pick the right Google Business Profile category?</h3>
                <p>Choose one <strong>primary category</strong> that is the most specific match for your main business (e.g. &quot;Pizza restaurant&quot; not &quot;Restaurant&quot;). Add up to nine <strong>secondary categories</strong> for other services or features. Be specific, think like a customer, and check what top-ranking competitors in your area use. For the full picture, see our <Link href="/resources/google-business-profile-optimization">complete GBP optimization guide</Link>.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How many categories can you have on Google Business Profile?</h3>
                <p>You get <strong>one primary category</strong> and <strong>up to nine secondary categories</strong> (10 total). The primary category has the most weight for ranking; secondaries help you show up for related searches.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">What is the difference between primary and secondary Google Business categories?</h3>
                <p>The <strong>primary category</strong> is the single best description of your core business and carries the most ranking weight. <strong>Secondary categories</strong> represent other services, features, or aspects of your business. You can have one primary and up to nine secondary.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Can you change your Google Business Profile category?</h3>
                <p>Yes. You can change your primary and secondary categories at any time in your Business Profile settings. Use the same guidelines: pick the most specific primary and add relevant secondaries. Changes can take a little time to reflect in search.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Why do Google Business Profile categories matter for local SEO?</h3>
                <p>Categories are a primary way you tell Google what your business is. They directly affect which searches you appear in. Wrong or vague categories mean showing up in irrelevant searches—or <Link href="/resources/top-google-business-profile-mistakes">not showing up at all</Link>. The right categories help you rank for &quot;near me&quot; and category-based local searches.</p>
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
