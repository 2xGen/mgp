
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Globe, Phone, Map } from 'lucide-react';

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

interface PerformanceSummaryProps {
    data: PerformanceData[];
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


export default function PerformanceSummary({ data }: PerformanceSummaryProps) {
    const summaryStats = useMemo(() => {
        const views = getMetricTotal(data, METRIC_CONFIG.VIEWS);
        const website = getMetricTotal(data, METRIC_CONFIG.WEBSITE);
        const calls = getMetricTotal(data, METRIC_CONFIG.CALLS);
        const directions = getMetricTotal(data, METRIC_CONFIG.DIRECTIONS);
        return { views, website, calls, directions };
    }, [data]);

    const stats = [
        {
            title: "Total Views",
            value: summaryStats.views,
            icon: Eye
        },
        {
            title: "Website Clicks",
            value: summaryStats.website,
            icon: Globe
        },
        {
            title: "Phone Calls",
            value: summaryStats.calls,
            icon: Phone
        },
        {
            title: "Direction Requests",
            value: summaryStats.directions,
            icon: Map
        }
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
}
