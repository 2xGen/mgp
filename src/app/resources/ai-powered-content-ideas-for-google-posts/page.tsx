
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu, Zap, Bot, ArrowRight, Lightbulb, Calendar, Gift, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const imageUrl = "https://ouqeoizufbofdqbuiwvx.supabase.co/storage/v1/object/public/MGP%20Blogs/AI-Powered%20Content%20Ideas%20for%20Your%20Google%20Posts.png";

export const metadata: Metadata = {
  title: 'What to Post on Google Business Profile: AI Content Ideas',
  description: 'What to post on Google Business Profile: product highlights, seasonal posts, FAQs, offers, and testimonials — with AI prompts so you never run out of Google Posts ideas.',
  keywords: ['google posts ideas', 'AI content ideas GBP', 'what to post on Google Business Profile', 'GBP posts'],
  openGraph: {
    title: 'What to Post on Google Business Profile: AI Content Ideas',
    description: 'What to post on Google Business Profile: product highlights, seasonal posts, FAQs, offers, and testimonials — with AI prompts so you never run out of Google Posts ideas.',
    url: '/resources/ai-powered-content-ideas-for-google-posts',
    siteName: 'MyGoProfile',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'A lightbulb made of digital circuits, representing AI-generated ideas.',
      },
    ],
    locale: 'en_US',
    type: 'article',
    publishedTime: new Date().toISOString(),
    authors: ['MyGoProfile'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What to Post on Google Business Profile: AI Content Ideas',
    description: 'What to post on Google Business Profile: product highlights, seasonal posts, FAQs, offers, and testimonials — with AI prompts so you never run out of Google Posts ideas.',
    images: [imageUrl],
  },
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'What to Post on Google Business Profile (AI Content Ideas)',
  description: 'What to post on Google Business Profile: product highlights, seasonal posts, FAQs, offers, and testimonials — with AI prompts so you never run out of Google Posts ideas.',
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
      name: 'What should I post on my Google Business Profile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Good options include: highlighting a product or service, seasonal or holiday content, answering a common question (FAQ), running a special offer or promotion, and sharing a customer testimonial. Mix these and post at least weekly; posts expire after 7 days. Use AI to draft ideas or copy to save time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can AI help with Google Post content ideas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can prompt AI with your business type and goal (e.g. "coffee shop, new latte, relaxing afternoon") to get short post copy or a list of ideas. Use it for seasonal themes, offers, and turning reviews into testimonial posts. Always tweak the output to match your voice before publishing.',
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
            name: 'AI-Powered Content Ideas for Google Posts',
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
    const currentPage = allArticles.find(article => article.href.includes('/ai-powered-content-ideas-for-google-posts'));
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
                    { label: 'AI-Powered Content Ideas for Google Posts' },
                ]}
                className="mb-8"
            />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">What to Post on Google Business Profile (AI Content Ideas)</h1>
            <p className="lead mt-4 text-xl text-muted-foreground">Staring at a blank screen? Here’s how to use AI to generate an endless supply of relevant, engaging content ideas for your Google Business Profile posts.</p>
          </div>
        </div>
        <article className="container max-w-screen-md prose prose-lg prose-blue dark:prose-invert mt-12">
            <div className="relative mb-12 h-64 w-full overflow-hidden rounded-xl md:h-80">
                <Image
                    src={imageUrl}
                    alt="AI-Powered Content Ideas for Your Google Posts"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            
            <p>Consistent Google Posts are a powerful local SEO signal, but the hardest part is often figuring out what to say. AI can be an incredible brainstorming partner, helping you create a content calendar that keeps your profile fresh and your customers engaged. Here are five types of content you can generate with AI.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Lightbulb className="h-8 w-8" />1. Highlight a Specific Product or Service</h2>
            <p>This is the most straightforward type of post. Go beyond just naming the service; ask AI to help you articulate its value.</p>
            <p><strong>AI Prompt Example:</strong> "I run a coffee shop. Write a short, exciting Google Post about our new 'Honey Lavender Latte.' Mention it's perfect for a relaxing afternoon. Include a call to action to come try one today."</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Calendar className="h-8 w-8" />2. Create Seasonal and Holiday-Themed Content</h2>
            <p>Connect with customers by tapping into what's timely. AI is great at generating creative ideas for any time of year.</p>
            <p><strong>AI Prompt Example:</strong> "I own a bookstore. Give me three Google Post ideas for the back-to-school season. One should be a special offer, one should be an event, and one should be a general-themed post."</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Zap className="h-8 w-8" />3. Answer a Frequently Asked Question (FAQ)</h2>
            <p>Turn common customer questions into valuable content. This positions you as an expert and helps customers before they even have to ask.</p>
            <p><strong>AI Prompt Example:</strong> "I'm a mechanic. A common question is 'How often should I get an oil change?'. Write a short, helpful Google Post answering this question and encouraging people to book a service with us."</p>
            
            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3"><Gift className="h-8 w-8" />4. Run a Special Offer or Promotion</h2>
            <p>Use the "Offer" post type in GBP to create a time-sensitive deal that encourages immediate action. AI can help you frame the offer compellingly.</p>
            <p><strong>AI Prompt Example:</strong> "My hair salon wants to offer 20% off for first-time customers. Write a Google Offer Post for this. Make it sound welcoming and exciting. Include a call to action to book an appointment."</p>

            <div className="not-prose">
                <Card className="my-12 bg-primary/5 border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                            <Bot className="h-7 w-7" />
                        </div>
                        <CardTitle className="mt-4 text-2xl font-bold">Content Creation on Autopilot</CardTitle>
                        <p className="text-muted-foreground">MyGoProfile's AI tools are designed for local businesses. Generate ideas, draft posts, and keep your GBP active in a fraction of the time.</p>
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

            <h2 className="text-3xl font-bold mt-12 mb-4">5. Share a Customer Testimonial</h2>
            <p>Turn your best reviews into marketing content. This provides powerful social proof to potential customers.</p>
            <p><strong>AI Prompt Example:</strong> "I received this 5-star review: 'The team was so helpful and fixed my car in no time!'. Turn this into a short Google Post. Thank the customer and use it to highlight our commitment to fast, friendly service."</p>
            <p>By leveraging AI as a creative partner, you can ensure you always have a pipeline of relevant content. For when to publish, see our <Link href="/resources/best-time-to-post-on-google-business-profile">best time to post on GBP</Link>; for the full playbook, our <Link href="/resources/google-business-profile-optimization">complete GBP optimization guide</Link>.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-3" id="faq"><HelpCircle className="h-8 w-8" /> Google Posts Content Ideas FAQ</h2>
            <p className="text-muted-foreground mb-6">Short answers on what to post and how AI can help.</p>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">What should I post on my Google Business Profile?</h3>
                <p>Good options: highlight a product or service, seasonal or holiday content, answer a common question (FAQ), run a special offer, and share a customer testimonial. Mix these and post at least weekly; posts expire after 7 days.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How can AI help with Google Post content ideas?</h3>
                <p>Prompt AI with your business type and goal (e.g. new product, season, offer) to get draft copy or a list of ideas. Use it for seasonal themes, offers, and turning reviews into testimonial posts. Tweak the output to match your voice before publishing.</p>
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
