
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import type { AllLocationsData } from '@/app/dashboard/dashboard-provider';
import { useDashboard } from '@/app/dashboard/dashboard-provider';

const METRIC_CONFIG = {
    VIEWS: ['BUSINESS_IMPRESSIONS_DESKTOP_MAPS', 'BUSINESS_IMPRESSIONS_MOBILE_MAPS', 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH', 'BUSINESS_IMPRESSIONS_MOBILE_SEARCH'],
    WEBSITE: ['WEBSITE_CLICKS'],
    DIRECTIONS: ['BUSINESS_DIRECTION_REQUESTS'],
};

const RATING_MAP: { [key: string]: number } = {
    'FIVE': 5, 'FOUR': 4, 'THREE': 3, 'TWO': 2, 'ONE': 1, 'STAR_RATING_UNSPECIFIED': 0
};

const getMetricTotal = (performanceData: any[], metrics: string[]): number => {
    if (!performanceData || performanceData.length === 0) return 0;
    
    const dataArray = Array.isArray(performanceData) ? performanceData : [performanceData];
    let total = 0;
    const allTimeSeries = dataArray.flatMap(d => d.dailyMetricTimeSeries || []);
    const relevantSeries = allTimeSeries.filter((ts: any) => metrics.includes(ts.dailyMetric));

    for (const series of relevantSeries) {
        if (series.timeSeries && series.timeSeries.datedValues) {
            total += series.timeSeries.datedValues.reduce((sum: number, day: any) => sum + parseInt(day.value || '0', 10), 0);
        }
    }
    return total;
};


const calculateChange = (current: number, previous: number) => {
    if (previous === 0) {
        return current > 0 ? Infinity : 0;
    }
    return ((current - previous) / previous) * 100;
};

const ChangeIndicator = ({ change }: { change: number | null }) => {
    if (change === null || !isFinite(change)) {
        return <span className="text-muted-foreground">--</span>;
    }
    const isPositive = change > 0;
    const isNegative = change < 0;
    const color = isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-muted-foreground";

    return (
        <span className={`flex items-center text-xs font-medium ${color}`}>
            {isPositive && <ArrowUp className="h-3 w-3 mr-1" />}
            {isNegative && <ArrowDown className="h-3 w-3 mr-1" />}
            {change.toFixed(0)}%
        </span>
    );
};

interface LocationsTableProps {
    locations: AllLocationsData[];
}

export default function LocationsTable({ locations }: LocationsTableProps) {
    const { setSelectedLocationName } = useDashboard();
    
    const tableData = useMemo(() => {
        return locations.map(loc => {
            const currentViews = getMetricTotal(loc.currentPerformance, METRIC_CONFIG.VIEWS);
            const previousViews = getMetricTotal(loc.previousPerformance, METRIC_CONFIG.VIEWS);
            const viewsChange = calculateChange(currentViews, previousViews);
            
            const websiteClicks = getMetricTotal(loc.currentPerformance, METRIC_CONFIG.WEBSITE);
            const directionRequests = getMetricTotal(loc.currentPerformance, METRIC_CONFIG.DIRECTIONS);

            const reviewCount = loc.reviews?.length || 0;
            const avgRating = reviewCount > 0
                ? loc.reviews.reduce((sum, r) => sum + (RATING_MAP[r.starRating] || 0), 0) / reviewCount
                : 0;

            const reviewsToReply = loc.reviews?.filter(r => !r.reviewReply).length || 0;

            const mostRecentPost = loc.posts && loc.posts.length > 0
                ? loc.posts.reduce((latest: any, post: any) => new Date(post.createTime) > new Date(latest.createTime) ? post : latest)
                : null;
            
            const lastPostDate = mostRecentPost ? formatDistanceToNow(new Date(mostRecentPost.createTime), { addSuffix: true }) : 'Never';

            return {
                id: loc.id,
                title: loc.details.title,
                views: currentViews,
                viewsChange,
                websiteClicks,
                directionRequests,
                reviewCount,
                avgRating,
                reviewsToReply,
                lastPostDate,
            };
        });
    }, [locations]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Locations Leaderboard</CardTitle>
                <CardDescription>Comparative performance over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px]">Location</TableHead>
                                <TableHead className="text-right">Views</TableHead>
                                <TableHead className="text-right">Website Clicks</TableHead>
                                <TableHead className="text-right">Directions</TableHead>
                                <TableHead className="text-right">Last Post</TableHead>
                                <TableHead className="text-right">Avg. Rating</TableHead>
                                <TableHead className="text-right">Replies Needed</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData.map(loc => (
                                <TableRow key={loc.id}>
                                    <TableCell className="font-medium">{loc.title}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end">
                                            <span>{loc.views.toLocaleString()}</span>
                                            <ChangeIndicator change={loc.viewsChange} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{loc.websiteClicks.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{loc.directionRequests.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{loc.lastPostDate}</TableCell>
                                    <TableCell className="text-right">{loc.avgRating.toFixed(1)} ({loc.reviewCount})</TableCell>
                                    <TableCell className="text-right">
                                        {loc.reviewsToReply > 0 ? (
                                            <Badge variant="destructive">{loc.reviewsToReply}</Badge>
                                        ) : (
                                            <Badge variant="secondary">0</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedLocationName(loc.id)}>
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
