
"use client";

import { useAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import { DashboardProvider, useDashboard } from "./dashboard-provider";
import { Logo } from "@/components/icons";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft, AlertTriangle, PartyPopper, Loader2 } from "lucide-react";
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
import {
  PLAN_LABELS,
  PLAN_BLURBS,
  PLAN_PRICE_MONTHLY_EUR,
  PLAN_PRICE_ANNUAL_EUR,
  PLAN_PRICE_ANNUAL_TOTAL_EUR,
  planScaleLine,
  type PlanId,
  type BillingInterval,
} from "@/lib/plans";
import { cn } from "@/lib/utils";

function SessionExpirationHandler() {
    const [mode, setMode] = useState<"expired" | "connect" | null>(null);
    const { user } = useAuth();
    const router = useRouter();
    const { detailsError, setDetailsError } = useDashboard();

    useEffect(() => {
        if (detailsError === "GOOGLE_NOT_CONNECTED") {
            setMode("connect");
        } else if (detailsError === "SESSION_EXPIRED") {
            setMode("expired");
        }
    }, [detailsError]);

    const handleConnect = () => {
        setMode(null);
        setDetailsError(null);
        router.push("/connect-google");
    };

    const displayName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      "";

    return (
        <AlertDialog open={mode !== null} onOpenChange={(open) => !open && setMode(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                     <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                        <AlertTriangle className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                    </div>
                    <AlertDialogTitle className="text-center">
                      {mode === "connect"
                        ? "Connect your Google Business Profile"
                        : `Welcome ${displayName}`}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        {mode === "connect"
                          ? "You're signed in. Next, connect your Google Business Profile so we can load your locations and performance data."
                          : "Your Google Business Profile connection expired. Reconnect to continue managing your profile."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction onClick={handleConnect} className="w-full">
                    {mode === "connect" ? "Connect Google Business Profile" : "Reconnect Google"}
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const PLANS: PlanId[] = ["starter", "growth", "enterprise"];

function TrialExpirationHandler() {
    const { user, subscription } = useAuth();
    const pathname = usePathname();
    const [isExpired, setIsExpired] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
    const [billingInterval, setBillingInterval] = useState<BillingInterval>("annual");
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

    const handleSubscribe = async (planId: PlanId) => {
        if (!user) return;
        setIsSubscribing(planId);

        const result = await createCheckoutSession(user.id, planId, billingInterval);
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
                        Thanks for giving MyGoProfile a try! Choose a plan to keep using AI tools and analytics.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-1 rounded-full border bg-background p-1">
                    <button
                      type="button"
                      onClick={() => setBillingInterval("monthly")}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        billingInterval === "monthly"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingInterval("annual")}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        billingInterval === "annual"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Annual · 2 months free
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-3">
                    {PLANS.map((planId) => {
                      const popular = planId === "growth";
                      const price =
                        billingInterval === "annual"
                          ? PLAN_PRICE_ANNUAL_EUR[planId]
                          : PLAN_PRICE_MONTHLY_EUR[planId];
                      return (
                        <Card key={planId} className={cn(popular && "border-primary shadow-lg")}>
                          <CardHeader>
                            <CardTitle className="font-headline text-2xl">{PLAN_LABELS[planId]}</CardTitle>
                            <CardDescription>{PLAN_BLURBS[planId]}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">€{price}</span>
                                <span className="text-muted-foreground">/ month</span>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {billingInterval === "annual"
                                  ? `€${PLAN_PRICE_ANNUAL_TOTAL_EUR[planId]}/year · billed yearly`
                                  : `or €${PLAN_PRICE_ANNUAL_TOTAL_EUR[planId]}/year`}
                              </p>
                              <p className="mt-2 text-sm font-medium">{planScaleLine(planId)}</p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              className="w-full"
                              size="lg"
                              variant={popular ? "default" : "outline"}
                              onClick={() => handleSubscribe(planId)}
                              disabled={!!isSubscribing}
                            >
                              {isSubscribing === planId ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              Subscribe
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
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
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const handleLogout = async () => {
    await signOut();
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
                                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                                <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-col hidden sm:flex">
                                <span className="font-semibold">{displayName}</span>
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
        <SessionExpirationHandler />
        <TrialExpirationHandler />
    </DashboardProvider>
  )
}
