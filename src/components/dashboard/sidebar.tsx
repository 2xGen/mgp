
"use client";

import { useDashboard } from "@/app/dashboard/dashboard-provider";
import LoadAllButton from "./load-all-button";
import { Separator } from "../ui/separator";
import AccountList from "./account-list";
import { Button } from "../ui/button";
import Link from "next/link";
import { Settings, MapPin } from "lucide-react";
import { useAuth } from "@/app/auth-provider";

export default function Sidebar() {
    const { accountId, allLocationsData, managedLocationCount } = useDashboard();
    const { role } = useAuth();
    
    // The button should appear if the user is managing more than one location.
    const canLoadAll = managedLocationCount > 1;

    return (
        <aside className="h-screen w-72 border-r bg-background flex-col sticky top-0 p-2 hidden sm:flex">
           <div className="flex-1 flex flex-col gap-2">
             <AccountList />
             {accountId && !allLocationsData && canLoadAll && (
                <div className="px-2">
                    <LoadAllButton />
                </div>
             )}
            </div>
           <div className="space-y-2 pt-4">
            <Separator />
            <div className="grid grid-cols-2 gap-2">
                {role === 'owner' && (
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/dashboard/select-locations">
                            <MapPin className="mr-2 h-4 w-4" />
                            Locations
                        </Link>
                    </Button>
                )}
                {/* The settings button should be visible to everyone who is logged in. */}
                <Button 
                    variant="outline" 
                    className={role === 'owner' ? "w-full" : "w-full col-span-2"} 
                    asChild
                >
                    <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </Button>
            </div>
           </div>
        </aside>
    );
}
