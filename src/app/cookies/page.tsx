
import { Logo } from '@/components/icons';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - MyGoProfile',
  description: 'Learn how MyGoProfile uses cookies to improve our services and enhance your experience. Understand your choices and how to manage your privacy settings.',
}


export default function CookiePolicyPage() {
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
        <div className="container max-w-screen-md prose prose-blue dark:prose-invert">
            <h1>Cookie Policy</h1>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2>What Are Cookies?</h2>
            <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site. They can't be used to run programs or deliver viruses to your computer.</p>

            <h2>How We Use Cookies</h2>
            <p>At MyGoProfile, we believe in using technology transparently and only in ways that benefit you. We use cookies for one primary purpose: <strong>to understand how you use our service so we can make it better.</strong></p>
            <p>We do not use cookies for advertising, tracking you across other websites, or any purpose other than improving our own platform.</p>
            
            <h2>The Benefits of Accepting Cookies</h2>
            <p>When you accept cookies, you are helping us improve MyGoProfile for everyone. The anonymous data we collect helps us understand:</p>
            <ul>
                <li><strong>Which features are most popular:</strong> This helps us know what to build more of and where to focus our efforts.</li>
                <li><strong>How users navigate the site:</strong> We can identify confusing pages or workflows and make them simpler and more intuitive.</li>
                <li><strong>Performance issues:</strong> We can see how quickly pages load and identify areas that need to be optimized for a faster experience.</li>
            </ul>
            <p>By providing your consent, you are directly contributing to the development and enhancement of our services. It's a simple, anonymous way to help us build a better tool for your business.</p>

            <h2>The Cookies We Use</h2>
            <p>If you grant consent, we use the following third-party services, which place analytics cookies on your device:</p>
            <ul>
                <li><strong>Metricool:</strong> Helps us analyze traffic and user behavior on our site to measure the effectiveness of our content and features.</li>
                <li><strong>Google Analytics:</strong> Provides us with aggregated, anonymous data about how users interact with our website.</li>
            </ul>

            <h2>Your Choices and How to Manage Cookies</h2>
            <p>You are in full control of your data. When you first visit our site, we ask for your consent via a cookie banner. We will not place any analytics cookies on your device unless you click "Accept".</p>
            <p>If you change your mind at any time, you can click the "Manage Cookies" link in the footer of our website to update your preferences.</p>
            
            <h2>Contact Us</h2>
            <p>If you have any questions about our use of cookies, please do not hesitate to contact us at <a href="mailto:hello@mygoprofile.com">hello@mygoprofile.com</a>.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
