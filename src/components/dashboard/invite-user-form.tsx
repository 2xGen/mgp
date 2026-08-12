"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { createTeamInvite, updateTeamInvite } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Terminal, Copy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import type { Location, TeamInvite } from "@/app/dashboard/manage-team/page";

interface InviteUserFormProps {
  trigger: React.ReactNode;
  currentUserId: string;
  onInviteCreated: () => void;
  assignableLocations: Location[];
  mode: "create" | "edit";
  existingInvite?: TeamInvite;
  /** Optional prefilled display name (create mode). */
  defaultName?: string;
}

export default function InviteUserForm({
  trigger,
  currentUserId,
  onInviteCreated,
  assignableLocations,
  mode,
  existingInvite,
  defaultName = "",
}: InviteUserFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"assign" | "code">("assign");
  const [inviteName, setInviteName] = useState(defaultName);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && existingInvite) {
        setInviteName(existingInvite.name);
        setSelectedLocations(existingInvite.locations);
      } else {
        setInviteName(defaultName);
      }
    } else {
      setInviteName(defaultName);
      setSelectedLocations([]);
      setError(null);
      setIsSubmitting(false);
      setStep("assign");
      setGeneratedCode(null);
    }
  }, [isOpen, mode, existingInvite, defaultName]);

  const handleSelectLocation = (locationName: string, isSelected: boolean) => {
    setSelectedLocations((prev) => {
      if (isSelected) return [...prev, locationName];
      return prev.filter((name) => name !== locationName);
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    if (mode === "create") {
      const name = inviteName.trim();
      if (!name) {
        setError("Add a name so you recognize this invite later.");
        setIsSubmitting(false);
        return;
      }
      if (selectedLocations.length === 0) {
        setError("Pick at least one location for this teammate.");
        setIsSubmitting(false);
        return;
      }

      const result = await createTeamInvite(currentUserId, name, selectedLocations);

      if (result.error || !result.inviteCode) {
        setError(result.error || "Failed to generate an invite code.");
        setIsSubmitting(false);
      } else {
        setGeneratedCode(result.inviteCode);
        setStep("code");
        onInviteCreated();
        setIsSubmitting(false);
      }
    } else if (mode === "edit" && existingInvite) {
      const result = await updateTeamInvite(existingInvite.id, selectedLocations);
      if (result.error) {
        setError(result.error);
      } else {
        toast({ title: "Updated", description: "Location access saved." });
        onInviteCreated();
        setIsOpen(false);
      }
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast({ title: "Copied", description: "Invite code copied to clipboard." });
    }
  };

  const renderAssignStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "Invite a teammate" : `Manage ${existingInvite?.name}`}
        </DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "They sign in to MyGoProfile and enter your code. They don’t need Google Business access — your connected profile powers the data."
            : "Update which locations this teammate can see in MyGoProfile."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {mode === "create" && (
          <div className="space-y-2">
            <Label htmlFor="invite-name">Teammate name</Label>
            <Input
              id="invite-name"
              placeholder="e.g. Sarah – front desk"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
            />
          </div>
        )}

        <div>
          <Label>Locations they can manage</Label>
          <div className="mt-1 max-h-48 space-y-3 overflow-y-auto rounded-md border p-3">
            {assignableLocations.length > 0 ? (
              assignableLocations.map((loc) => (
                <div key={loc.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={loc.name}
                    checked={selectedLocations.includes(loc.name)}
                    onCheckedChange={(checked) =>
                      handleSelectLocation(loc.name, !!checked)
                    }
                  />
                  <Label htmlFor={loc.name} className="font-normal">
                    {loc.title}
                  </Label>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Add locations in Settings first, then invite teammates.
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Couldn’t save</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create invite code" : "Save changes"}
        </Button>
      </DialogFooter>
    </>
  );

  const renderCodeStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Share this code</DialogTitle>
        <DialogDescription>
          Send it to {inviteName.trim() || "your teammate"}. They sign in to MyGoProfile,
          open the welcome screen, and enter the code under “Have a team invite code?”
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center space-x-2">
        <Input
          readOnly
          value={generatedCode || ""}
          className="h-12 font-mono text-lg tracking-wider"
        />
        <Button type="button" size="icon" onClick={copyToClipboard}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <DialogFooter>
        <Button onClick={() => setIsOpen(false)}>Done</Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {step === "assign" ? renderAssignStep() : renderCodeStep()}
      </DialogContent>
    </Dialog>
  );
}
