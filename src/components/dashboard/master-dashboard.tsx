
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Globe, Phone, Map, Star, MessageSquare, Calendar, CheckCircle2, AlertTriangle, XCircle, MousePointerClick, Info, HelpCircle } from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import type { Review } from "./review-list";
import type { Question } from "./question-list";
import type { LocationDetailsData } from "@/app/dashboard/dashboard-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RecentReviews from "./recent-reviews";
import AiSummary from "./ai-summary";


interface MasterDashboardProps {
    userId: string;
    location: LocationDetailsData;
    currentPerformance: any[];
    previousPerformance: any[];
    posts: any[];
    reviews: Review[];
    questions: Question[];
    currentPeriodReviews: Review[];
    previousPeriodReviews: Review[];
}

const RATING_MAP: { [key in Review['starRating']]: number } = {
    'FIVE': 5, 'FOUR': 4, 'THREE': 3, 'TWO': 2, 'ONE': 1, 'STAR_RATING_UNSPECIFIED': 0
};

const METRIC_CONFIG = {
    VIEWS: ['BUSINESS_IMPRESSIONS_DESKTOP_MAPS', 'BUSINESS_IMPRESSIONS_MOBILE_MAPS', 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH', 'BUSINESS_IMPRESSIONS_MOBILE_SEARCH'],
    WEBSITE: ['WEBSITE_CLICKS'],
    CALLS: ['CALL_CLICKS'],
    DIRECTIONS: ['BUSINESS_DIRECTION_REQUESTS'],
};


const getMetricTotal = (data: any[], metrics: string[]): number => {
    if (!data || data.length === 0) return 0;
    
    // Adjust logic to handle single object vs array of objects
    const dataArray = Array.isArray(data) ? data : [data];

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

const calculateReviewStats = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return { average: 0, count: 0 };
    
    const totalRating = reviews.reduce((sum, review) => sum + (RATING_MAP[review.starRating] || 0), 0);
    return { average: totalRating / reviews.length, count: reviews.length };
};


const PerformanceStatCard = ({ title, value, change, icon: Icon, isRating = false, isPercentage = false, tooltipText }: { title: string, value: number, change: number | null, icon: React.ElementType, isRating?: boolean, isPercentage?: boolean, tooltipText?: string }) => (
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
                {isRating ? value.toFixed(1) : isPercentage ? `${value.toFixed(1)}%` : value.toLocaleString()}
            </div>
            {change !== null && change !== undefined && isFinite(change) ? (
                <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {`${change > 0 ? '+' : ''}${(isRating || isPercentage) ? change.toFixed(1) : parseFloat(change.toFixed(0)).toLocaleString()}%`} vs previous 30 days
                </p>
            ) : (
                 <p className="text-xs text-muted-foreground">-- vs previous 30 days</p>
            )}
        </CardContent>
    </Card>
);

export default function MasterDashboard({ userId, location, currentPerformance, previousPerformance, posts, reviews, questions, currentPeriodReviews, previousPeriodReviews }: MasterDashboardProps) {
    const aggregatedStats = useMemo(() => {
        // Performance
        const currentViews = getMetricTotal(currentPerformance, METRIC_CONFIG.VIEWS);
        const previousViews = getMetricTotal(previousPerformance, METRIC_CONFIG.VIEWS);
        const viewsChange = previousViews > 0 ? ((currentViews - previousViews) / previousViews) * 100 : currentViews > 0 ? Infinity : 0;

        const currentWebsite = getMetricTotal(currentPerformance, METRIC_CONFIG.WEBSITE);
        const previousWebsite = getMetricTotal(previousPerformance, METRIC_CONFIG.WEBSITE);
        const websiteChange = previousWebsite > 0 ? ((currentWebsite - previousWebsite) / previousWebsite) * 100 : currentWebsite > 0 ? Infinity : 0;
        
        const currentCalls = getMetricTotal(currentPerformance, METRIC_CONFIG.CALLS);
        const previousCalls = getMetricTotal(previousPerformance, METRIC_CONFIG.CALLS);
        const callsChange = previousCalls > 0 ? ((currentCalls - previousCalls) / previousCalls) * 100 : currentCalls > 0 ? Infinity : 0;

        const currentDirections = getMetricTotal(currentPerformance, METRIC_CONFIG.DIRECTIONS);
        const previousDirections = getMetricTotal(previousPerformance, METRIC_CONFIG.DIRECTIONS);
        const directionsChange = previousDirections > 0 ? ((currentDirections - previousDirections) / previousDirections) * 100 : currentDirections > 0 ? Infinity : 0;
        
        // Engagement Rate
        const currentTotalClicks = currentWebsite + currentCalls + currentDirections;
        const currentEngagementRate = currentViews > 0 ? (currentTotalClicks / currentViews) * 100 : 0;
        
        const previousTotalClicks = previousWebsite + previousCalls + previousDirections;
        const previousEngagementRate = previousViews > 0 ? (previousTotalClicks / previousViews) * 100 : 0;
        
        const engagementRateChange = previousEngagementRate > 0 ? ((currentEngagementRate - previousEngagementRate) / previousEngagementRate) * 100 : currentEngagementRate > 0 ? Infinity : 0;

        // Posts Recency
        const mostRecentPost = posts && posts.length > 0
            ? posts.reduce((latest: any, post: any) => new Date(post.createTime) > new Date(latest.createTime) ? post : latest)
            : null;
        
        let postRecency: { status: 'good' | 'warning' | 'bad' | 'none', message: string, Icon: React.ElementType, detail: string };
        if (!mostRecentPost) {
            postRecency = { status: 'none', message: "No posts yet", Icon: Calendar, detail: "Create a post to engage with customers." };
        } else {
            const daysSincePost = differenceInDays(new Date(), new Date(mostRecentPost.createTime));
            const distance = formatDistanceToNow(new Date(mostRecentPost.createTime), { addSuffix: true });
            if (daysSincePost < 14) {
                 postRecency = { status: 'good', message: `Fresh post`, Icon: CheckCircle2, detail: `Posted ${distance}` };
            } else if (daysSincePost <= 28) {
                postRecency = { status: 'warning', message: "Post getting old", Icon: AlertTriangle, detail: `Last post was ${distance}` };
            } else {
                postRecency = { status: 'bad', message: "Post is stale", Icon: XCircle, detail: "Post an update!" };
            }
        }
            
        // Reviews
        const currentReviewStats = calculateReviewStats(currentPeriodReviews);
        const previousReviewStats = calculateReviewStats(previousPeriodReviews);

        const reviewCountChange = previousReviewStats.count > 0 ? ((currentReviewStats.count - previousReviewStats.count) / previousReviewStats.count) * 100 : currentReviewStats.count > 0 ? Infinity : 0;
        const avgRatingChange = previousReviewStats.average > 0 ? ((currentReviewStats.average - previousReviewStats.average) / previousReviewStats.average) * 100 : currentReviewStats.average > 0 ? Infinity : 0;
        
        const mostRecentReview = reviews && reviews.length > 0
            ? reviews.reduce((latest, review) => new Date(review.createTime) > new Date(latest.createTime) ? review : latest)
            : null;
            
        let reviewRecencyMessage = "";
        if (mostRecentReview) {
            const daysSinceReview = differenceInDays(new Date(), new Date(mostRecentReview.createTime));
             if (daysSinceReview < 14) {
                reviewRecencyMessage = "You’re getting recent feedback!";
            } else if (daysSinceReview > 90) {
                reviewRecencyMessage = "Ask customers for new reviews to stay current.";
            }
        }

        // Reviews needing response
        const reviewsToReplyCount = (reviews || []).filter(r => !r.reviewReply).length;
        let reviewsToReply: { status: 'good' | 'warning' | 'bad', message: string, Icon: React.ElementType, detail: string };
        if (reviewsToReplyCount === 0) {
            reviewsToReply = { status: 'good', message: 'All caught up!', Icon: CheckCircle2, detail: 'You have responded to all reviews.' };
        } else if (reviewsToReplyCount <= 5) {
            reviewsToReply = { status: 'warning', message: `${reviewsToReplyCount} to reply`, Icon: AlertTriangle, detail: `review${reviewsToReplyCount > 1 ? 's' : ''} need${reviewsToReplyCount === 1 ? 's' : ''} a response` };
        } else {
            reviewsToReply = { status: 'bad', message: `${reviewsToReplyCount} to reply`, Icon: XCircle, detail: `${reviewsToReplyCount} reviews need a response.` };
        }

        return {
            performance: [
                { title: "Total Views", value: currentViews, change: viewsChange, icon: Eye },
                { title: "Engagement Rate", value: currentEngagementRate, change: engagementRateChange, icon: MousePointerClick, isPercentage: true, tooltipText: "(Clicks + Calls + Directions) / Total Views" },
                { title: "Website Clicks", value: currentWebsite, change: websiteChange, icon: Globe },
                { title: "Phone Calls", value: currentCalls, change: callsChange, icon: Phone },
                { title: "Direction Requests", value: currentDirections, change: directionsChange, icon: Map }
            ],
            reviews: [
                 { title: "New Reviews (Last 30d)", value: currentReviewStats.count, change: reviewCountChange, icon: MessageSquare },
                 { title: "Average Rating (Last 30d)", value: currentReviewStats.average, change: avgRatingChange, icon: Star, isRating: true },
            ],
            postRecency,
            reviewRecencyMessage,
            reviewsToReply,
        };
    }, [currentPerformance, previousPerformance, posts, reviews, questions, currentPeriodReviews, previousPeriodReviews]);

    const getStatusColor = (status: 'good' | 'warning' | 'bad' | 'none') => {
        switch (status) {
            case 'good': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'bad': return 'text-red-600';
            default: return 'text-muted-foreground';
        }
    }

    const recentReviews = useMemo(() => {
        if (!reviews) return [];
        return [...reviews]
            .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
            .slice(0, 5);
    }, [reviews]);

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-6">
                <div className="space-y-6">
                     <AiSummary 
                        userId={userId}
                        location={location}
                        currentPerformance={currentPerformance}
                        previousPerformance={previousPerformance}
                        recentReviews={recentReviews}
                    />
                    <Card>
                        <CardHeader>
                            <CardTitle>Location Summary: {location.title}</CardTitle>
                            <CardDescription>Aggregated data from this business location for the last 30 days.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-md font-medium text-muted-foreground">Performance vs. Previous 30 Days</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {aggregatedStats.performance.map(stat => <PerformanceStatCard key={stat.title} {...stat} />)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-md font-medium text-muted-foreground">Reviews vs. Previous 30 Days</h3>
                                {aggregatedStats.reviewRecencyMessage && <p className="text-xs text-muted-foreground">{aggregatedStats.reviewRecencyMessage}</p>}
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                            {aggregatedStats.reviews.map(stat => <PerformanceStatCard key={stat.title} {...stat} />)}
                            </div>
                        </div>
                         <div className="space-y-2">
                            <h3 className="text-md font-medium text-muted-foreground">Recent Activity</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <Card className="shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-sm font-medium">Post Recency</CardTitle>
                                             <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="h-3 w-3 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="text-xs space-y-1 p-1">
                                                        <p className="flex items-center"><CheckCircle2 className="h-3 w-3 mr-2 text-green-500"/> Fresh: &lt; 2 weeks</p>
                                                        <p className="flex items-center"><AlertTriangle className="h-3 w-3 mr-2 text-yellow-500"/> Warning: 2-4 weeks</p>
                                                        <p className="flex items-center"><XCircle className="h-3 w-3 mr-2 text-red-500"/> Stale: &gt; 4 weeks</p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <aggregatedStats.postRecency.Icon className={`h-4 w-4 ${getStatusColor(aggregatedStats.postRecency.status)}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${getStatusColor(aggregatedStats.postRecency.status)}`}>
                                        {aggregatedStats.postRecency.message}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                    {aggregatedStats.postRecency.detail}
                                    </p>
                                </CardContent>
                            </Card>
                             <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Reviews to Reply</CardTitle>
                                    <aggregatedStats.reviewsToReply.Icon className={`h-4 w-4 ${getStatusColor(aggregatedStats.reviewsToReply.status)}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${getStatusColor(aggregatedStats.reviewsToReply.status)}`}>
                                        {aggregatedStats.reviewsToReply.message}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {aggregatedStats.reviewsToReply.detail}
                                    </p>
                                </CardContent>
                            </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <RecentReviews reviews={reviews} />
                </div>
            </div>
        </TooltipProvider>
    );
}
