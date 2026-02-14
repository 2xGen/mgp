
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, Clock, Info, Phone, Globe, ListChecks } from "lucide-react";
import type { LocationDetailsData } from "@/app/dashboard/dashboard-provider";
import { useDashboard } from "@/app/dashboard/dashboard-provider";

interface OptimizationAlertsProps {
    location: LocationDetailsData;
}

export default function OptimizationAlerts({ location }: OptimizationAlertsProps) {
    const { setActiveTab } = useDashboard();
    
    const checkMissingInfo = () => {
        const missing = [];
        if (!location.storefrontAddress || !location.storefrontAddress.addressLines || location.storefrontAddress.addressLines.length === 0) {
            missing.push({
                Icon: MapPin,
                text: "Add a business address to appear on Google Maps.",
            });
        }
        if (!location.regularHours || !location.regularHours.periods || location.regularHours.periods.length === 0) {
            missing.push({
                Icon: Clock,
                text: "Add business hours to let customers know when you're open.",
            });
        }
        if (!location.profile?.description) {
            missing.push({
                Icon: Info,
                text: "Write a business description to tell customers your story.",
            });
        }
        if (!location.phoneNumbers?.primaryPhone) {
            missing.push({
                Icon: Phone,
                text: "Add a phone number so customers can contact you.",
            });
        }
        if (!location.websiteUri) {
            missing.push({
                Icon: Globe,
                text: "Add your website to drive more traffic and leads.",
            });
        }
        return missing;
    }

    const missingInfo = checkMissingInfo();

    if (missingInfo.length === 0) {
        return null;
    }

    return (
         <Card className="bg-yellow-50 border-yellow-200 shadow-md">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-700" />
                        <CardTitle className="text-yellow-900">Optimization Opportunities</CardTitle>
                    </div>
                     <AlertDescription className="text-yellow-800 mt-2">
                        Complete these steps to improve your profile's performance and engagement on Google.
                    </AlertDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {missingInfo.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-yellow-100/50">
                            <item.Icon className="h-5 w-5 text-yellow-700 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-yellow-900">{item.text}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
