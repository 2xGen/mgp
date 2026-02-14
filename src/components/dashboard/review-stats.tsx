
"use client";

import { useMemo, useState } from 'react';
import { subMonths, isAfter } from 'date-fns';
import type { Review } from './review-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface ReviewStatsProps {
    reviews: Review[];
    isLoading: boolean;
}

const RATING_MAP: { [key in Review['starRating']]: number } = {
    'FIVE': 5,
    'FOUR': 4,
    'THREE': 3,
    'TWO': 2,
    'ONE': 1,
    'STAR_RATING_UNSPECIFIED': 0
};

const calculateStats = (reviews: Review[], months: number) => {
    const cutoffDate = subMonths(new Date(), months);
    const filteredReviews = reviews.filter(review => isAfter(new Date(review.createTime), cutoffDate));

    if (filteredReviews.length === 0) {
        return { average: 0, count: 0 };
    }

    const totalRating = filteredReviews.reduce((sum, review) => {
        return sum + (RATING_MAP[review.starRating] || 0);
    }, 0);
    
    const average = totalRating / filteredReviews.length;
    return { average, count: filteredReviews.length };
};

const dateRanges = [
    { label: 'Last 3 Months', value: '3' },
    { label: 'Last 6 Months', value: '6' },
    { label: 'Last 12 Months', value: '12' },
];

export default function ReviewStats({ reviews, isLoading }: ReviewStatsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('3');

    const stats = useMemo(() => {
        if (!reviews) {
             return { average: 0, count: 0 };
        }
        return calculateStats(reviews, parseInt(selectedPeriod, 10));
    }, [reviews, selectedPeriod]);
    
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                </CardContent>
            </Card>
        )
    }


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-base font-medium">Review Stats</CardTitle>
                 <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        {dateRanges.map(range => (
                            <SelectItem key={range.value} value={range.value}>
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="text-2xl font-bold">{stats.average.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">avg. rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{stats.count} reviews</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
