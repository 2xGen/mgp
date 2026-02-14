

"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { createTeamInvite, updateTeamInvite } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Terminal, Copy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from '../ui/input';
import type { UserGoogleAccess, Location, TeamInvite } from '@/app/dashboard/manage-team/page';

interface InviteUserFormProps {
    trigger: React.ReactNode;
    currentUserId: string;
    onInviteCreated: () => void;
    assignableLocations: Location[];
    userGoogleAccess: UserGoogleAccess;
    mode: 'create' | 'edit';
    existingInvite?: TeamInvite;
}

export default function InviteUserForm({
    trigger,
    currentUserId,
    onInviteCreated,
    assignableLocations,
    userGoogleAccess,
    mode,
    existingInvite,
}: InviteUserFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'assign' | 'code'>('assign');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (isOpen) {
        if (mode === 'edit' && existingInvite) {
            setSelectedLocations(existingInvite.locations);
        }
    } else {
        // Reset on close
        setSelectedLocations([]);
        setError(null);
        setIsSubmitting(false);
        setStep('assign');
        setGeneratedCode(null);
    }
  }, [isOpen, mode, existingInvite]);

  const handleSelectLocation = (locationName: string, isSelected: boolean) => {
    setSelectedLocations(prev => {
        if (isSelected) {
            return [...prev, locationName];
        } else {
            return prev.filter(name => name !== locationName);
        }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    if (mode === 'create') {
        const inviteName = userGoogleAccess.name;
        const result = await createTeamInvite(currentUserId, inviteName, selectedLocations);

        if (result.error || !result.inviteCode) {
            setError(result.error || "Failed to generate an invite code.");
            setIsSubmitting(false);
        } else {
            setGeneratedCode(result.inviteCode);
            setStep('code');
            onInviteCreated();
            setIsSubmitting(false);
        }
    } else if (mode === 'edit' && existingInvite) {
        const result = await updateTeamInvite(existingInvite.id, selectedLocations);
         if (result.error) {
            setError(result.error);
        } else {
            toast({ title: "Success", description: "Team member's locations updated." });
            onInviteCreated(); // This refreshes the list
            setIsOpen(false);
        }
        setIsSubmitting(false);
    }
  };
  
  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast({ title: "Copied!", description: "Invite code copied to clipboard." });
    }
  };

  const renderAssignStep = () => (
     <>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? `Create Invite for ${userGoogleAccess.name}`: `Manage ${userGoogleAccess.name}`}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
                ? "Assign MyGoProfile access to specific locations for this user. They will get a one-time code to join your team."
                : "Update the locations this team member can manage in MyGoProfile."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
             <div>
                <Label>Assign Locations</Label>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2 border rounded-md p-2 mt-1">
                    {assignableLocations.length > 0 ? (
                        assignableLocations.map(loc => (
                            <div key={loc.name} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={loc.name}
                                    checked={selectedLocations.includes(loc.name)}
                                    onCheckedChange={(checked) => handleSelectLocation(loc.name, !!checked)}
                                />
                                <Label htmlFor={loc.name} className="font-normal">{loc.title}</Label>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            <p>No assignable locations.</p>
                            <p className="text-xs">Ensure locations are added in 'Manage Locations' and this user has Google access to them.</p>
                        </div>
                    )}
                </div>
                 <p className="text-xs text-muted-foreground mt-2">
                    Only your managed locations that the user also has Google access to are shown here.
                </p>
            </div>
        </div>
        
         {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
            </Alert>
        )}

        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {mode === 'create' ? 'Generate Invite Code' : 'Save Changes'}
            </Button>
        </DialogFooter>
     </>
  );
  
  const renderCodeStep = () => (
     <>
        <DialogHeader>
            <DialogTitle>Invite Code Generated!</DialogTitle>
            <DialogDescription>
                Share this one-time code with {userGoogleAccess.name}. They can use it to join your team on the welcome screen.
            </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
            <Input readOnly value={generatedCode || ''} className="font-mono text-lg h-12"/>
            <Button type="button" size="icon" onClick={copyToClipboard}><Copy className="h-4 w-4" /></Button>
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
        {step === 'assign' ? renderAssignStep() : renderCodeStep()}
      </DialogContent>
    </Dialog>
  );
}
