"use client";

import { useMemo } from 'react';
import type { AllLocationsData } from '@/app/dashboard/dashboard-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Globe, Phone, Map, Star, MessageSquare } from 'lucide-react';
import LocationStatCard from './location-stat-card';
import LocationsTable from './locations-table';


const RATING_MAP: { [key: string]: number } = {
    'FIVE': 5, 'FOUR': 4, 'THREE': 3, 'TWO': 2, 'ONE': 1, 'STAR_RATING_UNSPECIFIED': 0
};

const METRIC_CONFIG = {
    VIEWS: ['BUSINESS_IMPRESSIONS_DESKTOP_MAPS', 'BUSINESS_IMPRESSIONS_MOBILE_MAPS', 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH', 'BUSINESS_IMPRESSIONS_MOBILE_SEARCH'],
    WEBSITE: ['WEBSITE_CLICKS'],
    CALLS: ['CALL_CLICKS'],
    DIRECTIONS: ['BUSINESS_DIRECTION_REQUESTS'],
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


interface MultiLocationDashboardProps {
    data: AllLocationsData[];
}

export default function MultiLocationDashboard({ data }: MultiLocationDashboardProps) {

    const aggregatedStats = useMemo(() => {
        let totalViews = 0;
        let totalWebsiteClicks = 0;
        let totalCalls = 0;
        let totalDirections = 0;
        let totalReviews = 0;
        let totalRatingSum = 0;
        let totalReviewsCount = 0;
        
        data.forEach(loc => {
            totalViews += getMetricTotal(loc.currentPerformance, METRIC_CONFIG.VIEWS);
            totalWebsiteClicks += getMetricTotal(loc.currentPerformance, METRIC_CONFIG.WEBSITE);
            totalCalls += getMetricTotal(loc.currentPerformance, METRIC_CONFIG.CALLS);
            totalDirections += getMetricTotal(loc.currentPerformance, METRIC_CONFIG.DIRECTIONS);
            
            if (loc.reviews) {
                totalReviews += loc.reviews.length;
                loc.reviews.forEach(review => {
                    if (RATING_MAP[review.starRating] > 0) {
                        totalRatingSum += RATING_MAP[review.starRating];
                        totalReviewsCount++;
                    }
                });
            }
        });

        const averageRating = totalReviewsCount > 0 ? totalRatingSum / totalReviewsCount : 0;

        return {
            totalViews,
            totalWebsiteClicks,
            totalCalls,
            totalDirections,
            totalReviews,
            averageRating
        };
    }, [data]);
    
    const statCards = [
        { title: "Total Views", value: aggregatedStats.totalViews, icon: Eye },
        { title: "Website Clicks", value: aggregatedStats.totalWebsiteClicks, icon: Globe },
        { title: "Phone Calls", value: aggregatedStats.totalCalls, icon: Phone },
        { title: "Direction Requests", value: aggregatedStats.totalDirections, icon: Map },
        { title: "Total Reviews", value: aggregatedStats.totalReviews, icon: MessageSquare },
        { title: "Average Rating", value: aggregatedStats.averageRating.toFixed(2), icon: Star },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>All Locations Overview</CardTitle>
                    <CardDescription>Aggregated summary for all {data.length} locations in this account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {statCards.map(stat => <LocationStatCard key={stat.title} {...stat} />)}
                    </div>
                </CardContent>
            </Card>
            <LocationsTable locations={data} />
        </div>
    );
}
