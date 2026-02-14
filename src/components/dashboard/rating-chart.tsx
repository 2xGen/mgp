
"use client";

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
    ChartContainer,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { format, eachDayOfInterval, startOfDay, isAfter } from 'date-fns';
import type { Review } from './review-list';

interface RatingChartProps {
    reviews: Review[];
    dateRange: { from: Date, to: Date };
}

const RATING_MAP: { [key in Review['starRating']]: number } = {
    'FIVE': 5, 'FOUR': 4, 'THREE': 3, 'TWO': 2, 'ONE': 1, 'STAR_RATING_UNSPECIFIED': 0
};

export default function RatingChart({ reviews, dateRange }: RatingChartProps) {
    const chartData = useMemo(() => {
        if (!reviews || reviews.length === 0) return [];

        const sortedReviews = reviews
            .filter(r => RATING_MAP[r.starRating] > 0)
            .sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime());

        const interval = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });

        let cumulativeRating = 0;
        let reviewCount = 0;

        // Pre-calculate cumulative stats up to the start of the date range
        const reviewsBeforeRange = sortedReviews.filter(r => !isAfter(new Date(r.createTime), startOfDay(dateRange.from)));
        reviewsBeforeRange.forEach(r => {
            cumulativeRating += RATING_MAP[r.starRating];
            reviewCount++;
        });

        return interval.map(day => {
            const dayString = format(day, 'yyyy-MM-dd');
            
            // Add reviews from this day
            const reviewsOnDay = sortedReviews.filter(r => format(startOfDay(new Date(r.createTime)), 'yyyy-MM-dd') === dayString);

            reviewsOnDay.forEach(r => {
                cumulativeRating += RATING_MAP[r.starRating];
                reviewCount++;
            });

            const averageRating = reviewCount > 0 ? cumulativeRating / reviewCount : 0;

            return {
                date: format(day, 'MMM d'),
                rating: averageRating > 0 ? parseFloat(averageRating.toFixed(2)) : null, // Show null if no rating yet
            };
        });

    }, [reviews, dateRange]);

    const chartConfig = {
        rating: { label: "Avg. Rating", color: "hsl(var(--chart-1))" },
    };

    const hasData = chartData.some(d => d.rating !== null);

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            {hasData ? (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis domain={[1, 5]} tickCount={5} />
                        <Tooltip
                            content={<ChartTooltipContent
                                formatter={(value, name, props) => (
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{props.payload.date}</span>
                                        <span className="text-sm text-muted-foreground">
                                            Avg. Rating: <span className="font-bold text-foreground">{value}</span>
                                        </span>
                                    </div>
                                )}
                                hideIndicator
                            />}
                        />
                        <defs>
                            <linearGradient id="fillRating" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartConfig.rating.color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={chartConfig.rating.color} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <Area 
                            dataKey="rating"
                            type="monotone"
                            fill="url(#fillRating)"
                            stroke={chartConfig.rating.color}
                            strokeWidth={2}
                            connectNulls
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
                    No rating data available for this period.
                </div>
            )}
        </ChartContainer>
    );
}
