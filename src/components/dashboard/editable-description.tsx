"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Edit, Loader2, Terminal } from "lucide-react";
import { updateLocation } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface EditableDescriptionProps {
    locationName: string;
    description: string | undefined;
    onUpdateSuccess: (newDescription: string) => void;
}

export default function EditableDescription({ locationName, description, onUpdateSuccess }: EditableDescriptionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(description || "");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        const updateData = {
            profile: {
                description: editedDescription,
            },
        };

        const result = await updateLocation(locationName, updateData, ['profile.description']);

        if (result.error) {
            setError(result.error);
        } else {
            onUpdateSuccess(editedDescription);
            setIsEditing(false);
            toast({
                title: "Success",
                description: "Business description updated successfully.",
            });
        }
        setIsSaving(false);
    };

    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5" />
                    About
                </CardTitle>
                {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="space-y-4">
                        <Textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="min-h-[120px]"
                            placeholder="Enter business description..."
                        />
                        {error && (
                             <Alert variant="destructive">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>API Error</AlertTitle>
                                <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
                            </Alert>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {description || "No description provided."}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
