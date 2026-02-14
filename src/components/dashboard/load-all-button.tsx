
"use client";

import { useState } from "react";
import { useDashboard } from "@/app/dashboard/dashboard-provider";
import { fetchAccounts, fetchLocations } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Library, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoadAllButton() {
    const { accountId, loadAllLocationsData, allLocationsData, isDetailsLoading } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleLoadAll = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch all accounts
            const accountsResult = await fetchAccounts();
            if (accountsResult.error || !accountsResult.accounts) {
                throw new Error(accountsResult.error || "Could not fetch accounts.");
            }

            // 2. For each account, fetch its locations
            const locationPromises = accountsResult.accounts.map((acc: { name: string }) => fetchLocations(acc.name));
            const locationsResults = await Promise.all(locationPromises);
            
            // 3. Flatten the list of locations and filter out errors
            const allLocations: { name: string, title: string }[] = [];
            const allAccountIds: string[] = [];
            locationsResults.forEach((res, index) => {
                if (!res.error && res.locations) {
                    allLocations.push(...res.locations);
                    // We'll need the accountId for each location to fetch other data points
                    // so we add it here.
                    const currentAccountId = accountsResult.accounts[index].name;
                    res.locations.forEach(() => allAccountIds.push(currentAccountId));
                }
            });

            if (allLocations.length === 0) {
                 toast({
                    title: "No Locations Found",
                    description: "No locations were found across all of your business accounts.",
                    variant: "default",
                });
                return;
            }
            
            // 4. Pass the combined list to the dashboard provider
            // We assume the provider can handle fetching details for a list of locations from different accounts
            // We pass both location and accountId for each.
            const locationAccountPairs = allLocations.map((loc, i) => ({...loc, accountId: allAccountIds[i]}));

            // The loadAllLocationsData expects accountId to be a single string, 
            // but our logic now supports multiple. Let's pass the primary one.
            loadAllLocationsData(locationAccountPairs, accountId!);

        } catch (error: any) {
             toast({
                title: "Error Loading All Locations",
                description: error.message || "An unknown error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-2 mt-2">
            <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLoadAll} 
                disabled={isLoading || isDetailsLoading}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Library className="mr-2 h-4 w-4" />
                )}
                Load All Locations
            </Button>
        </div>
    );
}
