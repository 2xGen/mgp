

'use client';

import { useAuth } from '@/app/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Briefcase, Users, MapPin, ChevronRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { differenceInDays, differenceInHours } from 'date-fns';

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
  const { user, subscription, isSubscriptionLoading } = useAuth();
  const isAdmin = user?.uid === process.env.ADMIN_UID;

  const renderSubscriptionStatus = () => {
    if (!subscription) {
      return (
        <Card className="shadow-none border-dashed">
            <CardHeader>
                <CardTitle>No Active Plan</CardTitle>
                <CardDescription>You are not currently subscribed to any plan.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    Choose a plan to unlock AI-powered insights, review replies, and more.
                </p>
                <Link href="/pricing">
                    <Button>View Pricing Plans</Button>
                </Link>
            </CardContent>
        </Card>
      );
    }
    
    let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
    switch (subscription.status) {
        case 'active':
            badgeVariant = 'default';
            break;
        case 'trialing':
            badgeVariant = 'secondary';
            break;
        case 'past_due':
        case 'incomplete':
            badgeVariant = 'destructive';
            break;
        default:
            badgeVariant = 'outline';
    }

    const trialEndDate = subscription.trial_end ? new Date(subscription.trial_end) : null;
    let trialProgress = 0;
    let daysLeft = 0;

    if (trialEndDate && subscription.status === 'trialing') {
        const trialStartDate = new Date(trialEndDate);
        trialStartDate.setDate(trialEndDate.getDate() - 14);

        const totalDuration = differenceInHours(trialEndDate, trialStartDate);
        const elapsedDuration = differenceInHours(new Date(), trialStartDate);
        trialProgress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
        daysLeft = differenceInDays(trialEndDate, new Date());
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <CardTitle className="capitalize flex items-center gap-2">
                           Your Plan: {subscription.planId}
                           <Badge variant={badgeVariant} className="capitalize">{subscription.status}</Badge>
                        </CardTitle>
                        <CardDescription>Details about your current subscription.</CardDescription>
                    </div>
                    <Button variant="outline">Manage Subscription</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {subscription.status === 'trialing' && trialEndDate && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <h4 className="font-semibold">Free Trial Period</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            Your trial ends on {format(trialEndDate, 'MMMM d, yyyy')}. 
                            You have <span className="font-bold">{daysLeft > 0 ? `${daysLeft} days` : 'less than a day'}</span> left.
                        </p>
                        <Progress value={trialProgress} className="mt-2" />
                    </div>
                )}
                 <div>
                    <h4 className="font-semibold text-sm">Plan Features</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                       {subscription.planId === 'starter' ? (
                           <>
                            <li>1 Location</li>
                            <li>1 Team Member</li>
                            <li>AI-Powered Review Replies</li>
                           </>
                       ): (
                           <>
                            <li>3 Locations</li>
                            <li>3 Team Members</li>
                            <li>Multi-Location Leaderboard</li>
                            <li>Advanced Performance Analytics</li>
                           </>
                       )}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )

  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your plan, billing, and team settings.</p>
        </div>

        <div className="space-y-8">
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
        </div>

    </div>
  );
}

    
