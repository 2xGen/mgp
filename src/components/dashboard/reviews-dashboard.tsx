"use client"

import { useMemo } from 'react';
import type { Review } from './review-list';
import ReviewSummary from "./review-summary";
import ReviewStats from "./review-stats";
import ReviewList from "./review-list";
import ReviewRequestKit from "./review-request-kit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useDashboard } from "@/app/dashboard/dashboard-provider";

interface ReviewsDashboardProps {
    reviews: Review[];
    accountId: string;
}

const NeedsReplyCard = ({ count }: { count: number }) => {
    let status: 'good' | 'warning' | 'bad' = 'good';
    let message = 'All caught up!';
    let detail = 'You have responded to all reviews.';
    let Icon = CheckCircle2;

    if (count > 0 && count <= 5) {
        status = 'warning';
        message = `${count} to reply`;
        detail = `review${count > 1 ? 's' : ''} need${count === 1 ? 's' : ''} a response`;
        Icon = AlertTriangle;
    } else if (count > 5) {
        status = 'bad';
        message = `${count} to reply`;
        detail = `${count} reviews need a response.`;
        Icon = XCircle;
    }

    const getStatusColor = (status: 'good' | 'warning' | 'bad') => {
        switch (status) {
            case 'good': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'bad': return 'text-red-600';
            default: return 'text-muted-foreground';
        }
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviews to Reply</CardTitle>
                <Icon className={`h-4 w-4 ${getStatusColor(status)}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(status)}`}>
                    {message}
                </div>
                <p className="text-xs text-muted-foreground">
                    {detail}
                </p>
            </CardContent>
        </Card>
    );
};


export default function ReviewsDashboard({ reviews, accountId }: ReviewsDashboardProps) {
    const { selectedLocation } = useDashboard();
    
    const reviewsToReplyCount = useMemo(() => {
        return (reviews || []).filter(r => !r.reviewReply).length;
    }, [reviews]);
    
    const locationName = useMemo(() => {
        if (!reviews || reviews.length === 0) return '';
        // e.g. accounts/123/locations/456/reviews/789 -> accounts/123/locations/456
        const parts = reviews[0].name.split('/');
        return parts.slice(0, 4).join('/');
    }, [reviews]);

    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 flex flex-col gap-8">
                <ReviewSummary allReviews={reviews} />
                <ReviewList locationName={locationName} accountId={accountId} allReviews={reviews} isLoading={false} error={null} />
            </div>
            <div className="md:col-span-1 flex flex-col gap-8">
                {selectedLocation?.details && (
                  <ReviewRequestKit location={selectedLocation.details} reviews={reviews} />
                )}
                <ReviewStats reviews={reviews} isLoading={false} />
                <NeedsReplyCard count={reviewsToReplyCount} />
            </div>
        </div>
    );
}
