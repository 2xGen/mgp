

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchAccounts, fetchLocations, saveSelectedLocations, getManagedLocations } from "@/app/actions";
import { useAuth } from "@/app/auth-provider";
import { Loader2, Terminal, CheckCircle, Lock, Info, Smile, XCircle, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { differenceInDays, formatDistanceToNowStrict } from 'date-fns';
import Link from "next/link";

export interface ManagedLocation {
  locationName: string;
  dateAdded: any; // Can be Timestamp from Firestore or ISO string
  emoji?: string | null;
  accountId?: string | null;
  title?: string | null;
}

interface ApiLocation {
  name: string;
  title: string;
}

interface AccountWithLocations {
  name: string;
  accountName: string;
  locations: ApiLocation[];
}

const PLAN_LIMITS = {
    starter: { locations: 1, teamMembers: 1 },
    growth: { locations: 3, teamMembers: 3 },
    enterprise: { locations: 10, teamMembers: 5 },
};

const COOLDOWN_DAYS_PAID = 30;
const COOLDOWN_DAYS_TRIAL = 7;
const EMOJIS = ['⭐', '❤️', '🚀', '✅', '📍', '🏢', '🏠', '🏭', '🌍', '📌', '💼', '💡'];

export default function SelectLocationsPage() {
  const { user, isLoading: isAuthLoading, subscription } = useAuth();
  const [allApiLocations, setAllApiLocations] = useState<AccountWithLocations[]>([]);
  const [managedLocations, setManagedLocations] = useState<Map<string, ManagedLocation>>(new Map());
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const locationLimit = useMemo(() => {
    if (!subscription?.planId) return 0;
    return PLAN_LIMITS[subscription.planId]?.locations || 0;
  }, [subscription]);

  const cooldownDays = useMemo(() => {
    // Softer lock during trial so new users can correct mistakes quickly.
    if (subscription?.status === "trialing") return COOLDOWN_DAYS_TRIAL;
    return COOLDOWN_DAYS_PAID;
  }, [subscription?.status]);

  const hasReachedLimit = useMemo(() => {
    return locationLimit > 0 && managedLocations.size >= locationLimit;
  }, [managedLocations, locationLimit]);


  const getAndSetLocations = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const [accountsResult, managedResult] = await Promise.all([
        fetchAccounts(),
        getManagedLocations(user.id)
      ]);

      if (accountsResult.error) throw new Error(accountsResult.error);
      if (managedResult.error) throw new Error(managedResult.error);

      if (managedResult.locations) {
        const managedMap = new Map<string, ManagedLocation>();
        managedResult.locations.forEach(l => managedMap.set(l.locationName, l));
        setManagedLocations(managedMap);
      }

      if (!accountsResult.accounts) {
        setAllApiLocations([]);
        setIsLoading(false);
        return;
      }
      
      const locationsData = await Promise.all(
        accountsResult.accounts.map(async (account: { name: string, accountName: string }) => {
          const result = await fetchLocations(account.name);
          return {
            name: account.name,
            accountName: account.accountName,
            locations: result.locations || [],
          };
        })
      );
      setAllApiLocations(locationsData);

    } catch (e: any) {
      setError(e.message || "Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getAndSetLocations();
  }, [getAndSetLocations]);
  
  const isLocationLocked = useCallback((locationName: string) => {
    const managedLoc = managedLocations.get(locationName);
    if (!managedLoc?.dateAdded) return false;

    const daysSinceAdded = differenceInDays(new Date(), new Date(managedLoc.dateAdded));
    return daysSinceAdded < cooldownDays;
  }, [managedLocations, cooldownDays]);

  const getLockTooltipContent = useCallback((locationName: string) => {
    const managedLoc = managedLocations.get(locationName);
    if (!managedLoc?.dateAdded) return '';
    
    const dateAdded = new Date(managedLoc.dateAdded);
    const unlockDate = new Date(dateAdded);
    unlockDate.setDate(dateAdded.getDate() + cooldownDays);
    
    const distance = formatDistanceToNowStrict(unlockDate, { addSuffix: true });
    return `This location is locked. You can change it ${distance}.`;
  }, [managedLocations, cooldownDays]);


  const handleSelectLocation = (
    locationName: string,
    accountId: string,
    title: string,
    isSelected: boolean
  ) => {
    if (isLocationLocked(locationName)) return;

    setManagedLocations(prev => {
      const newMap = new Map(prev);
      if (isSelected) {
         if (newMap.size < locationLimit) {
            newMap.set(locationName, {
              locationName,
              dateAdded: null,
              accountId,
              title,
            });
         } else {
             toast({
                title: "Location Limit Reached",
                description: `Your plan allows for ${locationLimit} location${locationLimit > 1 ? 's' : ''}. Please upgrade to add more.`,
                variant: "destructive",
            });
         }
      } else {
        newMap.delete(locationName);
      }
      return newMap;
    });
  };
  
  const handleEmojiSelect = (locationName: string, emoji: string | null) => {
    setManagedLocations(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(locationName);
      if (existing) {
        newMap.set(locationName, { ...existing, emoji });
      }
      return newMap;
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const selectedForSave = Array.from(managedLocations.values());
      const result = await saveSelectedLocations(user.id, selectedForSave);
      
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: "Success!",
        description: "Your location selections have been saved.",
        action: (
          <div className="flex items-center text-green-500">
             <CheckCircle className="h-5 w-5" />
          </div>
        ),
      });
      // Force a full page reload to ensure the sidebar updates.
      window.location.href = '/dashboard';
    } catch (e: any) {
      setError(e.message);
      toast({
        title: "Error Saving",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (isLoading || isAuthLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>API Error</AlertTitle>
          <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
        </Alert>
      );
    }
    
    if (allApiLocations.length === 0) {
        return <p className="text-center text-muted-foreground">No business accounts or locations found.</p>
    }

    return (
      <TooltipProvider>
        <div className="space-y-6">
           {hasReachedLimit && (
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertTitle>You've Reached Your Location Limit</AlertTitle>
                <AlertDescription>
                  Your current plan includes {locationLimit} location{locationLimit > 1 ? 's' : ''}. To manage more, please{" "}
                  <Link href="/dashboard/settings" className="font-semibold text-primary hover:underline">
                    upgrade your plan
                  </Link>.
                </AlertDescription>
              </Alert>
            )}
          {allApiLocations.map((account) => (
            <div key={account.name}>
              <h3 className="text-lg font-semibold mb-2">{account.accountName}</h3>
              <div className="space-y-2 rounded-md border p-4">
                {account.locations.length > 0 ? account.locations.map(location => {
                  const isSelected = managedLocations.has(location.name);
                  const isLocked = isSelected && isLocationLocked(location.name);
                  const isDisabled = !isSelected && hasReachedLimit;
                  const currentEmoji = managedLocations.get(location.name)?.emoji;

                  return (
                    <div key={location.name} className="flex items-center space-x-3">
                      <Checkbox
                        id={location.name}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectLocation(
                            location.name,
                            account.name,
                            location.title,
                            !!checked
                          )
                        }
                        disabled={isLocked || isDisabled}
                      />
                      <Label htmlFor={location.name} className={`font-normal flex-grow cursor-pointer ${isLocked || isDisabled ? 'cursor-not-allowed text-muted-foreground' : ''}`}>
                        {location.title}
                      </Label>
                      
                      {isSelected && (
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0">
                                    {currentEmoji || <Smile className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2">
                                <div className="grid grid-cols-4 gap-2">
                                    {EMOJIS.map(emoji => (
                                        <Button
                                            key={emoji}
                                            variant="ghost"
                                            size="icon"
                                            className="text-xl"
                                            onClick={() => handleEmojiSelect(location.name, emoji)}
                                        >
                                            {emoji}
                                        </Button>
                                    ))}
                                     <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEmojiSelect(location.name, null)}
                                    >
                                        <XCircle className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                      )}

                      {isLocked && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getLockTooltipContent(location.name)}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  )
                }) : <p className="text-sm text-muted-foreground">No locations in this account.</p>}
              </div>
            </div>
          ))}
           <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Location Locking</AlertTitle>
              <AlertDescription>
                Newly added locations are locked for {cooldownDays} days
                {subscription?.status === "trialing" ? " during your trial" : ""} to keep your dashboard stable.
                Need more flexibility? Upgrade your plan.
              </AlertDescription>
            </Alert>
        </div>
      </TooltipProvider>
    );
  };

  return (
    <div className="py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Manage Your Locations</CardTitle>
          <CardDescription>
            You have selected {managedLocations.size} of {locationLimit} available locations. Selections are locked for {cooldownDays} days after saving.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Selections
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
