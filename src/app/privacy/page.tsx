
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MyGoProfile',
  description: 'How MyGoProfile collects, uses, and protects your data. Our commitment to your privacy when using our Google Business Profile tools.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
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
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  Start free trial
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 py-16">
        <div className="container max-w-screen-md prose prose-blue dark:prose-invert">
            <h1>Privacy Policy for MyGoProfile</h1>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2>1. Introduction</h2>
            <p>Welcome to MyGoProfile, a service operated by 2xGen LLC ("we", "us", "our"). We are registered in Albuquerque, New Mexico, USA. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services (collectively, the "Services").</p>
            <p>By using our Services, you agree to the collection, use, and sharing of your information as described in this policy. If you have any questions, please contact us at <a href="mailto:hello@mygoprofile.com">hello@mygoprofile.com</a>.</p>

            <h2>2. Information We Collect</h2>
            <p>We only collect information necessary to provide and improve our Services. This includes:</p>
            <ul>
                <li><strong>Google Account Information:</strong> When you sign in, we use Google's secure OAuth system. We receive your name, email address, and profile picture from your Google Account to create and manage your MyGoProfile account. We never see or store your Google password.</li>
                <li><strong>Google Business Profile Data:</strong> To provide our Services, we access data from your connected Google Business Profile(s), including location information, performance metrics, reviews, posts, photos, and Q&A data. This access is read-only unless you explicitly take an action within our app (like posting a reply).</li>
                <li><strong>Subscription and Payment Information:</strong> When you subscribe to a paid plan, our third-party payment processor will collect your payment information. We do not store your full credit card details on our servers.</li>
                <li><strong>Team Member Information:</strong> If you invite team members, we collect their email addresses to grant them access to the locations you assign.</li>
                <li><strong>Usage Data (via Google Analytics):</strong> We use Google Analytics to collect information about how you interact with our Services, such as which features you use and how much time you spend on the app. This helps us improve the user experience.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
                <li>To provide, maintain, and improve our Services, including the dashboard, analytics, and AI features.</li>
                <li>To process your subscription payments.</li>
                <li>To authenticate you and secure your account.</li>
                <li>To communicate with you, including sending product updates, offers, and requests for feedback.</li>
                <li>To respond to your questions and provide customer support.</li>
                <li>To analyze usage trends to improve our Services.</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            <p>We do not sell your personal information. We may share it with third-party service providers only as necessary to provide our Services:</p>
            <ul>
                <li><strong>Google:</strong> We share data with Google's Business Profile APIs to manage your profile and with Google's AI Platform (via Genkit) to generate content like review replies.</li>
                <li><strong>Firebase/Google Cloud:</strong> Our application infrastructure, including our database and authentication, is hosted on Google's secure cloud platform.</li>
                <li><strong>Payment Processor:</strong> We share payment information with our payment processor (e.g., Stripe) to handle subscriptions.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>We take the security of your data very seriously. We implement appropriate technical and organizational measures to protect it from unauthorized access, alteration, or destruction. All authentication with Google is handled via the secure OAuth 2.0 protocol, meaning we never have access to your Google password.</p>

            <h2>6. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. You can manage most of your information directly within your account settings. For any requests or questions about your data, please contact us at <a href="mailto:hello@mygoprofile.com">hello@mygoprofile.com</a>.</p>
            
            <h2>7. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. We encourage you to review this page periodically for any changes.</p>
            
            <h2>8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
                <li>By email: <a href="mailto:hello@mygoprofile.com">hello@mygoprofile.com</a></li>
                <li>Company: 2xGen LLC, Albuquerque, New Mexico, USA</li>
            </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
