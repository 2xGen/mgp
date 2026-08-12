
"use client";

import { useAuth } from "@/app/auth-provider";
import { Loader2, Library, LayoutDashboard, Zap } from "lucide-react";
import LocationDashboard from "@/components/dashboard/location-dashboard";
import MultiLocationDashboard from "@/components/dashboard/multi-location-dashboard";
import { useDashboard } from "./dashboard-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { isAfter } from 'date-fns';

export default function DashboardPage() {
  const { user, isLoading, subscription, isSubscriptionLoading } = useAuth();
  const { selectedLocation, allLocationsData, isDetailsLoading, detailsError, accountId } = useDashboard();

  // This is the primary loading state for the page. It waits for both the user and their subscription to be resolved.
  if (isLoading || isSubscriptionLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If after loading, there's no user, redirecting them is handled by the layout/auth provider.
  // We show a loader to make the transition smooth.
  if (!user) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Redirecting...</p>
      </div>
    );
  }

  // Determine if the subscription is inactive
  let isSubscriptionInactive = true;
  if (subscription) {
      if (subscription.status === 'active' && !subscription.cancel_at_period_end) {
          isSubscriptionInactive = false;
      } else if (subscription.status === 'active' && subscription.cancel_at_period_end) {
          // It's active but set to cancel. Is it expired?
          const periodEndDate = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
          if (periodEndDate && !isAfter(new Date(), periodEndDate)) {
              isSubscriptionInactive = false; // Still active until the end date
          }
      } else if (subscription.status === 'trialing') {
          const trialEndDate = subscription.trial_end ? new Date(subscription.trial_end) : null;
          if (trialEndDate && !isAfter(new Date(), trialEndDate)) {
              isSubscriptionInactive = false; // Still in trial
          }
      }
  }


  if (isSubscriptionInactive) {
       return (
        <div className="flex flex-1 items-center justify-center">
            <Card className="max-w-lg w-full text-center">
                <CardHeader>
                     <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 mb-4">
                        <Zap className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle>Subscription Required</CardTitle>
                    <CardDescription>Your plan is inactive or has expired. Please update your subscription to continue using the dashboard.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/dashboard/settings">Manage Subscription</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  const renderContent = () => {
    // Keep showing cached dashboard while a background refresh runs.
    if (isDetailsLoading && !selectedLocation && !allLocationsData) {
      return (
        <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Fetching location data...</span>
            </div>
        </div>
      );
    }

    if (detailsError && detailsError !== 'SESSION_EXPIRED' && detailsError !== 'GOOGLE_NOT_CONNECTED') {
      return (
        <div className="flex flex-1 items-center justify-center">
            <div className="text-center text-destructive">
                <h2 className="text-2xl font-semibold tracking-tight">An Error Occurred</h2>
                <p className="whitespace-pre-wrap">{detailsError}</p>
            </div>
        </div>
      );
    }
    
    if (allLocationsData) {
        return <MultiLocationDashboard data={allLocationsData} />;
    }
    
    if (selectedLocation) {
        return <LocationDashboard />;
    }

    if (accountId) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <Card className="max-w-lg w-full text-center">
            <CardHeader>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 mb-4">
                    <Library className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Select a location</CardTitle>
                <CardDescription>
                    Pick a location in the sidebar to open its dashboard.
                </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }
    
    return (
        <div className="flex flex-1 items-center justify-center">
            <Card className="max-w-lg w-full text-center">
                <CardHeader>
                     <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 mb-4">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Welcome to Your Dashboard</CardTitle>
                    <CardDescription>Please select a business account from the sidebar to get started.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  return (
      <div className="flex-1 py-8">
        {renderContent()}
      </div>
  );
}
