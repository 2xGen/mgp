
"use client";

import { useEffect, useState } from "react";
import { fetchLocationPerformance } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PerformanceSummary from "./performance-summary";
import PerformanceChart from "./performance-chart";
import { subDays, subMonths, startOfDay, endOfDay } from "date-fns";
import SearchKeywords from "./search-keywords";

interface PerformanceDashboardProps {
    locationName: string;
}

const dateRanges = [
    { label: 'Last 7 Days', value: 'last-7-days' },
    { label: 'Last 30 Days', value: 'last-30-days' },
    { label: 'Last 90 Days', value: 'last-90-days' },
    { label: 'Last 6 Months', value: 'last-6-months' },
];

const getDateRange = (value: string): { from: Date, to: Date } => {
    const to = endOfDay(new Date());
    switch (value) {
        case 'last-7-days':
            return { from: startOfDay(subDays(to, 6)), to };
        case 'last-90-days':
            return { from: startOfDay(subDays(to, 89)), to };
        case 'last-6-months':
            return { from: startOfDay(subMonths(to, 6)), to };
        case 'last-30-days':
        default:
            return { from: startOfDay(subDays(to, 29)), to };
    }
};

export default function PerformanceDashboard({ locationName }: PerformanceDashboardProps) {
    const [performanceData, setPerformanceData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRangeValue, setDateRangeValue] = useState('last-30-days');
    
    const selectedDateRange = getDateRange(dateRangeValue);

    useEffect(() => {
        if (!locationName) return;

        const getPerformance = async () => {
            setIsLoading(true);
            setError(null);
            setPerformanceData(null);

            const range = getDateRange(dateRangeValue);
            try {
                const result = await fetchLocationPerformance(locationName, range.from.toISOString(), range.to.toISOString());
                if (result.error) {
                    setError(result.error);
                } else {
                    setPerformanceData(result.data);
                }
            } catch (e: any) {
                setError(e.message || "Failed to fetch performance data.");
            } finally {
                setIsLoading(false);
            }
        };

        getPerformance();
    }, [locationName, dateRangeValue]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="grid gap-1">
                        <CardTitle>Performance Dashboard</CardTitle>
                        <CardDescription>
                            Key metrics for views and user actions on your profile.
                        </CardDescription>
                    </div>
                    <Select value={dateRangeValue} onValueChange={setDateRangeValue}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select a date range" />
                        </SelectTrigger>
                        <SelectContent>
                            {dateRanges.map(range => (
                                <SelectItem key={range.value} value={range.value}>
                                    {range.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground justify-center h-64">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Fetching performance data...</span>
                </div>
                )}
                {error && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>API Error</AlertTitle>
                        <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
                    </Alert>
                )}
                {performanceData && (
                    <div className="flex flex-col gap-8">
                        <PerformanceSummary data={performanceData} />
                        <PerformanceChart data={performanceData} dateRange={selectedDateRange} />
                        <SearchKeywords locationName={locationName} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
