"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2, UserPlus, Trash2, Settings, Zap, Copy, ShieldCheck } from "lucide-react";
import {
  getTeamInvites,
  getManagedLocations,
  removeTeamInvite,
  fetchAccounts,
  fetchLocations,
} from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface TeamInvite {
  id: string;
  name: string;
  inviteCode: string;
  locations: string[];
  status: "pending" | "claimed";
  claimedBy: string | null;
  createdAt: string;
}

export interface Location {
  name: string;
  title: string;
}

/** @deprecated kept for older imports — team invites no longer require Google GBP users */
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teamMemberLimit = useMemo(() => {
    if (!subscription?.planId) return 0;
    return PLAN_LIMITS[subscription.planId]?.teamMembers || 0;
  }, [subscription]);

  const activeInviteCount = useMemo(
    () =>
      teamInvites.filter((inv) => inv.status === "pending" || inv.status === "claimed")
        .length,
    [teamInvites]
  );

  const hasReachedLimit =
    teamMemberLimit > 0 && activeInviteCount >= teamMemberLimit;

  const getInitialData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const [invitesResult, managedLocsResult, accountsResult] = await Promise.all([
        getTeamInvites(user.id),
        getManagedLocations(user.id),
        fetchAccounts(),
      ]);

      if (invitesResult.error) throw new Error(invitesResult.error);
      if (managedLocsResult.error) throw new Error(managedLocsResult.error);
      if (accountsResult.error) throw new Error(accountsResult.error);

      setTeamInvites(invitesResult.data || []);

      const titleByName = new Map<string, string>();
      for (const account of accountsResult.accounts || []) {
        const locs = await fetchLocations(account.name);
        for (const loc of locs.locations || []) {
          titleByName.set(loc.name, loc.title);
        }
      }

      const managed = (managedLocsResult.locations || [])
        .map((ml) => ({
          name: ml.locationName,
          title: titleByName.get(ml.locationName) || ml.locationName.split("/").pop() || ml.locationName,
        }))
        .filter((l) => l.name);

      setManagedLocations(managed);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not load team data.";
      setError(message);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void getInitialData();
  }, [getInitialData]);

  const handleInvitesChange = () => {
    if (!user) return;
    getTeamInvites(user.id).then((res) => {
      if (res.data) setTeamInvites(res.data);
    });
  };

  const handleRemoveInvite = async (inviteId: string) => {
    const result = await removeTeamInvite(inviteId);
    if (result.error) {
      toast({ title: "Could not remove invite", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Invite removed" });
      handleInvitesChange();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied", description: "Invite code copied." });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading team…
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">Team</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Give people access to MyGoProfile without sharing your Google login. They stay
          signed in with their own account; your connected Business Profile powers the data.
        </p>
      </div>

      <div className="rounded-2xl border bg-primary/[0.04] px-5 py-4">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">How it works</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Create an invite and pick which locations they can see.</li>
              <li>Share the one-time code.</li>
              <li>
                They sign in to MyGoProfile (any Google account), enter the code on welcome,
                and start working — no Google Business admin rights needed.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Using <span className="font-semibold text-foreground">{activeInviteCount}</span> of{" "}
          <span className="font-semibold text-foreground">{teamMemberLimit}</span> team seats
          on your plan.
        </p>

        {hasReachedLimit ? (
          <Button asChild variant="outline">
            <Link href="/dashboard/settings">Upgrade for more seats</Link>
          </Button>
        ) : (
          <InviteUserForm
            mode="create"
            currentUserId={user?.id || ""}
            assignableLocations={managedLocations}
            onInviteCreated={handleInvitesChange}
            trigger={
              <Button disabled={managedLocations.length === 0}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite teammate
              </Button>
            }
          />
        )}
      </div>

      {hasReachedLimit && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertTitle>Team seat limit reached</AlertTitle>
          <AlertDescription>
            Your plan includes {teamMemberLimit} teammate
            {teamMemberLimit === 1 ? "" : "s"}.{" "}
            <Link href="/dashboard/settings" className="font-semibold text-primary hover:underline">
              Upgrade
            </Link>{" "}
            to invite more.
          </AlertDescription>
        </Alert>
      )}

      {managedLocations.length === 0 && (
        <Alert>
          <AlertTitle>Add a location first</AlertTitle>
          <AlertDescription>
            Choose which Google Business locations to manage, then invite teammates.{" "}
            <Link
              href="/dashboard/select-locations"
              className="font-semibold text-primary hover:underline"
            >
              Manage locations
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="overflow-hidden rounded-2xl border">
        {teamInvites.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            No teammates yet. Create an invite to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamInvites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell className="font-medium">{invite.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="font-mono">
                        {invite.inviteCode}
                      </Badge>
                      {invite.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyCode(invite.inviteCode)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {invite.locations.length > 0 ? (
                        invite.locations.map((locName) => {
                          const title =
                            managedLocations.find((l) => l.name === locName)?.title ||
                            locName.split("/").pop();
                          return (
                            <Badge key={locName} variant="secondary">
                              {title}
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {invite.status === "claimed" ? (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Joined</Badge>
                    ) : (
                      <Badge variant="secondary">Waiting</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {invite.status === "claimed" && (
                        <InviteUserForm
                          mode="edit"
                          existingInvite={invite}
                          currentUserId={user?.id || ""}
                          assignableLocations={managedLocations}
                          onInviteCreated={handleInvitesChange}
                          trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Settings className="h-4 w-4" />
                            </Button>
                          }
                        />
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove {invite.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This deletes the invite
                              {invite.status === "claimed"
                                ? " and removes their MyGoProfile team access"
                                : ""}
                              . It does not change anything in Google.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveInvite(invite.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
