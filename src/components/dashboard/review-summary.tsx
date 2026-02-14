
"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import RatingChart from "./rating-chart";
import type { Review } from './review-list';

const dateRanges = [
    { label: 'Last 30 Days', value: 'last-30-days' },
    { label: 'Last 3 Months', value: 'last-3-months' },
    { label: 'Last 6 Months', value: 'last-6-months' },
    { label: 'Last 12 Months', value: 'last-12-months' },
];

const getDateRange = (value: string): { from: Date, to: Date } => {
    const now = new Date();
    switch (value) {
        case 'last-3-months':
            return { from: subMonths(now, 3), to: now };
        case 'last-6-months':
            return { from: subMonths(now, 6), to: now };
        case 'last-12-months':
            return { from: subMonths(now, 12), to: now };
        case 'last-30-days':
        default:
            return { from: subDays(now, 29), to: now };
    }
};

interface ReviewSummaryProps {
    allReviews: Review[];
}

export default function ReviewSummary({ allReviews }: ReviewSummaryProps) {
    const [dateRangeValue, setDateRangeValue] = useState('last-30-days');
    const selectedDateRange = getDateRange(dateRangeValue);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="grid gap-1">
                        <CardTitle>Rating Trend</CardTitle>
                        <CardDescription>
                            Cumulative average rating for the selected period.
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
                <RatingChart reviews={allReviews} dateRange={selectedDateRange} />
            </CardContent>
        </Card>
    );
}
