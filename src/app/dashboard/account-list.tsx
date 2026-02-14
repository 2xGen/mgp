

"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAccounts, fetchLocations, getManagedLocations, getTeamInvites } from "@/app/actions";
import { Loader2, Terminal, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useDashboard } from "@/app/dashboard/dashboard-provider";
import { useAuth } from "@/app/auth-provider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { ManagedLocation } from "@/app/dashboard/select-locations/page";


interface Location extends ManagedLocation {
  title: string;
  account: { name: string };
}

export default function AccountList() {
  const { user, role, teamOwnerId } = useAuth();
  const [managedLocationsDetails, setManagedLocationsDetails] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noGoogleAccounts, setNoGoogleAccounts] = useState(false);
  const { setAccountId, setSelectedLocationName, selectedLocationName, setDetailsError, accountId } = useDashboard();
  const router = useRouter();

  const colors = [
    'border-blue-300',
    'border-red-300',
    'border-yellow-300',
    'border-green-300',
    'border-purple-300',
    'border-pink-300',
  ];

  const getLocations = useCallback(async () => {
    if (!user || !role) return; // Wait until user and role are loaded
    setIsLoading(true);
    setError(null);
    setDetailsError(null);
    setNoGoogleAccounts(false);
    
    try {
      let ownerId = role === 'teamMember' && teamOwnerId ? teamOwnerId : user.uid;

      const accountsResult = await fetchAccounts();
      if (accountsResult.error) {
        setError(accountsResult.error);
        if (accountsResult.error === 'SESSION_EXPIRED') {
            setDetailsError('SESSION_EXPIRED');
        }
        setIsLoading(false);
        return;
      }

      if (!accountsResult.accounts || accountsResult.accounts.length === 0) {
        setNoGoogleAccounts(true);
        setManagedLocationsDetails([]);
        setIsLoading(false);
        return;
      }

      const managedResult = await getManagedLocations(ownerId);
      if (managedResult.error) {
          setError(managedResult.error);
          setIsLoading(false);
          return;
      }
      
      const managedLocationsMap = new Map<string, ManagedLocation>();
      (managedResult.locations || []).forEach(l => managedLocationsMap.set(l.locationName, l));
      
      if (managedLocationsMap.size === 0 && role === 'owner') {
        setManagedLocationsDetails([]);
        setIsLoading(false);
        return;
      }
      
      if (accountsResult.accounts && accountsResult.accounts.length > 0) {
        const locationPromises = accountsResult.accounts.map(async (account: { name: string }) => {
          const locs = await fetchLocations(account.name);
          return (locs.locations || []).map((l: any) => ({ ...l, account }));
        });
        const locationsByAccount = await Promise.all(locationPromises);
        const allApiLocations = locationsByAccount.flat();
        
        let relevantLocations: Location[] = [];

        if (role === 'teamMember') {
            const teamInvitesResult = await getTeamInvites(ownerId);
            if (teamInvitesResult.error) {
              setError(teamInvitesResult.error);
              return;
            }
            
            // Find the claimed invite for the current user
            const currentUserInvite = teamInvitesResult.data?.find(inv => inv.status === 'claimed' && inv.claimedBy === user.uid);
            const assignedLocationNames = currentUserInvite?.locations || [];

             relevantLocations = allApiLocations
                .filter(apiLoc => assignedLocationNames.includes(apiLoc.name))
                .map(apiLoc => {
                    // For team members, we find the corresponding emoji/date info from the owner's managed locations
                    const dbData = managedLocationsMap.get(apiLoc.name) || { locationName: apiLoc.name, dateAdded: new Date().toISOString() };
                    return { ...apiLoc, ...dbData };
                });
        } else { // 'owner'
             relevantLocations = allApiLocations
                .filter(apiLoc => managedLocationsMap.has(apiLoc.name))
                .map(apiLoc => {
                    const dbData = managedLocationsMap.get(apiLoc.name)!;
                    return { ...apiLoc, ...dbData };
                });
        }
        setManagedLocationsDetails(relevantLocations);
        
        // If no account is selected yet, select the first one.
        if (relevantLocations.length > 0 && !accountId) {
            setAccountId(relevantLocations[0].account.name);
        }

      } else {
          setManagedLocationsDetails([]);
      }
    } catch (e: any) {
      const errorMessage = e.message || "Failed to fetch data.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user, role, teamOwnerId, setAccountId, setDetailsError, accountId]);

  useEffect(() => {
    getLocations();
  }, [getLocations]);


  const handleRowClick = (location: Location) => {
    setAccountId(location.account.name);
    setSelectedLocationName(location.locationName);
    router.push('/dashboard');
  }

  // If session is expired, the global handler in layout.tsx will take over.
  // Don't render anything here to avoid showing confusing UI.
  if (error === 'SESSION_EXPIRED') {
      return null;
  }

  return (
    <div className="p-2">
      <h3 className="font-semibold text-lg mb-2 px-2">Your Locations</h3>
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground px-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Fetching locations...</span>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>API Error</AlertTitle>
          <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
        </Alert>
      )}
      {!isLoading && !error && (
        <div className="border rounded-lg bg-background">
          {managedLocationsDetails.length > 0 ? (
            <Table>
              <TableBody>
                {managedLocationsDetails.map((location, index) => (
                  <TableRow
                    key={location.locationName}
                    onClick={() => handleRowClick(location)}
                    className={cn(
                        "cursor-pointer border-l-4",
                        colors[index % colors.length]
                    )}
                    data-state={selectedLocationName === location.locationName ? 'selected' : ''}
                  >
                    <TableCell className="flex justify-between items-center">
                      <div className="font-medium">{location.title}</div>
                      {location.emoji && <span className="text-lg">{location.emoji}</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-4 text-sm text-center text-muted-foreground">
              {noGoogleAccounts ? (
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Business Account Found</AlertTitle>
                    <AlertDescription>
                        This Google account is not linked to a Google Business Profile. Please create one on Google or ask an existing owner for access.
                    </AlertDescription>
                </Alert>
              ) : role === 'owner' ? (
                'No locations selected. Go to Settings > Manage Locations to add some.'
              ) : (
                'You have not been assigned any locations.'
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
