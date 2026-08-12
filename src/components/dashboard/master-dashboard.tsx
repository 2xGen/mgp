"use client";

import { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Globe,
  Phone,
  Map,
  Star,
  Calendar,
  MousePointerClick,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  ArrowRight,
  Camera,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import type { Review } from "./review-list";
import type { Question } from "./question-list";
import type { LocationDetailsData } from "@/app/dashboard/dashboard-provider";
import { useDashboard } from "@/app/dashboard/dashboard-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import AiSummary from "./ai-summary";
import ActionRecommendations, { type Recommendation } from "./action-recommendations";
import ActivityFeed from "./activity-feed";
import ProfileHealth from "./profile-health";
import ReviewRequestKit from "./review-request-kit";

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

const RATING_MAP: { [key in Review["starRating"]]: number } = {
  FIVE: 5,
  FOUR: 4,
  THREE: 3,
  TWO: 2,
  ONE: 1,
  STAR_RATING_UNSPECIFIED: 0,
};

const METRIC_CONFIG = {
  VIEWS: [
    "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
    "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
    "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
    "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
  ],
  WEBSITE: ["WEBSITE_CLICKS"],
  CALLS: ["CALL_CLICKS"],
  DIRECTIONS: ["BUSINESS_DIRECTION_REQUESTS"],
};

const getMetricTotal = (data: any[], metrics: string[]): number => {
  if (!data || data.length === 0) return 0;
  const dataArray = Array.isArray(data) ? data : [data];
  let total = 0;
  const allTimeSeries = dataArray.flatMap((d) => d.dailyMetricTimeSeries || []);
  const relevantSeries = allTimeSeries.filter((ts: any) => metrics.includes(ts.dailyMetric));
  for (const series of relevantSeries) {
    if (series.timeSeries && series.timeSeries.datedValues) {
      total += series.timeSeries.datedValues.reduce(
        (sum: number, day: any) => sum + parseInt(day.value || "0", 10),
        0
      );
    }
  }
  return total;
};

function ChangeBadge({ change, isPercentPoint = false }: { change: number; isPercentPoint?: boolean }) {
  if (!isFinite(change)) {
    return <span className="text-xs text-muted-foreground">new</span>;
  }
  const Icon = change === 0 ? Minus : change > 0 ? ArrowUpRight : ArrowDownRight;
  const color =
    change > 0 ? "text-emerald-600" : change < 0 ? "text-destructive" : "text-muted-foreground";
  const value = isPercentPoint
    ? `${change > 0 ? "+" : ""}${change.toFixed(1)} pts`
    : `${change > 0 ? "+" : ""}${change.toFixed(0)}%`;
  return (
    <span className={`inline-flex items-center text-xs font-medium ${color}`}>
      <Icon className="mr-0.5 h-3.5 w-3.5" />
      {value}
    </span>
  );
}

function SnapshotMetric({
  label,
  value,
  change,
  icon: Icon,
  isPercentage = false,
}: {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
  isPercentage?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <p className="mt-1 text-xl font-semibold tabular-nums">
        {isPercentage ? `${value.toFixed(1)}%` : value.toLocaleString()}
      </p>
      <div className="mt-0.5">
        <ChangeBadge change={change} isPercentPoint={isPercentage} />
      </div>
    </div>
  );
}

export default function MasterDashboard({
  userId,
  location,
  currentPerformance,
  previousPerformance,
  posts,
  reviews,
  questions: _questions,
  currentPeriodReviews,
  previousPeriodReviews: _previousPeriodReviews,
}: MasterDashboardProps) {
  const { setActiveTab } = useDashboard();
  const [topActions, setTopActions] = useState<Recommendation[]>([]);

  const handleRecs = useCallback((recs: Recommendation[]) => {
    setTopActions(recs);
  }, []);

  const stats = useMemo(() => {
    const currentViews = getMetricTotal(currentPerformance, METRIC_CONFIG.VIEWS);
    const previousViews = getMetricTotal(previousPerformance, METRIC_CONFIG.VIEWS);
    const viewsChange =
      previousViews > 0
        ? ((currentViews - previousViews) / previousViews) * 100
        : currentViews > 0
          ? Infinity
          : 0;

    const currentWebsite = getMetricTotal(currentPerformance, METRIC_CONFIG.WEBSITE);
    const previousWebsite = getMetricTotal(previousPerformance, METRIC_CONFIG.WEBSITE);
    const websiteChange =
      previousWebsite > 0
        ? ((currentWebsite - previousWebsite) / previousWebsite) * 100
        : currentWebsite > 0
          ? Infinity
          : 0;

    const currentCalls = getMetricTotal(currentPerformance, METRIC_CONFIG.CALLS);
    const previousCalls = getMetricTotal(previousPerformance, METRIC_CONFIG.CALLS);
    const callsChange =
      previousCalls > 0
        ? ((currentCalls - previousCalls) / previousCalls) * 100
        : currentCalls > 0
          ? Infinity
          : 0;

    const currentDirections = getMetricTotal(currentPerformance, METRIC_CONFIG.DIRECTIONS);
    const previousDirections = getMetricTotal(previousPerformance, METRIC_CONFIG.DIRECTIONS);
    const directionsChange =
      previousDirections > 0
        ? ((currentDirections - previousDirections) / previousDirections) * 100
        : currentDirections > 0
          ? Infinity
          : 0;

    const currentTotalClicks = currentWebsite + currentCalls + currentDirections;
    const currentEngagementRate = currentViews > 0 ? (currentTotalClicks / currentViews) * 100 : 0;
    const previousTotalClicks = previousWebsite + previousCalls + previousDirections;
    const previousEngagementRate = previousViews > 0 ? (previousTotalClicks / previousViews) * 100 : 0;
    const engagementRateChange =
      previousEngagementRate > 0
        ? ((currentEngagementRate - previousEngagementRate) / previousEngagementRate) * 100
        : currentEngagementRate > 0
          ? Infinity
          : 0;

    const mostRecentPost =
      posts && posts.length > 0
        ? posts.reduce((latest: any, post: any) =>
            new Date(post.createTime) > new Date(latest.createTime) ? post : latest
          )
        : null;
    const daysSincePost = mostRecentPost
      ? differenceInDays(new Date(), new Date(mostRecentPost.createTime))
      : null;

    const totalReviews = reviews?.length || 0;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((s, r) => s + (RATING_MAP[r.starRating] || 0), 0) / totalReviews
        : 0;
    const newReviews30d = currentPeriodReviews?.length || 0;
    const unanswered = (reviews || []).filter((r) => !r.reviewReply).length;

    return {
      currentViews,
      viewsChange,
      currentWebsite,
      websiteChange,
      currentCalls,
      callsChange,
      currentDirections,
      directionsChange,
      currentEngagementRate,
      engagementRateChange,
      mostRecentPost,
      daysSincePost,
      totalReviews,
      avgRating,
      newReviews30d,
      unanswered,
    };
  }, [currentPerformance, previousPerformance, posts, reviews, currentPeriodReviews]);

  const recentReviews = useMemo(() => {
    if (!reviews) return [];
    return [...reviews]
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
      .slice(0, 5);
  }, [reviews]);

  const showReviewKit = topActions.some((r) => r.id === "get-reviews");

  const postStatus =
    !stats.mostRecentPost || stats.daysSincePost === null
      ? { label: "No posts yet", tone: "text-destructive" as const }
      : stats.daysSincePost > 28
        ? {
            label: `Last post ${formatDistanceToNow(new Date(stats.mostRecentPost.createTime), { addSuffix: true })}`,
            tone: "text-destructive" as const,
          }
        : stats.daysSincePost > 14
          ? {
              label: `Last post ${formatDistanceToNow(new Date(stats.mostRecentPost.createTime), { addSuffix: true })}`,
              tone: "text-amber-600" as const,
            }
          : {
              label: `Posted ${formatDistanceToNow(new Date(stats.mostRecentPost.createTime), { addSuffix: true })}`,
              tone: "text-emerald-600" as const,
            };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <ProfileHealth
          location={location}
          reviews={reviews}
          posts={posts}
          viewsChange={stats.viewsChange}
          variant="compact"
        />

        <ActionRecommendations
          location={location}
          reviews={reviews}
          posts={posts}
          viewsChange={stats.viewsChange}
          websiteChange={stats.websiteChange}
          callsChange={stats.callsChange}
          onRecommendationsChange={handleRecs}
        />

        <AiSummary
          userId={userId}
          location={location}
          currentPerformance={currentPerformance}
          previousPerformance={previousPerformance}
          recentReviews={recentReviews}
          compact
        />

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
            <div>
              <CardTitle className="text-lg">Performance</CardTitle>
              <CardDescription>Last 30 days vs prior 30 days</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("performance")}>
              View performance
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              <SnapshotMetric
                label="Profile views"
                value={stats.currentViews}
                change={stats.viewsChange}
                icon={Eye}
              />
              <SnapshotMetric
                label="Engagement"
                value={stats.currentEngagementRate}
                change={stats.engagementRateChange}
                icon={MousePointerClick}
                isPercentage
              />
              <SnapshotMetric
                label="Website clicks"
                value={stats.currentWebsite}
                change={stats.websiteChange}
                icon={Globe}
              />
              <SnapshotMetric
                label="Calls"
                value={stats.currentCalls}
                change={stats.callsChange}
                icon={Phone}
              />
              <SnapshotMetric
                label="Directions"
                value={stats.currentDirections}
                change={stats.directionsChange}
                icon={Map}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <CardTitle className="text-lg">Reviews</CardTitle>
              </div>
              <CardDescription>
                {stats.avgRating ? `${stats.avgRating.toFixed(1)}★` : "—"} · {stats.totalReviews}{" "}
                total · {stats.newReviews30d} new this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {stats.unanswered === 0
                  ? "No reviews waiting for a reply."
                  : `${stats.unanswered} review${stats.unanswered === 1 ? "" : "s"} need a response.`}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => setActiveTab("reviews")}>
                  <MessageSquare className="mr-1.5 h-4 w-4" />
                  {stats.unanswered > 0 ? "Reply with AI" : "View all reviews"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveTab("reviews")}>
                  Get more reviews
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Activity</CardTitle>
              <CardDescription>Keep Google seeing a living profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Posts</p>
                    <p className={`text-xs ${postStatus.tone}`}>{postStatus.label}</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setActiveTab("posts")}>
                  Create with AI
                </Button>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Photos</p>
                    <p className="text-xs text-muted-foreground">Manage gallery & upload fresh shots</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setActiveTab("media")}>
                  Manage photos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {showReviewKit && <ReviewRequestKit location={location} reviews={reviews} />}

        <ActivityFeed />
      </div>
    </TooltipProvider>
  );
}
