
"use client";

import { useAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import { DashboardProvider, useDashboard } from "./dashboard-provider";
import { Logo } from "@/components/icons";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft, AlertTriangle, PartyPopper, Check, Loader2, Star } from "lucide-react";
import AccountList from "@/components/dashboard/account-list";
import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { isAfter } from "date-fns";
import Link from "next/link";
import { createCheckoutSession } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

function SessionExpirationHandler({ onForceLogout }: { onForceLogout: () => void }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { user } = useAuth();
    const { detailsError } = useDashboard(); // Access error from dashboard context

    useEffect(() => {
        if (detailsError === 'SESSION_EXPIRED') {
            setIsDialogOpen(true);
        }
    }, [detailsError]);

    const handleLogin = () => {
        setIsDialogOpen(false);
        onForceLogout();
    };

    return (
        <AlertDialog open={isDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                     <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                        <AlertTriangle className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                    </div>
                    <AlertDialogTitle className="text-center">Welcome {user?.displayName || ''}</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Your session has expired. Please log in again to continue managing your profile.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction onClick={handleLogin} className="w-full">
                    Log In Again
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const starterFeatures = [
    "1 Location",
    "1 Team Member",
    "AI-Powered Review Replies",
];

const growthFeatures = [
    "3 Locations",
    "3 Team Members",
    "Multi-Location Leaderboard",
];

const enterpriseFeatures = [
    "Up to 10 Locations",
    "Up to 5 Team Members",
    "All Growth Features",
    "Early Access to New Features"
];


function TrialExpirationHandler() {
    const { user, subscription } = useAuth();
    const pathname = usePathname();
    const [isExpired, setIsExpired] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        // Don't show the dialog if the user is already on the page where they can subscribe.
        if (pathname === '/dashboard/settings') {
            setIsExpired(false);
            return;
        }
        
        if (subscription?.status === 'trialing' && subscription.trial_end) {
            if (isAfter(new Date(), new Date(subscription.trial_end))) {
                setIsExpired(true);
            }
        } else {
            setIsExpired(false);
        }
    }, [subscription, pathname]);

    const handleSubscribe = async (planId: 'starter' | 'growth' | 'enterprise') => {
        if (!user) return;
        setIsSubscribing(planId);

        const result = await createCheckoutSession(user.uid, planId);
        if (result.error || !result.url) {
            toast({ title: "Error", description: result.error || "Could not create checkout session.", variant: "destructive" });
            setIsSubscribing(null);
        } else {
            window.location.href = result.url;
        }
    }

    if (!isExpired) {
        return null;
    }

    return (
        <Dialog open={isExpired} onOpenChange={setIsExpired}>
            <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                     <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <PartyPopper className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <DialogTitle className="text-center">Your Free Trial Has Ended</DialogTitle>
                    <DialogDescription className="text-center max-w-lg mx-auto">
                        Thanks for giving MyGoProfile a try! To continue using our powerful AI tools and analytics, please choose a plan below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Starter</CardTitle>
                            <CardDescription>For single-location businesses.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">$29</span>
                                <span className="text-muted-foreground">/ month</span>
                            </div>
                            <ul className="space-y-3">
                                {starterFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-brand-green" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={() => handleSubscribe('starter')} disabled={!!isSubscribing}>
                                {isSubscribing === 'starter' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Subscribe
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-primary shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Growth</CardTitle>
                            <CardDescription>For agencies & multi-location businesses.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">$49</span>
                                <span className="text-muted-foreground">/ month</span>
                            </div>
                            <ul className="space-y-3">
                                {growthFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-brand-green" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                           <Button className="w-full" size="lg" onClick={() => handleSubscribe('growth')} disabled={!!isSubscribing}>
                                {isSubscribing === 'growth' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Subscribe
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Enterprise</CardTitle>
                            <CardDescription>For businesses ready to scale.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">$99</span>
                                <span className="text-muted-foreground">/ month</span>
                            </div>
                            <ul className="space-y-3">
                                {enterpriseFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                        <span className="font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                           <Button className="w-full" size="lg" onClick={() => handleSubscribe('enterprise')} disabled={!!isSubscribing}>
                                {isSubscribing === 'enterprise' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Subscribe
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                 <DialogFooter className="sm:justify-center">
                    <Button type="button" variant="ghost" onClick={() => setIsExpired(false)}>
                      Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };
  
  return (
    <DashboardProvider>
        <div className="min-h-screen w-full bg-muted/40">
           <div className="flex">
                 <Sidebar />
                 <div className="flex flex-1 flex-col">
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size="icon" variant="outline" className="sm:hidden">
                                    <PanelLeft className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="sm:max-w-xs">
                                <nav className="grid gap-6 text-lg font-medium">
                                    <div className="p-2">
                                        <AccountList />
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <div className="flex items-center gap-2 font-semibold">
                        <Logo />
                        <span className="hidden sm:inline-block">MyGoProfile</span>
                        </div>
                        <div className="flex items-center gap-4 ml-auto">
                        {!isLoading && user && (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || ""} />}
                                <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-col hidden sm:flex">
                                <span className="font-semibold">{user.displayName}</span>
                                </div>
                            </div>
                        )}
                        <Button onClick={handleLogout} variant="outline" size="sm">
                            Sign Out
                        </Button>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4 sm:px-6">
                        <DashboardNav />
                        {children}
                    </main>
                </div>
            </div>
        </div>
        <SessionExpirationHandler onForceLogout={handleLogout} />
        <TrialExpirationHandler />
    </DashboardProvider>
  )
}
