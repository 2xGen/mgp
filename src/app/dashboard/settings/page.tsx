'use client';

import React, { Suspense, useEffect, useState } from "react";
import { useAuth } from '@/app/auth-provider';
import { Button } from '@/components/ui/button';
import { Loader2, Users, MapPin, ChevronRight, Shield, LogOut, Check, Link2, CreditCard, Sparkles, Unplug } from 'lucide-react';
import Link from 'next/link';
import { format, isAfter, differenceInDays, differenceInHours } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { leaveTeam, createBillingPortalSession, createCheckoutSession, syncSubscriptionFromStripe } from '@/app/actions';
import {
  disconnectGoogleBusinessProfile,
  getGoogleConnectionStatus,
} from '@/app/actions/google-connection';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';

import {
  PLAN_LABELS,
  PLAN_PRICE_MONTHLY_EUR,
  PLAN_PRICE_ANNUAL_EUR,
  PLAN_PRICE_ANNUAL_TOTAL_EUR,
  planFeatureList,
  type PlanId,
  type BillingInterval,
} from '@/lib/plans';

const PLAN_FEATURES: Record<string, string[]> = {
  starter: planFeatureList('starter'),
  growth: planFeatureList('growth'),
  enterprise: planFeatureList('enterprise'),
};

function SettingsLink({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border bg-background px-4 py-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="font-semibold leading-tight">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-3xl items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading settings…
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}

function SettingsPageContent() {
  const { user, subscription, isSubscriptionLoading, role, refreshSubscription } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAdmin =
    Boolean(process.env.NEXT_PUBLIC_ADMIN_EMAIL) &&
    user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const { toast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('annual');
  const [isSyncingBilling, setIsSyncingBilling] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<{
    connected: boolean;
    email?: string | null;
    connectedAt?: string | null;
  } | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    if (!user || role === "teamMember") return;
    void getGoogleConnectionStatus().then((res) => {
      if (!res.error) {
        setGoogleStatus({
          connected: res.connected,
          email: res.email,
          connectedAt: res.connectedAt,
        });
      }
    });
  }, [user, role]);

  // After Stripe Checkout: sync from Stripe (verified), never from the URL alone.
  useEffect(() => {
    if (!user || role === "teamMember") return;
    if (searchParams.get("billing") !== "success") return;

    let cancelled = false;
    const sessionId = searchParams.get("session_id");

    (async () => {
      setIsSyncingBilling(true);
      const result = await syncSubscriptionFromStripe(user.id, sessionId);
      if (cancelled) return;

      if (result.success) {
        await refreshSubscription();
        toast({
          title: "Payment confirmed",
          description: "Your plan has been updated from Stripe.",
        });
      } else {
        toast({
          title: "Could not confirm payment yet",
          description: result.error || "Refresh in a moment if the charge went through.",
          variant: "destructive",
        });
      }

      setIsSyncingBilling(false);
      router.replace("/dashboard/settings");
    })();

    return () => {
      cancelled = true;
    };
    // Intentionally run once when landing with billing=success
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, role, searchParams]);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'there';

  const handleDisconnectGoogle = async () => {
    setIsDisconnecting(true);
    const result = await disconnectGoogleBusinessProfile();
    if (result.error) {
      toast({
        title: "Could not disconnect",
        description: result.error,
        variant: "destructive",
      });
      setIsDisconnecting(false);
      return;
    }
    toast({
      title: "Google disconnected",
      description: "MyGoProfile no longer has access to your Business Profile. You can reconnect anytime.",
    });
    setGoogleStatus({ connected: false, email: null, connectedAt: null });
    setIsDisconnecting(false);
  };

  const handleLeaveTeam = async () => {
    if (!user) return;
    setIsLeaving(true);

    const result = await leaveTeam(user.id);
    if (result.error) {
      toast({ title: 'Could not leave team', description: result.error, variant: 'destructive' });
      setIsLeaving(false);
    } else {
      toast({ title: 'You left the team' });
      window.location.href = '/welcome';
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    setIsRedirecting(true);

    const result = await createBillingPortalSession(user.id);
    if (result.error || !result.url) {
      toast({
        title: 'Billing portal unavailable',
        description: result.error || 'Stripe is not set up yet for this account.',
        variant: 'destructive',
      });
      setIsRedirecting(false);
    } else {
      window.location.href = result.url;
    }
  };

  const handleSubscribe = async (planId: 'starter' | 'growth' | 'enterprise') => {
    if (!user) return;
    setIsSubscribing(planId);

    const result = await createCheckoutSession(user.id, planId, billingInterval);
    if (result.error || !result.url) {
      toast({
        title: 'Checkout unavailable',
        description: result.error || 'Stripe test billing is not configured yet.',
        variant: 'destructive',
      });
      setIsSubscribing(null);
    } else {
      window.location.href = result.url;
    }
  };

  const renderPlanSection = () => {
    const trialEndDate = subscription?.trial_end ? new Date(subscription.trial_end) : null;
    const isTrialExpired = trialEndDate ? isAfter(new Date(), trialEndDate) : false;
    const activeStatuses = ['active', 'trialing'];

    if (
      !subscription ||
      !activeStatuses.includes(subscription.status || '') ||
      (subscription.status === 'trialing' && isTrialExpired)
    ) {
      return (
        <div className="rounded-2xl border border-dashed bg-muted/20 p-6">
          <h2 className="font-headline text-xl font-semibold">Choose a plan to continue</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Unlock performance insights, review replies, and location management.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 rounded-full border bg-background p-1">
            <button
              type="button"
              onClick={() => setBillingInterval('monthly')}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                billingInterval === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingInterval('annual')}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                billingInterval === 'annual'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Annual · 2 months free
            </button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {(['starter', 'growth', 'enterprise'] as const).map((planId) => (
              <Button
                key={planId}
                variant={planId === 'growth' ? 'default' : 'outline'}
                className="h-auto flex-col items-start gap-1 px-4 py-3"
                onClick={() => handleSubscribe(planId)}
                disabled={!!isSubscribing}
              >
                <span className="flex items-center gap-2 font-semibold">
                  {isSubscribing === planId && <Loader2 className="h-4 w-4 animate-spin" />}
                  {PLAN_LABELS[planId]}
                </span>
                <span className="text-xs font-normal opacity-80">
                  {billingInterval === 'annual'
                    ? `€${PLAN_PRICE_ANNUAL_EUR[planId]}/mo · €${PLAN_PRICE_ANNUAL_TOTAL_EUR[planId]}/yr`
                    : `€${PLAN_PRICE_MONTHLY_EUR[planId]}/mo`}
                </span>
              </Button>
            ))}
          </div>
        </div>
      );
    }

    const planName = PLAN_LABELS[subscription.planId] || subscription.planId;
    const features = PLAN_FEATURES[subscription.planId] || [];
    const paymentReady = Boolean(subscription.hasStripeSubscription);

    let daysLeftInTrial = 0;
    let trialProgress = 0;
    if (trialEndDate && subscription.status === 'trialing' && !isTrialExpired) {
      const trialStartDate = new Date(trialEndDate);
      trialStartDate.setDate(trialEndDate.getDate() - 14);
      const totalDuration = differenceInHours(trialEndDate, trialStartDate) || 1;
      const elapsedDuration = differenceInHours(new Date(), trialStartDate);
      trialProgress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
      daysLeftInTrial = Math.max(0, differenceInDays(trialEndDate, new Date()));
    }

    const renewalDate = subscription.current_period_end
      ? new Date(subscription.current_period_end)
      : null;

    return (
      <div className="overflow-hidden rounded-2xl border bg-background">
        <div
          className={cn(
            'border-b px-6 py-5',
            subscription.status === 'trialing'
              ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent'
              : 'bg-muted/30'
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-headline text-2xl font-semibold tracking-tight">
                  {planName}
                </h2>
                {subscription.status === 'trialing' ? (
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    {paymentReady ? 'Trial · card on file' : 'Free trial'}
                  </Badge>
                ) : subscription.cancel_at_period_end ? (
                  <Badge variant="destructive">Cancels soon</Badge>
                ) : (
                  <Badge>Active</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {subscription.status === 'trialing'
                  ? paymentReady
                    ? 'Payment confirmed. Your card will be charged when the trial ends.'
                    : 'Explore MyGoProfile with full access — no card charged yet.'
                  : 'Your workspace plan and billing details.'}
              </p>
            </div>

            {subscription.status === 'trialing' && !paymentReady ? (
              <Button
                size="lg"
                onClick={() => handleSubscribe(subscription.planId)}
                disabled={!!isSubscribing}
              >
                {isSubscribing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                Continue with {planName}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isRedirecting}
              >
                {isRedirecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Manage billing
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6 px-6 py-5">
          {subscription.status === 'trialing' && trialEndDate && !isTrialExpired && (
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">
                    {daysLeftInTrial === 0
                      ? 'Trial ends today'
                      : daysLeftInTrial === 1
                        ? '1 day left in your trial'
                        : `${daysLeftInTrial} days left in your trial`}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {paymentReady
                      ? `First charge after ${format(trialEndDate, 'MMMM d, yyyy')}`
                      : `Ends ${format(trialEndDate, 'MMMM d, yyyy')}`}
                  </p>
                </div>
              </div>
              <Progress value={trialProgress} className="mt-3 h-2" />
            </div>
          )}

          {subscription.status === 'active' && renewalDate && (
            <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm">
              <p className="font-medium">
                {subscription.cancel_at_period_end ? 'Access until' : 'Renews on'}{' '}
                {format(renewalDate, 'MMMM d, yyyy')}
              </p>
              <p className="mt-0.5 text-muted-foreground">
                {subscription.cancel_at_period_end
                  ? 'Your plan will not renew after this date.'
                  : 'You can update payment details anytime in billing.'}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium">Included with {planName}</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  if (role === 'teamMember') {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            You&apos;re on a team workspace. The owner manages billing and locations.
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">Team access</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Leaving the team removes your access to shared locations. You can start your own
                free trial afterward.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="mt-4" disabled={isLeaving}>
                    {isLeaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    Leave team
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Leave this team?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You&apos;ll lose access to shared locations immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Stay</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLeaveTeam}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Leave team
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Hi {displayName} — manage your plan, locations, and team from here.
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your plan
          </h2>
          {isSubscriptionLoading || isSyncingBilling ? (
            <div className="flex items-center gap-2 rounded-2xl border px-6 py-10 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isSyncingBilling ? "Confirming payment with Stripe…" : "Loading your plan…"}
            </div>
          ) : (
            renderPlanSection()
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Workspace
          </h2>
          <div className="grid gap-3">
            <SettingsLink
              title="Locations"
              description="Choose which Google Business profiles appear in your dashboard."
              href="/dashboard/select-locations"
              icon={MapPin}
            />
            <SettingsLink
              title="Team"
              description="Invite people to help without sharing your Google login."
              href="/dashboard/manage-team"
              icon={Users}
            />

            <div className="rounded-xl border bg-background px-4 py-4">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Link2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-tight">Google Business Profile</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {googleStatus === null
                      ? "Checking connection…"
                      : googleStatus.connected
                        ? `Connected${googleStatus.email ? ` as ${googleStatus.email}` : ""}. You stay in control — disconnect anytime.`
                        : "Not connected. Link your profile to load performance and reviews."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/connect-google">
                        {googleStatus?.connected ? "Reconnect" : "Connect"}
                      </Link>
                    </Button>
                    {googleStatus?.connected && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={isDisconnecting}
                          >
                            {isDisconnecting ? (
                              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Unplug className="mr-2 h-3.5 w-3.5" />
                            )}
                            Disconnect
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Disconnect Google Business Profile?</AlertDialogTitle>
                            <AlertDialogDescription>
                              MyGoProfile will stop accessing your Business Profile data immediately.
                              Teammates lose live Google data until you reconnect. You can reconnect
                              whenever you want.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep connected</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => void handleDisconnectGoogle()}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Disconnect now
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isAdmin && (
              <SettingsLink
                title="Admin"
                description="Users, subscriptions, and internal overview."
                href="/matthijs-data"
                icon={Shield}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
