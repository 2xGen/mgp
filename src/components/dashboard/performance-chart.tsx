
"use client";

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Defs, LinearGradient, Stop } from 'recharts';
import {
    ChartContainer,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { format, eachDayOfInterval } from 'date-fns';

interface PerformanceData {
    dailyMetricTimeSeries: {
        dailyMetric: string;
        timeSeries: {
            datedValues: {
                value?: string;
                date: { year: number; month: number; day: number; };
            }[];
        };
    }[];
}

interface PerformanceChartProps {
    data: PerformanceData[];
    dateRange: { from: Date, to: Date };
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

const CHART_COLORS = {
    views: "hsl(var(--chart-1))",
    website: "hsl(var(--chart-2))",
    calls: "hsl(var(--chart-3))",
    directions: "hsl(var(--chart-4))",
};


export default function PerformanceChart({ data, dateRange }: PerformanceChartProps) {
    const chartData = useMemo(() => {
        if (!data) return [];
        
        const allDatedValues = new Map<string, any>();

        const interval = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
        interval.forEach(date => {
            const dateString = format(date, 'yyyy-MM-dd');
            allDatedValues.set(dateString, { date: format(date, 'MMM d'), views: 0, website: 0, calls: 0, directions: 0 });
        });

        data.forEach(tsSet => {
            tsSet.dailyMetricTimeSeries.forEach(series => {
                const metricName = series.dailyMetric;
                series.timeSeries.datedValues.forEach(dv => {
                    if (dv.date) {
                        const dateString = `${dv.date.year}-${String(dv.date.month).padStart(2, '0')}-${String(dv.date.day).padStart(2, '0')}`;
                        const value = parseInt(dv.value || '0', 10);
                        
                        if (allDatedValues.has(dateString)) {
                            const entry = allDatedValues.get(dateString);
                            if (METRIC_CONFIG.VIEWS.includes(metricName)) {
                                entry.views += value;
                            } else if (METRIC_CONFIG.WEBSITE.includes(metricName)) {
                                entry.website += value;
                            } else if (METRIC_CONFIG.CALLS.includes(metricName)) {
                                entry.calls += value;
                            } else if (METRIC_CONFIG.DIRECTIONS.includes(metricName)) {
                                entry.directions += value;
                            }
                        }
                    }
                });
            });
        });
        
        return Array.from(allDatedValues.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data, dateRange]);

    const chartConfig = {
        views: { label: "Total Views", color: CHART_COLORS.views },
        website: { label: "Website Clicks", color: CHART_COLORS.website },
        calls: { label: "Phone Calls", color: CHART_COLORS.calls },
        directions: { label: "Direction Requests", color: CHART_COLORS.directions },
    };

    return (
        <div className="flex flex-col gap-4">
             <p className="text-sm font-medium text-muted-foreground">Daily Trends</p>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                         <defs>
                            <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.views} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={CHART_COLORS.views} stopOpacity={0.1}/>
                            </linearGradient>
                             <linearGradient id="fillWebsite" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.website} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={CHART_COLORS.website} stopOpacity={0.1}/>
                            </linearGradient>
                             <linearGradient id="fillCalls" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.calls} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={CHART_COLORS.calls} stopOpacity={0.1}/>
                            </linearGradient>
                             <linearGradient id="fillDirections" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.directions} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={CHART_COLORS.directions} stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={30}
                        />
                        <Tooltip
                            cursorClassName="fill-muted/50"
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area dataKey="views" type="natural" fill="url(#fillViews)" stroke={CHART_COLORS.views} stackId="1" />
                        <Area dataKey="website" type="natural" fill="url(#fillWebsite)" stroke={CHART_COLORS.website} stackId="1" />
                        <Area dataKey="calls" type="natural" fill="url(#fillCalls)" stroke={CHART_COLORS.calls} stackId="1" />
                        <Area dataKey="directions" type="natural" fill="url(#fillDirections)" stroke={CHART_COLORS.directions} stackId="1" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}
