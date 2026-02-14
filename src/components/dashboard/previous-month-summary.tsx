
"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchLocationPerformance } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Terminal, Eye, Globe, Phone, Map } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

interface PreviousMonthSummaryProps {
    locationName: string;
}

interface PerformanceData {
    dailyMetricTimeSeries: {
        dailyMetric: string;
        timeSeries: {
            datedValues: {
                value?: string;
            }[];
        };
    }[];
}

const METRIC_CONFIG = {
    VIEWS: [
        'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
        'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
        'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
        'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
    ],
    WEBSITE: ['WEBSITE_CLICKS'],
    CALLS: ['CALL_CLICKS'],
    DIRECTIONS: ['BUSINESS_DIRECTION_REQUESTS'],
};

const getMetricTotal = (data: PerformanceData[], metrics: string[]): number => {
    let total = 0;
    if (!data) return 0;
    
    data.forEach(timeSeriesSet => {
        const relevantSeries = timeSeriesSet.dailyMetricTimeSeries.filter(ts => metrics.includes(ts.dailyMetric));
        
        for (const series of relevantSeries) {
            if (series.timeSeries && series.timeSeries.datedValues) {
                total += series.timeSeries.datedValues.reduce((sum, day) => {
                    return sum + parseInt(day.value || '0', 10);
                }, 0);
            }
        }
    });

    return total;
};

export default function PreviousMonthSummary({ locationName }: PreviousMonthSummaryProps) {
    const [performanceData, setPerformanceData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { monthName, year } = useMemo(() => {
        const prevMonthDate = subMonths(new Date(), 1);
        return {
            monthName: format(prevMonthDate, 'MMMM'),
            year: format(prevMonthDate, 'yyyy')
        };
    }, []);

    useEffect(() => {
        if (!locationName) return;

        const getPerformance = async () => {
            setIsLoading(true);
            setError(null);
            setPerformanceData(null);
            try {
                const prevMonth = subMonths(new Date(), 1);
                const startDate = startOfMonth(prevMonth).toISOString();
                const endDate = endOfMonth(prevMonth).toISOString();

                const result = await fetchLocationPerformance(locationName, startDate, endDate);
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
    }, [locationName]);

    const summaryStats = useMemo(() => {
        if (!performanceData) return null;
        const views = getMetricTotal(performanceData, METRIC_CONFIG.VIEWS);
        const website = getMetricTotal(performanceData, METRIC_CONFIG.WEBSITE);
        const calls = getMetricTotal(performanceData, METRIC_CONFIG.CALLS);
        const directions = getMetricTotal(performanceData, METRIC_CONFIG.DIRECTIONS);
        return { views, website, calls, directions };
    }, [performanceData]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching previous month's data...</span>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>API Error</AlertTitle>
                    <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
                </Alert>
            );
        }

        if (!summaryStats) {
            return <p className="text-muted-foreground">No data available for the previous month.</p>;
        }

        const stats = [
            { title: "Total Views", value: summaryStats.views, icon: Eye },
            { title: "Website Clicks", value: summaryStats.website, icon: Globe },
            { title: "Phone Calls", value: summaryStats.calls, icon: Phone },
            { title: "Direction Requests", value: summaryStats.directions, icon: Map }
        ];

        return (
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Previous Month Summary</CardTitle>
                <CardDescription>
                    Performance metrics for {monthName} {year}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
}
