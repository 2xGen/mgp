

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, UserCheck, Trash2, UserPlus, Zap, Eye, Info, Settings } from "lucide-react";
import { 
    fetchLocations, 
    fetchAccounts, 
    fetchAdminsForAccount, 
    fetchAdminsForLocation,
    getTeamInvites,
    getManagedLocations,
    removeTeamInvite
} from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/app/auth-provider";
import InviteUserForm from "@/components/dashboard/invite-user-form";
import { useToast } from "@/hooks/use-toast";
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
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";


export interface TeamInvite {
    id: string;
    name: string;
    inviteCode: string;
    locations: string[];
    status: 'pending' | 'claimed';
    claimedBy: string | null;
    createdAt: string;
}

export interface Location {
    name: string;
    title: string;
}

export interface UserGoogleAccess {
    email: string;
    name: string;
    role: string;
    isPending: boolean;
    accessibleLocations: Location[];
}

const PLAN_LIMITS = {
    starter: { locations: 1, teamMembers: 1 },
    growth: { locations: 3, teamMembers: 3 },
    enterprise: { locations: 10, teamMembers: 5 },
};


export default function ManageTeamPage() {
  const { user, subscription } = useAuth();
  const { toast } = useToast();
  const [teamInvites, setTeamInvites] = useState<TeamInvite[]>([]);
  const [managedLocations, setManagedLocations] = useState<Location[]>([]);
  const [allGoogleUsers, setAllGoogleUsers] = useState<UserGoogleAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teamMemberLimit = useMemo(() => {
    if (!subscription?.planId) return 0;
    return PLAN_LIMITS[subscription.planId]?.teamMembers || 0;
  }, [subscription]);

  const hasReachedLimit = useMemo(() => {
    // We count pending and claimed invites against the limit.
    const activeInvites = teamInvites.filter(inv => inv.status === 'pending' || inv.status === 'claimed').length;
    return teamMemberLimit > 0 && activeInvites >= teamMemberLimit;
  }, [teamInvites, teamMemberLimit]);

  const getInitialData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
        const [accountsResult, invitesResult, managedLocsResult] = await Promise.all([
            fetchAccounts(),
            getTeamInvites(user.uid),
            getManagedLocations(user.uid)
        ]);

        if (accountsResult.error) throw new Error(accountsResult.error);
        if (invitesResult.error) throw new Error(invitesResult.error);
        if (managedLocsResult.error) throw new Error(managedLocsResult.error);
        
        setTeamInvites(invitesResult.data || []);
        
        const fetchedAccounts = accountsResult.accounts || [];
        if (fetchedAccounts.length === 0) {
            setIsLoading(false);
            return;
        }

        // --- DATA FETCHING & PROCESSING ---
        const usersMap = new Map<string, UserGoogleAccess>();
        const allApiLocationsMap = new Map<string, Location>();

        // First pass: Get all account-level admins and all locations
        for (const account of fetchedAccounts) {
            const [adminsRes, locationsRes] = await Promise.all([
                fetchAdminsForAccount(account.name),
                fetchLocations(account.name)
            ]);

            const locationsForThisAccount = locationsRes.locations || [];

            locationsForThisAccount.forEach((loc: Location) => {
                if (!allApiLocationsMap.has(loc.name)) {
                    allApiLocationsMap.set(loc.name, { name: loc.name, title: loc.title });
                }
            });
            
            if (adminsRes.data?.admins) {
                adminsRes.data.admins.forEach((admin: any) => {
                    const adminIdentifier = admin.admin;
                    let adminEmail = admin.admin;
                    if (admin.admin.includes('/')) {
                        adminEmail = admin.admin.split('/')[1];
                    }

                    const adminName = admin.displayName || adminEmail;
                    
                    if (!usersMap.has(adminIdentifier) && adminEmail !== user.email) {
                         usersMap.set(adminIdentifier, {
                            email: adminEmail,
                            name: adminName,
                            role: admin.role,
                            isPending: admin.pendingInvitation || false,
                            accessibleLocations: [],
                        });
                    }
                     // A user can be admin of multiple accounts, update role if a higher one is found
                    const existingUser = usersMap.get(adminIdentifier);
                    if(existingUser && (admin.role === 'PRIMARY_OWNER' || admin.role === 'OWNER')) {
                        existingUser.role = admin.role;
                    }
                });
            }
        }
        
        const allApiLocations = Array.from(allApiLocationsMap.values());

        // Second pass: Get location-level admins and correctly associate all locations
        for(const location of allApiLocations) {
            const locationAdminsRes = await fetchAdminsForLocation(location.name);
            if (locationAdminsRes.data?.admins) {
                 locationAdminsRes.data.admins.forEach((admin: any) => {
                    const adminIdentifier = admin.admin;
                    const userToUpdate = usersMap.get(adminIdentifier);
                    if (userToUpdate) {
                         if (!userToUpdate.accessibleLocations.some(l => l.name === location.name)) {
                            userToUpdate.accessibleLocations.push(location);
                        }
                    }
                });
            }
        }
        
        // Third pass: Assign account-wide locations to owners/managers
         for (const account of fetchedAccounts) {
            const locationsForThisAccount = await fetchLocations(account.name).then(res => res.locations || []);
            const accountAdminsRes = await fetchAdminsForAccount(account.name);
            if(accountAdminsRes.data?.admins) {
                accountAdminsRes.data.admins.forEach((admin: any) => {
                    const adminIdentifier = admin.admin;
                    const userToUpdate = usersMap.get(adminIdentifier);
                    if(userToUpdate && (userToUpdate.role.includes('OWNER') || userToUpdate.role.includes('MANAGER'))) {
                         locationsForThisAccount.forEach((loc: Location) => {
                            if (!userToUpdate.accessibleLocations.some(l => l.name === loc.name)) {
                                userToUpdate.accessibleLocations.push(loc);
                            }
                        })
                    }
                });
            }
        }
        
        setAllGoogleUsers(Array.from(usersMap.values()));

        if (managedLocsResult.locations) {
            const updatedManaged = managedLocsResult.locations
              .map(ml => allApiLocationsMap.get(ml.locationName))
              .filter((l): l is Location => l !== undefined);
            setManagedLocations(updatedManaged);
        }


    } catch (e: any) {
        setError(e.message || "An error occurred while fetching your data.");
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  const handleInvitesChange = () => {
      if(user) {
        getTeamInvites(user.uid).then(res => {
            if (res.data) setTeamInvites(res.data);
        });
      }
  }

  const handleRemoveInvite = async (inviteId: string) => {
    const result = await removeTeamInvite(inviteId);
    if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
        toast({ title: "Success", description: "Team invite removed." });
        handleInvitesChange();
    }
  }

  const existingInvitesMap = useMemo(() => {
    const map = new Map<string, TeamInvite>();
    teamInvites.forEach(inv => map.set(inv.name, inv)); // Assuming name is unique
    return map;
  }, [teamInvites]);
  
  const renderMyTeamCard = () => {
     return (
        <Card>
             <CardHeader>
                <div className="flex items-center gap-2">
                    <UserCheck className="h-6 w-6" />
                    <CardTitle className="text-2xl">MyGoProfile Team Invites</CardTitle>
                </div>
                <CardDescription>
                    Invites you have created for users. You have used {teamInvites.length} of {teamMemberLimit} available team member seats.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>How Invites Work</AlertTitle>
                        <AlertDescription>
                            <ol className="list-decimal list-inside space-y-1">
                                <li><strong>Generate Code:</strong> Create an invite for a user from the "All Google Users" list below.</li>
                                <li><strong>Share Code:</strong> Give the one-time invite code to your team member.</li>
                                <li><strong>Team Member Signs In:</strong> They must sign in to MyGoProfile with the same Google account and enter the code on the welcome screen to join your team.</li>
                            </ol>
                        </AlertDescription>
                    </Alert>
                    {teamInvites.length === 0 ? (
                        <div className="px-6 pb-6">
                            <p className="text-sm text-muted-foreground p-6 text-center border rounded-md">You haven't created any team invites yet. Create them from the "All Google Users" list below.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Team/User Name</TableHead>
                                    <TableHead>Invite Code</TableHead>
                                    <TableHead>Assigned Locations</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamInvites.map(invite => {
                                    const gUser = allGoogleUsers.find(u => u.name === invite.name);
                                    
                                    return (
                                        <TableRow key={invite.id}>
                                            <TableCell className="font-medium">{invite.name}</TableCell>
                                            <TableCell><Badge variant="outline">{invite.inviteCode}</Badge></TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {invite.locations.length > 0 ? invite.locations.map(locName => {
                                                        const locTitle = managedLocations.find(l => l.name === locName)?.title || locName.split('/').pop();
                                                        return <Badge key={locName} variant="secondary">{locTitle}</Badge>
                                                    }) : <Badge variant="outline">No locations assigned</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {invite.status === 'claimed' ? (
                                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">Claimed</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Pending</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-1">
                                                 {invite.status === 'claimed' && gUser && (
                                                    <InviteUserForm
                                                        mode="edit"
                                                        existingInvite={invite}
                                                        trigger={
                                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                                                        }
                                                        onInviteCreated={handleInvitesChange}
                                                        currentUserId={user?.uid || ''}
                                                        assignableLocations={managedLocations.filter(ml => gUser.accessibleLocations.some(al => al.name === ml.name))}
                                                        userGoogleAccess={gUser}
                                                    />
                                                )}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Remove invite for {invite.name}?</AlertDialogTitle></AlertDialogHeader>
                                                        <AlertDialogDescription>This will delete the invite code and it will no longer be usable. This does not affect their Google access.</AlertDialogDescription>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleRemoveInvite(invite.id)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
             </CardContent>
        </Card>
     )
  }

  const renderGoogleUsersCard = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>All Google Business Profile Users</CardTitle>
                <CardDescription>
                    A list of all users who have any access to your connected Google Business accounts and locations. You can create an invite code for them from here.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {hasReachedLimit && (
                    <div className="px-6 pb-4">
                        <Alert>
                            <Zap className="h-4 w-4" />
                            <AlertTitle>You've Reached Your Team Member Limit</AlertTitle>
                            <AlertDescription>
                            Your current plan includes {teamMemberLimit} team member{teamMemberLimit > 1 ? 's' : ''}. To invite more, please{" "}
                            <Link href="/dashboard/settings" className="font-semibold text-primary hover:underline">
                                upgrade your plan
                            </Link>.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Google Role</TableHead>
                            <TableHead>Accessible Locations</TableHead>
                            <TableHead>App Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allGoogleUsers.length > 0 ? allGoogleUsers.map((gUser) => {
                            const existingInvite = existingInvitesMap.get(gUser.name);
                            
                            let statusBadge;
                            if (gUser.isPending) {
                                statusBadge = <Badge variant="outline">Pending on Google</Badge>;
                            } else if (existingInvite?.status === 'claimed') {
                                statusBadge = <Badge className="bg-blue-100 text-blue-800 border-blue-200">Claimed</Badge>;
                            } else if (existingInvite) {
                                statusBadge = <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Invite Pending</Badge>;
                            } else {
                                statusBadge = <Badge variant="secondary">Google User</Badge>;
                            }

                            return (
                                <TableRow key={gUser.name}>
                                    <TableCell className="font-medium">{gUser.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{gUser.role}</Badge></TableCell>
                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" disabled={gUser.accessibleLocations.length === 0}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View ({gUser.accessibleLocations.length})
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium leading-none">Accessible Locations</h4>
                                                    <p className="text-sm text-muted-foreground">This user has Google access to the following locations.</p>
                                                </div>
                                                <ScrollArea className="h-40 mt-4">
                                                    <div className="space-y-1">
                                                        {gUser.accessibleLocations.map(loc => (
                                                            <div key={loc.name} className="text-sm p-2 rounded-md bg-muted">{loc.title}</div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell>
                                        {statusBadge}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {gUser.isPending ? null : existingInvite?.status === 'claimed' ? (
                                            <InviteUserForm
                                                mode="edit"
                                                existingInvite={existingInvite}
                                                trigger={
                                                    <Button variant="outline" size="sm"><Settings className="mr-2 h-4 w-4" /> Manage</Button>
                                                }
                                                onInviteCreated={handleInvitesChange}
                                                currentUserId={user?.uid || ''}
                                                assignableLocations={managedLocations.filter(ml => gUser.accessibleLocations.some(al => al.name === ml.name))}
                                                userGoogleAccess={gUser}
                                            />
                                        ) : existingInvite ? (
                                            <span className="text-xs text-muted-foreground italic">Invite sent</span>
                                        ) : (
                                            <InviteUserForm 
                                                mode="create"
                                                trigger={
                                                    <Button variant="outline" size="sm" disabled={hasReachedLimit}><UserPlus className="mr-2 h-4 w-4" /> Create Invite</Button>
                                                }
                                                onInviteCreated={handleInvitesChange}
                                                currentUserId={user?.uid || ''}
                                                assignableLocations={managedLocations.filter(ml => gUser.accessibleLocations.some(al => al.name === ml.name))}
                                                userGoogleAccess={gUser}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground p-8">
                                    No other Google users found with access to your locations.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
  };
  
  if (isLoading) {
     return (
        <div className="py-8 max-w-5xl mx-auto px-4">
             <div className="flex items-center gap-2 text-muted-foreground p-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading team data...</span>
            </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="py-8 max-w-5xl mx-auto px-4">
            <Alert variant="destructive" className="mt-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>API Error</AlertTitle>
                <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {renderMyTeamCard()}
        {renderGoogleUsersCard()}
    </div>
  );
}

  
