
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | MyGoProfile',
  description: 'Terms of Service for MyGoProfile. Read the terms governing your use of our Google Business Profile management platform.',
};

export default function TermsAndConditionsPage() {
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
            <h1>Terms and Conditions</h1>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2>1. Introduction</h2>
            <p>These Terms and Conditions ("Terms") govern your use of the MyGoProfile website and services (collectively, the "Service"), operated by 2xGen LLC ("we", "us", "our"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.</p>
            
            <h2>2. Subscriptions and Payments</h2>
            <p>Our Service is billed on a subscription basis. You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set on a monthly basis.</p>
            <ul>
                <li><strong>Automatic Renewal:</strong> At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or 2xGen LLC cancels it.</li>
                <li><strong>Payment Method:</strong> A valid payment method is required to process the payment for your Subscription. You shall provide accurate and complete billing information.</li>
                <li><strong>Fee Changes:</strong> 2xGen LLC, in its sole discretion and at any time, may modify the Subscription fees. Any Subscription fee change will become effective at the end of the then-current Billing Cycle.</li>
            </ul>

            <h2>3. Cancellations and Refunds</h2>
            <ul>
                <li><strong>Cancellation:</strong> You may cancel your Subscription renewal at any time through your account management page or by contacting us. You will continue to have access to the Service until the end of your current billing period.</li>
                <li><strong>Refunds:</strong> Except when required by law, paid Subscription fees are non-refundable. We do not provide refunds or credits for any partial subscription periods.</li>
            </ul>

            <h2>4. Accounts</h2>
            <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>

            <h2>5. User Content</h2>
            <p>Our Service allows you to post content (e.g., replies to reviews). You are responsible for the content that you post on or through the Service, including its legality, reliability, and appropriateness. We reserve the right to remove any content that violates these Terms or is otherwise objectionable.</p>
            
            <h2>6. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of 2xGen LLC. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

            <h2>7. Limitation of Liability</h2>
            <p>In no event shall 2xGen LLC, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

            <h2>8. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the State of New Mexico, United States, without regard to its conflict of law provisions.</p>

            <h2>9. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

            <h2>10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
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
