"use client";

import { useMemo } from 'react';
import type { Review } from './review-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, User, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useDashboard } from '@/app/dashboard/dashboard-provider';

interface RecentReviewsProps {
    reviews: Review[];
}

const StarRatingDisplay: React.FC<{ rating: Review['starRating'] }> = ({ rating }) => {
    const ratingMap = {
        'FIVE': 5, 'FOUR': 4, 'THREE': 3, 'TWO': 2, 'ONE': 1, 'STAR_RATING_UNSPECIFIED': 0
    };
    const numericRating = ratingMap[rating] || 0;
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < numericRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

function CompactReviewMedia({ review }: { review: Review }) {
    const media = review.reviewMediaItems || review.reviewMediaItem || [];
    if (!media.length) return null;
    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {media.slice(0, 3).map((item, idx) => {
                const src = item.thumbnailUrl || item.googleUrl || item.sourceUrl;
                if (!src) return null;
                return (
                    <a
                        key={idx}
                        href={item.googleUrl || item.sourceUrl || src}
                        target="_blank"
                        rel="noreferrer"
                        className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="h-full w-full object-cover" />
                    </a>
                );
            })}
            {media.length > 3 && (
                <span className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                    +{media.length - 3}
                </span>
            )}
        </div>
    );
}

export default function RecentReviews({ reviews }: RecentReviewsProps) {
    const { setActiveTab } = useDashboard();

    const recentReviews = useMemo(() => {
        if (!reviews) return [];
        return [...reviews]
            .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
            .slice(0, 5);
    }, [reviews]);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <CardTitle>Recent Reviews</CardTitle>
                </div>
                <CardDescription>Your 5 most recent customer reviews.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {recentReviews.length > 0 ? (
                    <div className="space-y-6">
                        {recentReviews.map((review) => (
                            <div key={review.reviewId} className="flex gap-4">
                                <Avatar>
                                    {review.reviewer.profilePhotoUrl && <AvatarImage src={review.reviewer.profilePhotoUrl} alt={review.reviewer.displayName} />}
                                    <AvatarFallback>
                                        {review.reviewer.isAnonymous ? <User className="h-4 w-4" /> : review.reviewer.displayName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-sm">{review.reviewer.displayName}</p>
                                        <StarRatingDisplay rating={review.starRating} />
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {review.comment}
                                    </p>
                                    <CompactReviewMedia review={review} />
                                    <p className="text-xs text-muted-foreground/80">{formatDistanceToNow(new Date(review.createTime), { addSuffix: true })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No reviews yet.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => setActiveTab('reviews')}>
                    View All Reviews
                </Button>
            </CardFooter>
        </Card>
    );
}
