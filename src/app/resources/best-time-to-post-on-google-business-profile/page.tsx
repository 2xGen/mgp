
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu, Zap, ArrowRight, Bot, Clock, BarChart, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const imageUrl = "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/best%20time%20to%20post.png";

export const metadata: Metadata = {
  title: 'Best Time to Post on Google Business Profile (Based on Data)',
  description: 'Best time to post on Google Business Profile: lunch and commute peaks, mid-week, and how to use your own GBP Insights. Google Business Profile posts expire after 7 days—post when it counts.',
  keywords: ['best time to post on google business profile', 'best time to post on google my business', 'do google business profile posts expire after 7 days', 'posting times google analytics', 'gbp posts', 'when to post google business'],
  openGraph: {
    title: 'Best Time to Post on Google Business Profile (Based on Data)',
    description: 'Data-backed best times to post on GBP. Posts expire after 7 days—post when your customers are online.',
    url: '/resources/best-time-to-post-on-google-business-profile',
    siteName: 'MyGoProfile',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'Best time to post on Google Business Profile: data-backed posting times, 7-day expiry.',
      },
    ],
    locale: 'en_US',
    type: 'article',
    publishedTime: new Date().toISOString(),
    authors: ['MyGoProfile'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Time to Post on Google Business Profile (Based on Data)',
    description: 'Best times to post on GBP: lunch, commute, mid-week. Posts expire after 7 days.',
    images: [imageUrl],
  },
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'The Best Time to Post on Google Business Profile (Based on Data)',
  description: 'Best time to post on Google Business Profile: data-backed times and days. Google Posts expire after 7 days—post when your customers are most active.',
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
      name: 'What is the best time to post on Google Business Profile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Data shows strong activity around lunch (11 AM–1 PM), morning and afternoon commute (8–10 AM, 4–6 PM), and mid-week (Tuesday–Thursday). The best approach is to use your GBP Insights "When your business is busiest" and post 1–2 hours before those peaks. At least one post per week; 2–3 per week is ideal if you have regular updates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do Google Business Profile posts expire after 7 days?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Standard Google Business Profile posts (offers, updates, what\'s new) expire after 7 days. Event posts can last until the event date. Because posts expire quickly, timing matters—publish when your customers are most likely to see them.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best time to post on Google My Business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Google My Business is now Google Business Profile (same product). The best time to post is the same: use your GBP Insights to find when your business is busiest, then post 1–2 hours before those peaks. Aggregate data suggests lunch, commute times, and Tuesday–Thursday perform well.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I see posting times and performance in analytics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GBP doesn\'t report post-level performance in Business Profile Insights. To see which posting times drive traffic, add UTM parameters to your post links and review performance in Google Analytics. Our guide on UTM tracking for GBP shows how to set this up.',
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
            name: 'Best Time to Post on Google Business Profile',
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
    const currentPage = allArticles.find(article => article.href.includes('/best-time-to-post-on-google-business-profile'));
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
                    { label: 'Best Time to Post on Google Business Profile' },
                ]}
                className="mb-8"
            />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">The Best Time to Post on Google Business Profile (Based on Data)</h1>
            <p className="lead mt-4 text-xl text-muted-foreground">Timing is everything. Posting an update when your customers aren't online is a wasted opportunity. We've analyzed the data to help you figure out the optimal time to publish your Google Posts.</p>
          </div>
        </div>
        <article className="container max-w-screen-md prose prose-lg prose-blue dark:prose-invert mt-12">
            <div className="relative mb-12 h-64 w-full overflow-hidden rounded-xl md:h-80">
                <Image
                    src={imageUrl}
                    alt="Best time to post on Google Business Profile: data-backed posting times and 7-day expiry"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            
            <p>Google Posts are a free and powerful way to engage customers directly on your GBP, but their impact diminishes quickly. Unlike a permanent description, posts are timely—and <strong>Google Business Profile posts expire after 7 days</strong> (event posts can run until the event date). So when is the best time to publish them for maximum visibility and engagement? For a full strategy, see our <Link href="/resources/google-business-profile-optimization">complete guide to GBP optimization</Link>.</p>
            <p>The answer isn't the same for every business, but data shows clear patterns you can use to your advantage.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Clock className="h-8 w-8" />General Best Times to Post (Based on Aggregate Data)</h2>
            <p>Studies analyzing thousands of Google Business Profiles have found that customer activity peaks during specific times:</p>
            <ul>
                <li><strong>Lunchtime Rush (11 AM - 1 PM):</strong> This is a prime slot for restaurants, cafes, and retail shops as people plan their lunch breaks or afternoon shopping.</li>
                <li><strong>Commute Times (8 AM - 10 AM & 4 PM - 6 PM):</strong> People are often on their phones, looking for dinner spots, happy hours, or services they need to book.</li>
                <li><strong>Mid-week (Tuesday to Thursday):</strong> These days generally see higher engagement than Mondays (catch-up day) and Fridays (people are already checked out).</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><BarChart className="h-8 w-8" />The Gold Standard: Use Your Own Data</h2>
            <p>Aggregate data is a great starting point, but your own GBP Insights are the ultimate source of truth. Here's how to find your specific peak times:</p>
            <ol>
                <li>Go to your Google Business Profile Manager.</li>
                <li>Click on the "Performance" (or "Insights") tab.</li>
                <li>Scroll down to the chart that shows "When your business is busiest." This data, based on direction requests and foot traffic, is pure gold.</li>
                <li>Identify the days and hours with the highest bars. <strong>Post 1-2 hours BEFORE these peak times</strong> to ensure your post is live and visible when your customers are most active. For better tracking, learn <Link href="/resources/how-to-use-utm-tracking-for-gbp">how to use UTM parameters</Link>.</li>
            </ol>
            
            <div className="not-prose">
                <Card className="my-12 bg-primary/5 border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                            <Bot className="h-7 w-7" />
                        </div>
                        <CardTitle className="mt-4 text-2xl font-bold">Automate Your Posting Strategy</CardTitle>
                        <p className="text-muted-foreground">MyGoProfile simplifies posting and will soon allow you to schedule posts in advance. Focus on your business, and let us handle the timing.</p>
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

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Zap className="h-8 w-8" />Posting Cadence: Consistency Beats Intensity</h2>
            <p>While standard Google Posts expire after 7 days, the goal isn't just to stay visible—it's to signal to Google that your business is active. A consistent posting schedule is a powerful local SEO signal.</p>
            <ul>
                <li><strong>Minimum Goal:</strong> Aim for at least one post per week.</li>
                <li><strong>Ideal Goal:</strong> Posting 2-3 times per week, especially if you have regular promotions or updates, can significantly boost engagement.</li>
            </ul>
            
            <p>By aligning your posting schedule with your customer&apos;s activity patterns, you dramatically increase the chances of your offers and updates being seen, driving more traffic and sales.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3" id="faq"><HelpCircle className="h-8 w-8" /> Best Time to Post on Google Business Profile FAQ</h2>
            <p className="text-muted-foreground mb-6">Quick answers to when to post, 7-day expiry, and how to use data for posting times.</p>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">What is the best time to post on Google Business Profile?</h3>
                <p>Data shows strong activity around lunch (11 AM–1 PM), morning and afternoon commute (8–10 AM, 4–6 PM), and mid-week (Tuesday–Thursday). The best approach is to use your GBP Insights &quot;When your business is busiest&quot; and post 1–2 hours before those peaks. Aim for at least one post per week; 2–3 per week is ideal if you have regular updates.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Do Google Business Profile posts expire after 7 days?</h3>
                <p>Yes. Standard Google Business Profile posts (offers, updates, what&apos;s new) expire after 7 days. Event posts can last until the event date. Because posts expire quickly, timing matters—publish when your customers are most likely to see them.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">What is the best time to post on Google My Business?</h3>
                <p>Google My Business is now Google Business Profile (same product). The best time to post is the same: use your GBP Insights to find when your business is busiest, then post 1–2 hours before those peaks. Aggregate data suggests lunch, commute times, and Tuesday–Thursday perform well.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How can I see posting times and performance in analytics?</h3>
                <p>GBP doesn&apos;t report post-level performance in Business Profile Insights. To see which posting times drive traffic, add UTM parameters to your post links and review performance in <Link href="/resources/how-to-use-utm-tracking-for-gbp">Google Analytics</Link>. Our guide on <Link href="/resources/how-to-use-utm-tracking-for-gbp">UTM tracking for GBP</Link> shows how to set this up.</p>
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
