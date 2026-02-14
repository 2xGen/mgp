
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, Edit, Loader2, Terminal } from "lucide-react";
import { updateLocation } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { LocationDetailsData } from "@/app/dashboard/dashboard-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EditableOpeningHoursProps {
    locationName: string;
    regularHours: LocationDetailsData['regularHours'] | undefined;
    onUpdateSuccess: (newHours: LocationDetailsData['regularHours']) => void;
}

interface Time {
    hours: number;
    minutes: number;
}

interface DayHours {
    isOpen: boolean;
    openTime: Time;
    closeTime: Time;
}

const WEEKDAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const formatTime = (time: { hours?: number; minutes?: number; } | undefined) => {
    if (!time || typeof time.hours === 'undefined') return 'N/A';
    const hours = time.hours;
    const minutes = time.minutes || 0;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const generateTimeOptions = () => {
    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];
    return { hours, minutes };
};

const timeOptions = generateTimeOptions();

export default function EditableOpeningHours({ locationName, regularHours, onUpdateSuccess }: EditableOpeningHoursProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedHours, setEditedHours] = useState<Record<string, DayHours>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isEditing) {
            const initialHours: Record<string, DayHours> = {};
            WEEKDAYS.forEach(day => {
                const period = regularHours?.periods?.find(p => p.openDay === day);
                const is24h = period?.closeTime?.hours === 24 && Object.keys(period.openTime || {}).length === 0;

                initialHours[day] = {
                    isOpen: !!period,
                    openTime: {
                        hours: is24h ? 0 : period?.openTime?.hours ?? 9,
                        minutes: is24h ? 0 : period?.openTime?.minutes ?? 0,
                    },
                    closeTime: {
                        hours: is24h ? 24 : period?.closeTime?.hours ?? 17,
                        minutes: is24h ? 0 : period?.closeTime?.minutes ?? 0,
                    },
                };
            });
            setEditedHours(initialHours);
        }
    }, [isEditing, regularHours]);


    const handleDayToggle = (day: string, isOpen: boolean) => {
        setEditedHours(prev => ({
            ...prev,
            [day]: { ...prev[day], isOpen }
        }));
    };

    const handleTimeChange = (day: string, type: 'openTime' | 'closeTime', part: 'hours' | 'minutes', value: string) => {
        const numericValue = parseInt(value, 10);
        setEditedHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [type]: {
                    ...prev[day][type],
                    [part]: numericValue
                }
            }
        }));
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
    }

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        const periods = WEEKDAYS.filter(day => editedHours[day].isOpen).map(day => {
            const { openTime, closeTime } = editedHours[day];

            if (closeTime.hours === 24) {
                 return {
                    openDay: day,
                    openTime: {},
                    closeDay: day,
                    closeTime: { hours: 24 }
                };
            }

            return {
                openDay: day,
                openTime: { hours: openTime.hours, minutes: openTime.minutes },
                closeTime: { hours: closeTime.hours, minutes: closeTime.minutes },
                closeDay: day,
            };
        });
        
        const updateData = { regularHours: { periods } };

        const result = await updateLocation(locationName, updateData, ['regularHours']);

        if (result.error) {
            setError(result.error);
        } else {
            onUpdateSuccess(result.data.regularHours);
            setIsEditing(false);
            toast({
                title: "Success",
                description: "Opening hours updated successfully.",
            });
        }
        setIsSaving(false);
    };

    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5" />
                    Opening Hours
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
                    <div className="space-y-6">
                        {WEEKDAYS.map(day => (
                            <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <div className="flex items-center gap-2 md:col-span-1">
                                    <Switch
                                        id={`is-open-${day}`}
                                        checked={editedHours[day]?.isOpen}
                                        onCheckedChange={(checked) => handleDayToggle(day, checked)}
                                    />
                                    <Label htmlFor={`is-open-${day}`} className="font-semibold">{capitalize(day)}</Label>
                                </div>
                                <div className={`md:col-span-3 grid grid-cols-2 gap-4 ${!editedHours[day]?.isOpen && 'opacity-50 pointer-events-none'}`}>
                                    <div className="space-y-1">
                                        <Label className="text-xs" htmlFor={`open-time-${day}`}>Open</Label>
                                        <div className="flex gap-2">
                                            <Select value={String(editedHours[day]?.openTime.hours ?? 9).padStart(2, '0')} onValueChange={v => handleTimeChange(day, 'openTime', 'hours', v)}>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>{timeOptions.hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                                            </Select>
                                             <Select value={String(editedHours[day]?.openTime.minutes ?? 0).padStart(2, '0')} onValueChange={v => handleTimeChange(day, 'openTime', 'minutes', v)}>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>{timeOptions.minutes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs" htmlFor={`close-time-${day}`}>Close</Label>
                                        <div className="flex gap-2">
                                            <Select value={String(editedHours[day]?.closeTime.hours ?? 17).padStart(2, '0')} onValueChange={v => handleTimeChange(day, 'closeTime', 'hours', v)}>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>{[...timeOptions.hours, "24"].map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <Select value={String(editedHours[day]?.closeTime.minutes ?? 0).padStart(2, '0')} onValueChange={v => handleTimeChange(day, 'closeTime', 'minutes', v)}>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>{timeOptions.minutes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                         {error && (
                             <Alert variant="destructive">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>API Error</AlertTitle>
                                <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
                            </Alert>
                        )}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Hours
                            </Button>
                        </div>
                    </div>
                ) : (
                     <ul className="space-y-2 text-sm text-muted-foreground">
                        {regularHours?.periods && regularHours.periods.length > 0 ? (
                           WEEKDAYS.map((day, index) => {
                                const period = regularHours.periods?.find(p => p.openDay === day);
                                const is24h = period?.closeTime?.hours === 24 && Object.keys(period.openTime || {}).length === 0;

                               return (
                                   <li key={index} className="flex justify-between">
                                        <span className="font-medium text-foreground w-28">{capitalize(day)}</span>
                                        {is24h ? (
                                            <span className="font-semibold text-green-600">Open 24 hours</span>
                                        ) : period ? (
                                            <span>{formatTime(period.openTime)} - {formatTime(period.closeTime)}</span>
                                        ) : (
                                            <span className="text-gray-400">Closed</span>
                                        )}
                                    </li>
                               )
                           })
                        ) : <p>No hours specified.</p>}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}

    

    