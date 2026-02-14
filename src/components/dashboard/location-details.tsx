
"use client";

import { useEffect, useState } from "react";
import SearchKeywords from "./search-keywords";
import ReviewList from "./review-list";
import QuestionList from "./question-list";
import MediaList from "./media-list";
import LocalPostsList from "./local-posts-list";
import PreviousMonthSummary from "./previous-month-summary";
import type { Review } from './review-list';
import type { Question } from './question-list';
import ReviewSummary from "./review-summary";
import type { LocationDetailsData } from "../dashboard/dashboard-provider";
import ReviewStats from "./review-stats";


interface LocationDetailsProps {
    location: LocationDetailsData;
    accountId: string;
    reviews: Review[];
    questions: Question[];
}

export default function LocationDetails({ location, accountId, reviews, questions }: LocationDetailsProps) {
    const { name } = location;
    
    const accountIdNum = accountId.split('/')[1];
    const locationId = name.split('/')[1];
    const fullLocationPath = `accounts/${accountIdNum}/locations/${locationId}`;

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-8">
                <ReviewSummary allReviews={reviews} />
                <PreviousMonthSummary locationName={name} />
                <SearchKeywords locationName={name} />
            </div>
            <div className="flex flex-col gap-8">
                <MediaList locationName={fullLocationPath} />
                <LocalPostsList locationName={fullLocationPath} />
                <ReviewStats reviews={reviews} isLoading={false} />
                <ReviewList locationName={name} accountId={accountId} allReviews={reviews} isLoading={false} error={null} />
                <QuestionList locationName={name} accountId={accountId} allQuestions={questions} isLoading={false} error={null} />
            </div>
        </div>
    );
}
