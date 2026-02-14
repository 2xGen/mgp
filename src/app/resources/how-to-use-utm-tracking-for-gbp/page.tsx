
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu, Zap, ArrowRight, Bot, BarChart, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const imageUrl = "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/utm%20tracking.png";

export const metadata: Metadata = {
  title: 'How to Use UTM Tracking for Your GBP Website Link',
  description: 'UTM tagging for GBP: add utm_source, utm_medium, utm_campaign to your Google Business Profile website link. See GBP traffic in Google Analytics and prove ROI.',
  keywords: ['utm tracking gbp', 'utm tagging for gbp', 'utm parameters google business profile', 'track gbp traffic', 'google business profile analytics', 'google analytics gbp'],
  openGraph: {
    title: 'How to Use UTM Tracking for Your GBP Website Link',
    description: 'Add UTM parameters to your GBP website link. See GBP traffic in Google Analytics and prove local SEO ROI.',
    url: '/resources/how-to-use-utm-tracking-for-gbp',
    siteName: 'MyGoProfile',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'UTM tracking for Google Business Profile: parameters and Analytics.',
      },
    ],
    locale: 'en_US',
    type: 'article',
    publishedTime: new Date().toISOString(),
    authors: ['MyGoProfile'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Use UTM Tracking for Your GBP Website Link',
    description: 'UTM tagging for GBP: see your profile traffic in Google Analytics and prove ROI.',
    images: [imageUrl],
  },
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'How to Use UTM Tracking for Your GBP Website Link',
  description: 'UTM tagging for GBP: add utm_source, utm_medium, utm_campaign to your Google Business Profile website link. See GBP traffic in Google Analytics and prove ROI.',
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
      name: 'What is UTM tracking for Google Business Profile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'UTM tracking for GBP means adding UTM parameters (utm_source, utm_medium, utm_campaign) to the website URL you put in your Google Business Profile. When someone clicks that link, Google Analytics records the visit with those tags, so you can see how much traffic and how many conversions come from your GBP instead of it being lumped with generic "google / organic" or "direct" traffic.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I add UTM parameters to my Google Business Profile website link?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Append ?utm_source=google&utm_medium=organic&utm_campaign=gbp to your website URL (e.g. https://yoursite.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp). Then set that full URL as your website link in your GBP profile. Use Google\'s Campaign URL Builder to build the link without errors.',
      },
    },
    {
      '@type': 'Question',
      name: 'What UTM parameters should I use for GBP?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For your main GBP website link use: utm_source=google, utm_medium=organic, utm_campaign=gbp. For links inside Google Posts you can vary utm_campaign (e.g. gbp-summer-sale-post) to see which posts drive traffic. Keep source and medium consistent so all GBP traffic is easy to filter in Analytics.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I see GBP traffic in Google Analytics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In Google Analytics 4 go to Reports > Acquisition > Traffic acquisition. Use the search/filter and type "gbp" (or your campaign name) to see sessions and users from your UTM-tagged GBP link. You can then see conversions and other metrics for that traffic.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does adding UTM parameters to my GBP link affect SEO?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. UTM parameters are ignored by Google for ranking. They are only used by analytics tools to attribute traffic. Your GBP and website rankings are not affected by adding UTMs to the website link in your profile.',
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
            name: 'How to Use UTM Tracking for GBP',
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
    const currentPage = allArticles.find(article => article.href.includes('/how-to-use-utm-tracking-for-gbp'));
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
                    { label: 'How to Use UTM Tracking for GBP' },
                ]}
                className="mb-8"
            />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">How to Use UTM Tracking for Your GBP Website Link</h1>
            <p className="lead mt-4 text-xl text-muted-foreground">Stop guessing where your website traffic comes from. This guide shows you exactly how to tag your Google Business Profile links to see their true impact in Google Analytics.</p>
          </div>
        </div>
        <article className="container max-w-screen-md prose prose-lg prose-blue dark:prose-invert mt-12">
            <div className="relative mb-12 h-64 w-full overflow-hidden rounded-xl md:h-80">
                <Image
                    src={imageUrl}
                    alt="UTM tracking for GBP: parameters and Google Analytics"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            
            <p>Your Google Business Profile (GBP) drives valuable clicks to your website, but in Google Analytics, this traffic often gets mislabeled as "google / organic" or "(direct) / (none)." This makes it impossible to know how effective your <Link href="/resources/google-business-profile-optimization">GBP optimization</Link> efforts really are. UTM parameters are the solution. They are simple tags you add to your URLs to tell Google Analytics exactly where your traffic is coming from.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Zap className="h-8 w-8" />What Are UTM Parameters?</h2>
            <p>UTM (Urchin Tracking Module) parameters are snippets of text added to the end of a URL. There are five main parameters, but for GBP, we're focused on three:</p>
            <ul>
                <li><strong>utm_source:</strong> Identifies the source of your traffic (e.g., `google`).</li>
                <li><strong>utm_medium:</strong> The marketing medium (e.g., `organic`).</li>
                <li><strong>utm_campaign:</strong> The specific campaign name (e.g., `gbp`).</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3">Creating Your Main GBP Website Link</h2>
            <p>Your main website link on your GBP profile should be tagged to identify all traffic coming from your profile. We recommend the following structure:</p>
            <p><code>?utm_source=google&utm_medium=organic&utm_campaign=gbp</code></p>
            <p>So, if your website is `https://mybakery.com`, your full GBP website link would be:</p>
            <p><code>https://mybakery.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp</code></p>
            <blockquote>Use Google's <a href="https://ga-dev-tools.google/campaign-url-builder/" target="_blank" rel="noopener noreferrer">Campaign URL Builder</a> to create these links easily and avoid errors.</blockquote>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3">Tracking Google Posts and Other Links</h2>
            <p>You can get even more granular by tagging links within your <Link href="/resources/best-time-to-post-on-google-business-profile">Google Posts</Link>. This allows you to measure the performance of specific offers or announcements. For this, we'll modify the `utm_campaign` parameter.</p>
            <ul>
                <li><strong>For a Summer Sale Post:</strong><br /><code>?utm_source=google&utm_medium=organic&utm_campaign=gbp-summer-sale-post</code></li>
                <li><strong>For a New Product Post:</strong><br /><code>?utm_source=google&utm_medium=organic&utm_campaign=gbp-new-product-post</code></li>
            </ul>
            
            <div className="not-prose">
                <Card className="my-12 bg-primary/5 border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                            <Bot className="h-7 w-7" />
                        </div>
                        <CardTitle className="mt-4 text-2xl font-bold">Effortless Analytics</CardTitle>
                        <p className="text-muted-foreground">MyGoProfile helps you make sense of your data, showing you what works so you can do more of it.</p>
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

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><BarChart className="h-8 w-8" />Seeing the Data in Google Analytics 4</h2>
            <p>Once you've implemented UTM tracking, you can easily find your GBP traffic in Google Analytics 4:</p>
            <ol>
                <li>Go to **Reports > Acquisition > Traffic acquisition**.</li>
                <li>In the search box above the table, type **"gbp"** and press Enter.</li>
                <li>The table will now be filtered to show you only the traffic from sessions where the campaign name includes "gbp."</li>
            </ol>
            <p>You can now see exactly how many users, sessions, and conversions are being driven by your Google Business Profile, finally proving its ROI.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3" id="faq"><HelpCircle className="h-8 w-8" /> UTM Tracking for GBP FAQ</h2>
            <p className="text-muted-foreground mb-6">Quick answers to UTM tagging for Google Business Profile and seeing your traffic in Google Analytics.</p>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">What is UTM tracking for Google Business Profile?</h3>
                <p>UTM tracking for GBP means adding UTM parameters (<code>utm_source</code>, <code>utm_medium</code>, <code>utm_campaign</code>) to the website URL you put in your Google Business Profile. When someone clicks that link, Google Analytics records the visit with those tags, so you can see how much traffic and how many conversions come from your GBP instead of it being lumped with generic &quot;google / organic&quot; or &quot;direct&quot; traffic.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I add UTM parameters to my Google Business Profile website link?</h3>
                <p>Append <code>?utm_source=google&amp;utm_medium=organic&amp;utm_campaign=gbp</code> to your website URL (e.g. <code>https://yoursite.com/?utm_source=google&amp;utm_medium=organic&amp;utm_campaign=gbp</code>). Then set that full URL as your website link in your GBP profile. Use Google&apos;s <a href="https://ga-dev-tools.google/campaign-url-builder/" target="_blank" rel="noopener noreferrer">Campaign URL Builder</a> to build the link without errors.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">What UTM parameters should I use for GBP?</h3>
                <p>For your main GBP website link use: <code>utm_source=google</code>, <code>utm_medium=organic</code>, <code>utm_campaign=gbp</code>. For links inside <Link href="/resources/best-time-to-post-on-google-business-profile">Google Posts</Link> you can vary <code>utm_campaign</code> (e.g. <code>gbp-summer-sale-post</code>) to see which posts drive traffic. Keep source and medium consistent so all GBP traffic is easy to filter in Analytics.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I see GBP traffic in Google Analytics?</h3>
                <p>In Google Analytics 4 go to <strong>Reports &gt; Acquisition &gt; Traffic acquisition</strong>. Use the search/filter and type &quot;gbp&quot; (or your campaign name) to see sessions and users from your UTM-tagged GBP link. You can then see conversions and other metrics for that traffic.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Does adding UTM parameters to my GBP link affect SEO?</h3>
                <p>No. UTM parameters are ignored by Google for ranking. They are only used by analytics tools to attribute traffic. Your GBP and website rankings are not affected by adding UTMs to the website link in your profile.</p>
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
