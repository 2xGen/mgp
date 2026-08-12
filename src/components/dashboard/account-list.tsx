
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { fetchAccounts, fetchLocations, getManagedLocations, getTeamInvites } from "@/app/actions";
import { Loader2, Terminal, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useDashboard } from "@/app/dashboard/dashboard-provider";
import { useAuth } from "@/app/auth-provider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { ManagedLocation } from "@/app/dashboard/select-locations/page";
import {
  getCachedSidebar,
  peekCachedSidebar,
  setCachedSidebar,
  isSidebarCacheFresh,
  withSidebarInflight,
} from "@/lib/dashboard-cache";


interface Location extends ManagedLocation {
  title: string;
  account: { name: string };
}

type SidebarCachePayload = {
  locations: Location[];
};

export default function AccountList() {
  const { user, role, teamOwnerId } = useAuth();
  const {
    setAccountId,
    setSelectedLocationName,
    selectedLocationName,
    setDetailsError,
    accountId,
    setManagedLocationCount,
  } = useDashboard();
  const router = useRouter();

  const accountIdRef = useRef(accountId);
  const selectedLocationNameRef = useRef(selectedLocationName);
  accountIdRef.current = accountId;
  selectedLocationNameRef.current = selectedLocationName;

  const peeked = user ? peekCachedSidebar<SidebarCachePayload>(user.id) : null;
  const [managedLocationsDetails, setManagedLocationsDetails] = useState<Location[]>(
    peeked?.locations ?? []
  );
  const [isLoading, setIsLoading] = useState(!peeked?.locations?.length);
  const [error, setError] = useState<string | null>(null);
  const [noGoogleAccounts, setNoGoogleAccounts] = useState(false);
  const didInit = useRef(false);

  const colors = [
    'border-blue-300',
    'border-red-300',
    'border-yellow-300',
    'border-green-300',
    'border-purple-300',
    'border-pink-300',
  ];

  const applyLocations = useCallback((relevantLocations: Location[]) => {
    setManagedLocationsDetails(relevantLocations);
    setManagedLocationCount(relevantLocations.length);
    if (relevantLocations.length === 0) return;
    const first = relevantLocations[0];
    if (!accountIdRef.current) setAccountId(first.account.name);
    if (!selectedLocationNameRef.current) setSelectedLocationName(first.locationName);
  }, [setAccountId, setSelectedLocationName, setManagedLocationCount]);

  const getLocations = useCallback(async () => {
    if (!user || !role) return;

    return withSidebarInflight(user.id, async () => {
      // Another mount may have filled the cache while we waited on the lock.
      if (isSidebarCacheFresh(user.id)) {
        const hit = getCachedSidebar<SidebarCachePayload>(user.id);
        if (hit?.locations) {
          applyLocations(hit.locations);
          setIsLoading(false);
          return hit;
        }
      }

      setError(null);
      setDetailsError(null);

      try {
        const ownerId = role === 'teamMember' && teamOwnerId ? teamOwnerId : user.id;

        const accountsResult = await fetchAccounts();
        if (accountsResult.error) {
          setError(accountsResult.error);
          if (accountsResult.error === 'SESSION_EXPIRED' || accountsResult.error === 'GOOGLE_NOT_CONNECTED') {
            setDetailsError(accountsResult.error);
          }
          setIsLoading(false);
          return null;
        }

        if (!accountsResult.accounts || accountsResult.accounts.length === 0) {
          setNoGoogleAccounts(true);
          applyLocations([]);
          setIsLoading(false);
          return { locations: [] };
        }

        const managedResult = await getManagedLocations(ownerId);
        if (managedResult.error) {
          setError(managedResult.error);
          setIsLoading(false);
          return null;
        }

        const managedLocationsMap = new Map<string, ManagedLocation>();
        (managedResult.locations || []).forEach((l) => managedLocationsMap.set(l.locationName, l));

        if (managedLocationsMap.size === 0 && role === 'owner') {
          const empty = { locations: [] as Location[] };
          setCachedSidebar(user.id, empty);
          applyLocations([]);
          setIsLoading(false);
          return empty;
        }

        const locationPromises = accountsResult.accounts.map(async (account: { name: string }) => {
          const locs = await fetchLocations(account.name);
          return (locs.locations || []).map((l: any) => ({ ...l, account }));
        });
        const allApiLocations = (await Promise.all(locationPromises)).flat();

        let relevantLocations: Location[] = [];

        if (role === 'teamMember') {
          const teamInvitesResult = await getTeamInvites(ownerId);
          if (teamInvitesResult.error) {
            setError(teamInvitesResult.error);
            setIsLoading(false);
            return null;
          }

          const currentUserInvite = teamInvitesResult.data?.find(
            (inv) => inv.status === 'claimed' && inv.claimedBy === user.id
          );
          const assignedLocationNames = currentUserInvite?.locations || [];

          relevantLocations = allApiLocations
            .filter((apiLoc) => assignedLocationNames.includes(apiLoc.name))
            .map((apiLoc) => {
              const dbData =
                managedLocationsMap.get(apiLoc.name) || {
                  locationName: apiLoc.name,
                  dateAdded: new Date().toISOString(),
                };
              return { ...apiLoc, ...dbData };
            });
        } else {
          relevantLocations = allApiLocations
            .filter((apiLoc) => managedLocationsMap.has(apiLoc.name))
            .map((apiLoc) => {
              const dbData = managedLocationsMap.get(apiLoc.name)!;
              return { ...apiLoc, ...dbData };
            });
        }

        const payload = { locations: relevantLocations };
        setCachedSidebar(user.id, payload);
        applyLocations(relevantLocations);
        setIsLoading(false);
        return payload;
      } catch (e: any) {
        setError(e.message || "Failed to fetch data.");
        setIsLoading(false);
        return null;
      }
    });
  }, [user, role, teamOwnerId, setDetailsError, applyLocations]);

  useEffect(() => {
    if (!user || !role || didInit.current) return;
    didInit.current = true;

    const fresh = getCachedSidebar<SidebarCachePayload>(user.id);
    const any = peekCachedSidebar<SidebarCachePayload>(user.id);

    if (fresh?.locations) {
      applyLocations(fresh.locations);
      setIsLoading(false);
      return; // still fresh — do not hit Google again
    }

    if (any?.locations?.length) {
      applyLocations(any.locations);
      setIsLoading(false);
      // Stale: soft refresh without spinner
      void getLocations();
      return;
    }

    void getLocations();
  }, [user, role, getLocations, applyLocations]);

  const handleRowClick = (location: Location) => {
    setAccountId(location.account.name);
    setSelectedLocationName(location.locationName);
    router.push('/dashboard');
  };

  if (error === 'SESSION_EXPIRED' || error === 'GOOGLE_NOT_CONNECTED') {
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
                        colors[index % colors.length],
                        selectedLocationName === location.locationName && "bg-muted"
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
