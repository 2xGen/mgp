"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageSquare,
  Calendar,
  TrendingDown,
  TrendingUp,
  FileWarning,
  Phone,
  Globe,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import type { Review } from "./review-list";
import type { LocationDetailsData } from "@/app/dashboard/dashboard-provider";
import { useDashboard } from "@/app/dashboard/dashboard-provider";
import { differenceInDays } from "date-fns";

export type Recommendation = {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  detail: string;
  actionLabel: string;
  tab: "reviews" | "posts" | "details" | "performance" | "media" | "overview";
  icon: React.ElementType;
};

function profileGaps(location: LocationDetailsData) {
  const gaps: Recommendation[] = [];
  if (!location.storefrontAddress?.addressLines?.length) {
    gaps.push({
      id: "address",
      priority: "high",
      title: "Add your business address",
      detail: "Without an address you won’t show properly on Maps.",
      actionLabel: "Fix profile",
      tab: "details",
      icon: MapPin,
    });
  }
  if (!location.regularHours?.periods?.length) {
    gaps.push({
      id: "hours",
      priority: "high",
      title: "Add opening hours",
      detail: "Customers need to know when you’re open.",
      actionLabel: "Add hours",
      tab: "details",
      icon: Clock,
    });
  }
  if (!location.profile?.description) {
    gaps.push({
      id: "description",
      priority: "medium",
      title: "Write a business description",
      detail: "Tell Google (and customers) what you do in your own words.",
      actionLabel: "Add description",
      tab: "details",
      icon: FileWarning,
    });
  }
  if (!location.phoneNumbers?.primaryPhone) {
    gaps.push({
      id: "phone",
      priority: "medium",
      title: "Add a phone number",
      detail: "Make it easy for people to call you from Search and Maps.",
      actionLabel: "Add phone",
      tab: "details",
      icon: Phone,
    });
  }
  if (!location.websiteUri) {
    gaps.push({
      id: "website",
      priority: "medium",
      title: "Add your website",
      detail: "Drive clicks from your profile to your site.",
      actionLabel: "Add website",
      tab: "details",
      icon: Globe,
    });
  }
  return gaps;
}

export function buildRecommendations(input: {
  location: LocationDetailsData;
  reviews: Review[];
  posts: any[];
  viewsChange: number;
  websiteChange: number;
  callsChange: number;
  unansweredReviews: number;
}): Recommendation[] {
  const items: Recommendation[] = [...profileGaps(input.location)];

  if (input.unansweredReviews > 0) {
    items.push({
      id: "replies",
      priority: input.unansweredReviews > 5 ? "high" : "medium",
      title:
        input.unansweredReviews === 1
          ? "Reply to 1 open review"
          : `Reply to ${input.unansweredReviews} open reviews`,
      detail: "Responding quickly builds trust and can lift local visibility.",
      actionLabel: "Open reviews",
      tab: "reviews",
      icon: MessageSquare,
    });
  }

  const mostRecentPost =
    input.posts?.length > 0
      ? input.posts.reduce((latest: any, post: any) =>
          new Date(post.createTime) > new Date(latest.createTime) ? post : latest
        )
      : null;
  const daysSincePost = mostRecentPost
    ? differenceInDays(new Date(), new Date(mostRecentPost.createTime))
    : 999;

  if (!mostRecentPost || daysSincePost > 28) {
    items.push({
      id: "post",
      priority: "high",
      title: mostRecentPost ? "Your last post is getting stale" : "Publish your first Google post",
      detail: "Fresh posts keep your profile active in local search. AI can draft one for you.",
      actionLabel: "AI create",
      tab: "posts",
      icon: Calendar,
    });
  }

  const mostRecentReview =
    input.reviews?.length > 0
      ? input.reviews.reduce((latest, r) =>
          new Date(r.createTime) > new Date(latest.createTime) ? r : latest
        )
      : null;
  const daysSinceReview = mostRecentReview
    ? differenceInDays(new Date(), new Date(mostRecentReview.createTime))
    : 999;

  if (!mostRecentReview || daysSinceReview > 60) {
    items.push({
      id: "get-reviews",
      priority: mostRecentReview ? "medium" : "high",
      title: mostRecentReview
        ? "Ask customers for new reviews"
        : "Start collecting Google reviews",
      detail: "Share a WhatsApp, email, SMS, or QR review request in one click.",
      actionLabel: "Get reviews",
      tab: "reviews",
      icon: Sparkles,
    });
  }

  if (Number.isFinite(input.viewsChange) && input.viewsChange < -15) {
    items.push({
      id: "views-down",
      priority: "high",
      title: "Views are down vs last 30 days",
      detail: "Check keywords, categories, and posting cadence — then reply to every review.",
      actionLabel: "See performance",
      tab: "performance",
      icon: TrendingDown,
    });
  } else if (Number.isFinite(input.viewsChange) && input.viewsChange > 20) {
    items.push({
      id: "views-up",
      priority: "low",
      title: "Views are up — keep the momentum",
      detail: "Double down on what’s working: posts, photos, and fast review replies.",
      actionLabel: "See performance",
      tab: "performance",
      icon: TrendingUp,
    });
  }

  if (Number.isFinite(input.websiteChange) && input.websiteChange < -20) {
    items.push({
      id: "website-down",
      priority: "medium",
      title: "Website clicks dropped",
      detail: "Confirm your website URL is correct and add a clear call to action in posts.",
      actionLabel: "Check profile",
      tab: "details",
      icon: Globe,
    });
  }

  if (Number.isFinite(input.callsChange) && input.callsChange < -20) {
    items.push({
      id: "calls-down",
      priority: "medium",
      title: "Call clicks dropped",
      detail: "Verify your phone number and hours so customers know they can reach you.",
      actionLabel: "Check profile",
      tab: "details",
      icon: Phone,
    });
  }

  const priorityRank = { high: 0, medium: 1, low: 2 };
  return items
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
    .slice(0, 3);
}

const priorityStyles = {
  high: "border-destructive/30 bg-destructive/5",
  medium: "border-amber-300/50 bg-amber-50/80",
  low: "border-primary/20 bg-primary/5",
};

const impactLabel = {
  high: "High impact",
  medium: "Medium impact",
  low: "Nice to have",
};

interface ActionRecommendationsProps {
  location: LocationDetailsData;
  reviews: Review[];
  posts: any[];
  viewsChange: number;
  websiteChange: number;
  callsChange: number;
  onRecommendationsChange?: (recs: Recommendation[]) => void;
}

export default function ActionRecommendations({
  location,
  reviews,
  posts,
  viewsChange,
  websiteChange,
  callsChange,
  onRecommendationsChange,
}: ActionRecommendationsProps) {
  const { setActiveTab } = useDashboard();

  const recommendations = useMemo(() => {
    const unanswered = (reviews || []).filter((r) => !r.reviewReply).length;
    return buildRecommendations({
      location,
      reviews,
      posts,
      viewsChange,
      websiteChange,
      callsChange,
      unansweredReviews: unanswered,
    });
  }, [location, reviews, posts, viewsChange, websiteChange, callsChange]);

  useEffect(() => {
    onRecommendationsChange?.(recommendations);
  }, [recommendations, onRecommendationsChange]);

  if (recommendations.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-700" />
            <CardTitle className="text-lg text-green-900">You&apos;re clear for now</CardTitle>
          </div>
          <CardDescription className="text-green-800/80">
            No urgent fixes. Keep posting weekly and replying to reviews.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">What to do next</CardTitle>
        <CardDescription>
          {recommendations.length} prioritized task{recommendations.length === 1 ? "" : "s"} — fix these, then re-check your score.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={rec.id}
            className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${priorityStyles[rec.priority]}`}
          >
            <div className="flex gap-3">
              <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background/80 text-sm font-semibold text-muted-foreground">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold leading-snug">{rec.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{rec.detail}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                  {impactLabel[rec.priority]}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="shrink-0 self-start sm:self-center"
              onClick={() => setActiveTab(rec.tab)}
            >
              {rec.actionLabel}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
