
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, Users, MapPin, ChevronRight, Shield, LogOut, Star } from 'lucide-react';
import Link from 'next/link';
import { format, isAfter } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { differenceInDays, differenceInHours } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { leaveTeam, createBillingPortalSession, createCheckoutSession } from '@/app/actions';
import { useRouter } from 'next/navigation';

const ManagementCard = ({ title, description, href, icon: Icon }: { title: string, description: string, href: string, icon: React.ElementType }) => (
    <Link href={href} className="block hover:bg-muted/50 rounded-lg transition-colors">
        <Card className="shadow-none bg-transparent border-0 h-full">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
        </Card>
    </Link>
)

export default function SettingsPage() {
  const { user, subscription, isSubscriptionLoading, role } = useAuth();
  const isAdmin = user?.uid === process.env.ADMIN_UID;
  const { toast } = useToast();
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

  const handleLeaveTeam = async () => {
    if (!user) return;
    setIsLeaving(true);

    const result = await leaveTeam(user.uid);
    if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        setIsLeaving(false);
    } else {
        toast({ title: "Success", description: "You have left the team." });
        // Full page reload to reset all auth state
        window.location.href = '/welcome'; 
    }
  }
  
  const handleManageSubscription = async () => {
    if (!user) return;
    setIsRedirecting(true);

    const result = await createBillingPortalSession(user.uid);
    if (result.error || !result.url) {
        toast({ title: "Error", description: result.error || "Could not create billing session.", variant: "destructive" });
        setIsRedirecting(false);
    } else {
        window.location.href = result.url;
    }
  }

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


  const renderSubscriptionStatus = () => {
    const trialEndDate = subscription?.trial_end ? new Date(subscription.trial_end) : null;
    const isTrialExpired = trialEndDate && isAfter(new Date(), trialEndDate);
    const activeStatuses = ['active', 'trialing'];
    
    // If the subscription is not active or trialing (and trial is not expired), show options to (re)subscribe.
    if (!subscription || !activeStatuses.includes(subscription.status) || (subscription.status === 'trialing' && isTrialExpired)) {
      return (
        <Card className="shadow-none border-dashed">
            <CardHeader>
                <CardTitle>No Active Plan</CardTitle>
                <CardDescription>Choose a plan to unlock AI-powered insights, review replies, and more.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                <Button onClick={() => handleSubscribe('starter')} disabled={!!isSubscribing}>
                    {isSubscribing === 'starter' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Subscribe to Starter ($29/mo)
                </Button>
                 <Button onClick={() => handleSubscribe('growth')} disabled={!!isSubscribing}>
                    {isSubscribing === 'growth' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Subscribe to Growth ($49/mo)
                </Button>
                 <Button onClick={() => handleSubscribe('enterprise')} disabled={!!isSubscribing}>
                    {isSubscribing === 'enterprise' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Subscribe to Enterprise ($99/mo)
                </Button>
            </CardContent>
        </Card>
      );
    }
    
    // Otherwise, show the status of the active/trialing subscription.
    let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
    if (subscription.cancel_at_period_end) {
        badgeVariant = 'destructive';
    } else {
        switch (subscription.status) {
            case 'active':
                badgeVariant = 'default';
                break;
            case 'trialing':
                badgeVariant = 'secondary';
                break;
            case 'past_due':
            case 'incomplete':
            case 'unpaid':
                badgeVariant = 'destructive';
                break;
            default:
                badgeVariant = 'outline';
        }
    }


    let trialProgress = 0;
    let daysLeftInTrial = 0;

    if (trialEndDate && subscription.status === 'trialing' && !isTrialExpired) {
        const trialStartDate = new Date(trialEndDate);
        trialStartDate.setDate(trialEndDate.getDate() - 14);

        const totalDuration = differenceInHours(trialEndDate, trialStartDate);
        const elapsedDuration = differenceInHours(new Date(), trialStartDate);
        trialProgress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
        daysLeftInTrial = differenceInDays(trialEndDate, new Date());
    }
    
    const renewalDate = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
    let daysUntilEvent = 0;
    if (renewalDate && subscription.status === 'active') {
        daysUntilEvent = differenceInDays(renewalDate, new Date());
    }

    const planFeatures = {
        starter: [
            "1 Location",
            "1 Team Member",
            "AI-Powered Review Replies",
        ],
        growth: [
            "3 Locations",
            "3 Team Members",
            "Multi-Location Leaderboard",
            "Advanced Performance Analytics",
        ],
        enterprise: [
            "Up to 10 Locations",
            "Up to 5 Team Members",
            "All Growth Features",
            "Early Access to New Features"
        ]
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="space-y-1">
                        <CardTitle className="capitalize flex items-center gap-2">
                           Your Plan: {subscription.planId}
                           <Badge variant={badgeVariant} className="capitalize">{subscription.cancel_at_period_end ? 'Cancels at period end' : subscription.status}</Badge>
                        </CardTitle>
                        <CardDescription>Details about your current subscription.</CardDescription>
                    </div>
                     {subscription.status === 'active' ? (
                        <Button onClick={handleManageSubscription} disabled={isRedirecting}>
                            {isRedirecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Manage Subscription
                        </Button>
                     ) : subscription.status === 'trialing' ? (
                        <Button onClick={() => handleSubscribe(subscription.planId)} disabled={!!isSubscribing}>
                            {isSubscribing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Subscribe Now
                        </Button>
                     ) : null}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {subscription.status === 'trialing' && trialEndDate && !isTrialExpired && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <h4 className="font-semibold">Free Trial Period</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            Your trial ends on {format(trialEndDate, 'MMMM d, yyyy')}. 
                            You have <span className="font-bold">{daysLeftInTrial > 0 ? `${daysLeftInTrial} days` : 'less than a day'}</span> left.
                        </p>
                        <Progress value={trialProgress} className="mt-2" />
                    </div>
                )}
                {subscription.status === 'active' && renewalDate && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <h4 className="font-semibold">Current Billing Cycle</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            Your plan {subscription.cancel_at_period_end ? 'will be cancelled' : 'renews'} on {format(renewalDate, 'MMMM d, yyyy')}. 
                            That's in <span className="font-bold">{daysUntilEvent > 0 ? `${daysUntilEvent} days` : 'less than a day'}</span>.
                        </p>
                    </div>
                )}
                 <div>
                    <h4 className="font-semibold text-sm">Plan Features</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                       {(planFeatures[subscription.planId] || []).map(feature => <li key={feature}>{feature}</li>)}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )

  };

  const renderTeamMemberView = () => (
     <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Team Membership</CardTitle>
            <CardDescription>You are currently a member of a team. Your access is managed by the team owner.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                If you leave the team, you will lose access to all shared locations and will need to start your own subscription to use MyGoProfile.
            </p>
        </CardContent>
        <CardFooter>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isLeaving}>
                        {isLeaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <LogOut className="mr-2 h-4 w-4" />
                        Leave Team
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. You will immediately lose access to all team data and will be redirected to the welcome page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLeaveTeam} className="bg-destructive hover:bg-destructive/90">
                            Yes, Leave Team
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardFooter>
    </Card>
  )

  return (
    <div className="py-8 max-w-4xl mx-auto">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your plan, billing, and team settings.</p>
        </div>

        <div className="space-y-8">
            {role === 'owner' && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Plan & Billing</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isSubscriptionLoading ? (
                                <div className="flex items-center gap-2 text-muted-foreground p-6">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Loading subscription details...</span>
                                </div>
                            ) : renderSubscriptionStatus()}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Account Management</CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y">
                            <ManagementCard 
                                title="Manage Team"
                                description="Invite and manage access for your team members."
                                href="/dashboard/manage-team"
                                icon={Users}
                            />
                            <ManagementCard 
                                title="Manage Locations"
                                description="Select which Google Business locations to manage."
                                href="/dashboard/select-locations"
                                icon={MapPin}
                            />
                            {isAdmin && (
                                <ManagementCard 
                                    title="Admin Dashboard"
                                    description="View users, subscriptions, and revenue."
                                    href="/matthijs-data"
                                    icon={Shield}
                                />
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {role === 'teamMember' && renderTeamMemberView()}

        </div>

    </div>
  );
}
