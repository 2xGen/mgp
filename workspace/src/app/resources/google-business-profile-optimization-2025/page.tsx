
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu, ListChecks, Camera, Users, Zap, ArrowRight, Bot } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const imageUrl = "https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/Why%20Your%20Google%20Business%20Profile%20is%20Non-Negotiable.jpg";

export const metadata: Metadata = {
  title: 'The Complete Guide to Google Business Profile Optimization (2025)',
  description: 'Your comprehensive guide to dominating local search in 2025. Learn how to optimize every aspect of your GBP, from core information and photos to Q&A and advanced SEO strategies.',
  keywords: ['Google Business Profile', 'GBP optimization', 'local SEO', 'GBP SEO', 'local search ranking', 'Google Business Profile 2025', 'local marketing'],
  openGraph: {
    title: 'The Complete Guide to Google Business Profile Optimization (2025)',
    description: 'A complete guide to dominating local search by optimizing your Google Business Profile.',
    url: '/resources/google-business-profile-optimization-2025',
    siteName: 'MyGoProfile',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'A person working on a laptop with a Google Business Profile on screen.',
      },
    ],
    locale: 'en_US',
    type: 'article',
    publishedTime: new Date().toISOString(),
    authors: ['MyGoProfile'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Complete Guide to Google Business Profile Optimization (2025)',
    description: 'Your comprehensive guide to dominating local search in 2025. Learn how to optimize every aspect of your GBP, from core information and photos to Q&A and advanced SEO strategies.',
    images: [imageUrl],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'The Complete Guide to Google Business Profile Optimization (2025)',
  description: 'Your comprehensive guide to dominating local search in 2025. Learn how to optimize every aspect of your GBP, from core information and photos to Q&A and advanced SEO strategies.',
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


export default function BlogPostPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              <Button>Login</Button>
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
                  Login
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 py-16">
        <div className="container max-w-screen-md text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">The Complete Guide to Google Business Profile Optimization (2025)</h1>
          <p className="lead mt-4 text-xl text-muted-foreground">Transform your Google Business Profile into your most powerful customer acquisition tool. This comprehensive guide covers every aspect of GBP optimization to help you rank higher in local search and dominate your market in 2025.</p>
        </div>
        <article className="container max-w-screen-md prose prose-lg prose-blue dark:prose-invert mt-12">
            <div className="relative mb-12 h-64 w-full overflow-hidden rounded-xl md:h-80">
                <Image
                    src={imageUrl}
                    alt="The Complete Guide to Google Business Profile Optimization (2025)"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            
            <h2 className="text-3xl font-bold mt-12 mb-4 text-primary flex items-center gap-3"><Zap className="h-8 w-8" /> Why Your Google Business Profile is Non-Negotiable</h2>
            <p>In 2025, your Google Business Profile (GBP) is more than just a listing; it's your digital storefront, your first impression, and a primary driver of local traffic. When customers search for products or services "near me," Google's "Local Pack" (the map and three business listings at the top of the search results) is often the first thing they see. Securing a spot in this prime real estate is the single most effective way to attract high-intent local customers.</p>
            <p>An optimized GBP provides customers with the instant information they need to make a decision: your services, hours, location, reviews, and photos. It builds trust and credibility before they even visit your website. Neglecting your GBP is like having a shop on a busy street with the doors closed and the lights off. This guide will show you how to turn the lights on and welcome a flood of new customers.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 text-primary flex items-center gap-3"><ListChecks className="h-8 w-8" /> Section 1: Nailing the Basics - Core Information</h2>
            <p>The foundation of a high-ranking GBP is accuracy and completeness. Google rewards profiles that provide the most reliable and comprehensive information to users. Start here.</p>
            
            <h3 className="text-2xl font-semibold mt-8 mb-4">1.1 Business Name</h3>
            <p><strong>Do:</strong> Use your real-world business name exactly as it appears on your signage and legal documents.</p>
            <p><strong>Don't:</strong> Keyword stuff. Adding terms like "best pizza in Brooklyn" or your city name to your business name (e.g., "Brooklyn Plumbing Experts" if your name is just "Plumbing Experts") is a violation of Google's guidelines and can lead to profile suspension.</p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">1.2 Categories</h3>
            <p>This is one of the most critical ranking factors. Choose a primary category that best describes the main offering of your business. Then, select as many additional categories as are relevant. If you're a restaurant that also has a bar and offers catering, select all three.</p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">1.3 Address, Service Area, and Phone Number</h3>
            <ul className="space-y-4">
                <li><strong>Address:</strong> For storefront businesses, ensure your address and map pin are 100% accurate. Inconsistent address information across the web is a major red flag for Google.</li>
                <li><strong>Service Area:</strong> For businesses that travel to customers (plumbers, cleaners, consultants), define your service area by cities, postal codes, or a radius. Avoid making your service area excessively large; keep it realistic to where you actually do business.</li>
                <li><strong>Phone Number:</strong> Use a primary, local phone number. Ensure this number is consistent across your website and other online directories.</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-8 mb-4">1.4 Business Hours</h3>
            <p>Keep your hours updated, especially for holidays or special events. Incorrect hours are a major source of frustration for customers and can lead to negative reviews.</p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">1.5 Website</h3>
            <p>Link directly to your website's homepage. For multi-location businesses, each GBP should link to its respective location page on your website, not the main corporate homepage.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 text-primary flex items-center gap-3"><Camera className="h-8 w-8" /> Section 2: The Power of Visuals - Photos & Videos</h2>
            <p>Customers buy with their eyes. Profiles with a rich collection of high-quality photos and videos receive significantly more clicks and direction requests.</p>
            
            <h3 className="text-2xl font-semibold mt-8 mb-4">2.1 Photo Strategy for 2025</h3>
            <ul className="space-y-4">
                <li><strong>Cover Photo & Logo:</strong> Upload high-resolution versions of your logo and choose a compelling cover photo that best represents your brand.</li>
                <li><strong>Interior & Exterior:</strong> Showcase your space. Show customers what it's like to be there.</li>
                <li><strong>Team Photos:</strong> Humanize your business. Photos of your friendly staff build trust.</li>
                <li><strong>Photos at Work:</strong> Show your team providing services or creating products. This is proof of your expertise.</li>
                <li><strong>Regular Uploads:</strong> Aim to add at least one new photo every week. This signals to Google that your profile is active and current.</li>
            </ul>
            <blockquote><strong>Pro Tip:</strong> Geotag your photos with the location coordinates of your business before uploading. While Google's official stance is mixed, many SEO experts believe it can provide a small ranking boost.</blockquote>

            <h2 className="text-3xl font-bold mt-12 mb-4 text-primary flex items-center gap-3"><Users className="h-8 w-8" /> Section 3: Building Social Proof - Reviews & Q&A</h2>
            <p>Reviews are the currency of local SEO. They are a powerful signal to both Google and potential customers that your business is trustworthy and provides quality service.</p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">3.1 Generating a Consistent Flow of Reviews</h3>
            <ul className="space-y-4">
                <li><strong>Just Ask:</strong> The most effective method is often the simplest. Ask happy customers in person, via email, or through a text message.</li>
                <li><strong>Use a Review Link:</strong> Google provides a direct link to your review form. Make it easy for customers by putting this link on your website, in your email signature, and on receipts.</li>
                <li><strong>Never Incentivize:</strong> Offering discounts or gifts for reviews is against Google's policies and can get you penalized.</li>
            </ul>
            
            <h3 className="text-2xl font-semibold mt-8 mb-4">3.2 Responding to Every Review</h3>
            <p>Responding to reviews is as important as getting them. It shows you care about customer feedback.</p>
            <ul className="space-y-4">
                <li><strong>Positive Reviews:</strong> Thank the customer personally. Mention the specific product or service they enjoyed to add context and keywords.</li>
                <li><strong>Negative Reviews:</strong> Respond quickly and professionally. Acknowledge their concern, apologize for their experience (without admitting fault if inappropriate), and offer to take the conversation offline to resolve the issue. This shows other potential customers that you handle problems responsibly.</li>
            </ul>
            <blockquote><strong>AI-Powered Replies:</strong> Tools like MyGoProfile can draft replies in seconds, ensuring you can maintain a 100% response rate without spending hours writing.</blockquote>

            <div className="not-prose">
                <Card className="my-12 bg-primary/5 border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                            <Bot className="h-7 w-7" />
                        </div>
                        <CardTitle className="mt-4 text-2xl font-bold">Tired of Manually Replying to Reviews?</CardTitle>
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

            <h3 className="text-2xl font-semibold mt-8 mb-4">3.3 Managing the Q&A Section</h3>
            <p>The Q&A section is a goldmine for addressing customer pain points proactively. Anyone can ask or answer a question, so it's vital you manage it.</p>
            <ul className="space-y-4">
                <li><strong>Seed Your Own Q&A:</strong> Prepare a list of your most frequently asked questions and post both the questions and the answers yourself. This allows you to control the narrative.</li>
                <li><strong>Monitor and Answer:</strong> Set up alerts to be notified of new questions and answer them promptly as the business owner.</li>
                <li><strong>Upvote Good Answers:</strong> Upvote your own official answers and other helpful community answers to make them more visible.</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-4 text-primary flex items-center gap-3"><Zap className="h-8 w-8" /> Section 4: Advanced Optimization for 2025</h2>
            <p>Once you've mastered the basics, use these advanced strategies to pull ahead of the competition.</p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">4.1 Google Posts</h3>
            <p>Google Posts are like mini-blog posts or social media updates that appear directly on your GBP. They are a powerful signal of activity and a great way to promote offers, events, and news.</p>
            <ul className="space-y-4">
                <li><strong>Types of Posts:</strong> Use a mix of "Offer," "What's New," and "Event" posts.</li>
                <li><strong>Frequency:</strong> Aim to publish at least one new post every week. Posts expire after 7 days (unless it's an event), so consistency is key.</li>
                <li><strong>Call-to-Action (CTA):</strong> Always include a CTA, such as "Learn More," "Call Now," or "Shop Now."</li>
                <li><strong>Visuals:</strong> Posts with compelling images or videos get significantly more engagement.</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-8 mb-4">4.2 Products & Services</h3>
            <p>Flesh out the "Products" and "Services" sections with detailed descriptions and pricing (if applicable). This not only helps customers but also gives Google more keywords to associate with your business, helping you rank for more specific long-tail searches.</p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">4.3 GBP Messaging</h3>
            <p>Enabling the messaging feature allows customers to contact you directly from your profile. Response time is a ranking factor here, so ensure you can reply quickly. Set up automated welcome messages to acknowledge incoming inquiries immediately.</p>

            <h2 className="text-3xl font-bold mt-12 mb-4 text-primary">Conclusion: Optimization is an Ongoing Process</h2>
            <p>Your Google Business Profile is not a "set it and forget it" tool. It's a dynamic, living profile that requires consistent attention. By regularly updating your information, adding fresh photos, publishing posts, and engaging with customers through reviews and Q&A, you send powerful signals to Google that your business is active, relevant, and deserving of a top spot in local search results.</p>
            <p>Use tools like MyGoProfile to streamline this process with AI-powered replies, a unified dashboard, and performance analytics. By dedicating a small amount of time each week to your GBP, you can turn it into your most reliable and cost-effective channel for attracting new local customers in 2025 and beyond.</p>

            <div className="not-prose">
                <section className="border-t my-16 py-16 text-center">
                   <div className="container max-w-lg">
                    <h2 className="font-headline text-4xl font-semibold tracking-tight">
                      Don't Wait,{' '}
                      <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                        Dominate.
                      </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                      Your customers are searching. Will they find you, or your competition? Get started in under 2 minutes.
                    </p>
                    <Link href="/pricing" className="mt-8 inline-block">
                      <Button size="lg" className="px-6 py-5 text-sm md:px-10 md:py-6 md:text-base">
                        Start Your Free Trial Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </section>
            </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
