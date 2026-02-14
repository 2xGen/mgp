
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MousePointerClick, Globe, Phone, Map, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const mockPerformance = [
    { title: "Total Views", value: 47, change: -13, icon: Eye, tooltipText: "How many times your profile was seen on Google." },
    { title: "Engagement Rate", value: 8.5, change: 359.6, icon: MousePointerClick, isPercentage: true, tooltipText: "(Clicks + Calls + Directions) / Total Views" },
    { title: "Website Clicks", value: 3, change: 200, icon: Globe, tooltipText: "Clicks to your website from your profile." },
    { title: "Phone Calls", value: 1, change: null, icon: Phone, tooltipText: "Calls made from the 'Call' button on your profile." },
    { title: "Direction Requests", value: 0, change: 0, icon: Map, tooltipText: "Requests for directions to your business." }
];

const PerformanceStatCard = ({ title, value, change, icon: Icon, isPercentage = false, tooltipText }: { title: string, value: number, change: number | null, icon: React.ElementType, isPercentage?: boolean, tooltipText?: string }) => (
    <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {tooltipText && (
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">{tooltipText}</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                {isPercentage ? `${value.toFixed(1)}%` : value.toLocaleString()}
            </div>
            {change !== null && change !== undefined && isFinite(change) ? (
                <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {`${change > 0 ? '+' : ''}${isPercentage ? change.toFixed(1) : parseFloat(change.toFixed(0)).toLocaleString()}%`} vs previous 30 days
                </p>
            ) : (
                 <p className="text-xs text-muted-foreground">-- vs previous 30 days</p>
            )}
        </CardContent>
    </Card>
);

export default function LocationSummaryPreview() {
    return (
        <TooltipProvider>
            <Card className="h-full shadow-2xl bg-card">
                <CardHeader>
                    <CardTitle>Location Summary: ArubaBuddies</CardTitle>
                    <CardDescription>Aggregated data from this business location for the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h3 className="text-md font-medium text-muted-foreground">Performance vs. Previous 30 Days</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockPerformance.map(stat => <PerformanceStatCard key={stat.title} {...stat} />)}
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
