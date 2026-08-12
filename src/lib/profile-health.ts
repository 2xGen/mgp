/**
 * Profile Health scoring — pure helpers used by the overview dashboard.
 */

import { differenceInDays } from "date-fns";
import type { LocationDetailsData } from "@/app/dashboard/dashboard-provider";
import type { Review } from "@/components/dashboard/review-list";

export type HealthCategory = {
  id: "completeness" | "activity" | "reviews" | "photos" | "visibility";
  label: string;
  score: number; // 0–100
  detail: string;
};

export type ProfileHealthResult = {
  score: number;
  categories: HealthCategory[];
  headline: string;
  /** One-paragraph “so what?” tied to the score — not a second report. */
  diagnosis: string;
  gapCount: number;
};

const RATING_MAP: Record<string, number> = {
  FIVE: 5,
  FOUR: 4,
  THREE: 3,
  TWO: 2,
  ONE: 1,
  STAR_RATING_UNSPECIFIED: 0,
};

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeProfileHealth(input: {
  location: LocationDetailsData;
  reviews: Review[];
  posts: { createTime?: string; media?: unknown[] }[];
  viewsChange: number;
  mediaCount?: number | null;
}): ProfileHealthResult {
  const { location, reviews, posts, viewsChange, mediaCount } = input;

  // --- Completeness (profile fields) ---
  const checks = [
    Boolean(location.storefrontAddress?.addressLines?.length),
    Boolean(location.regularHours?.periods?.length),
    Boolean(location.phoneNumbers?.primaryPhone),
    Boolean(location.websiteUri),
    Boolean(location.profile?.description?.trim()),
    Boolean(location.categories?.primaryCategory?.displayName),
  ];
  const completeCount = checks.filter(Boolean).length;
  const completeness = clamp((completeCount / checks.length) * 100);
  const missingLabels = [
    !checks[0] && "address",
    !checks[1] && "hours",
    !checks[2] && "phone",
    !checks[3] && "website",
    !checks[4] && "description",
    !checks[5] && "category",
  ].filter(Boolean) as string[];

  // --- Activity (posts) ---
  const mostRecentPost =
    posts?.length > 0
      ? posts.reduce((latest, post) =>
          new Date(post.createTime || 0) > new Date(latest.createTime || 0) ? post : latest
        )
      : null;
  const daysSincePost = mostRecentPost?.createTime
    ? differenceInDays(new Date(), new Date(mostRecentPost.createTime))
    : 999;
  let activity = 20;
  if (mostRecentPost) {
    if (daysSincePost <= 7) activity = 100;
    else if (daysSincePost <= 14) activity = 85;
    else if (daysSincePost <= 28) activity = 65;
    else if (daysSincePost <= 60) activity = 40;
    else activity = 25;
  }

  // --- Reviews ---
  const unanswered = (reviews || []).filter((r) => !r.reviewReply).length;
  const total = reviews?.length || 0;
  const replyRate = total > 0 ? ((total - unanswered) / total) * 100 : 50;
  const avgRating =
    total > 0
      ? reviews.reduce((s, r) => s + (RATING_MAP[r.starRating] || 0), 0) / total
      : 0;
  const mostRecentReview =
    total > 0
      ? reviews.reduce((latest, r) =>
          new Date(r.createTime) > new Date(latest.createTime) ? r : latest
        )
      : null;
  const daysSinceReview = mostRecentReview
    ? differenceInDays(new Date(), new Date(mostRecentReview.createTime))
    : 999;

  let reviewsScore = replyRate * 0.45 + (avgRating / 5) * 100 * 0.35;
  if (daysSinceReview <= 30) reviewsScore += 20;
  else if (daysSinceReview <= 90) reviewsScore += 10;
  else if (total === 0) reviewsScore = 35;
  reviewsScore = clamp(reviewsScore - Math.min(unanswered * 4, 25));

  // --- Photos ---
  const postsWithMedia = (posts || []).filter((p) => p.media && p.media.length > 0).length;
  let photos = 40;
  if (typeof mediaCount === "number") {
    if (mediaCount >= 40) photos = 95;
    else if (mediaCount >= 20) photos = 80;
    else if (mediaCount >= 10) photos = 65;
    else if (mediaCount >= 5) photos = 50;
    else if (mediaCount >= 1) photos = 35;
    else photos = 15;
  } else if (postsWithMedia > 0) {
    photos = clamp(40 + postsWithMedia * 8);
  }

  // --- Visibility (views trend as proxy) ---
  let visibility = 70;
  if (Number.isFinite(viewsChange)) {
    if (viewsChange >= 15) visibility = 95;
    else if (viewsChange >= 5) visibility = 85;
    else if (viewsChange >= -5) visibility = 75;
    else if (viewsChange >= -15) visibility = 55;
    else visibility = 35;
  }

  const categories: HealthCategory[] = [
    {
      id: "completeness",
      label: "Information",
      score: completeness,
      detail:
        missingLabels.length === 0
          ? "Core profile fields look complete"
          : `Missing: ${missingLabels.join(", ")}`,
    },
    {
      id: "activity",
      label: "Activity",
      score: activity,
      detail: mostRecentPost
        ? `Last post ${daysSincePost === 0 ? "today" : `${daysSincePost}d ago`}`
        : "No Google posts yet",
    },
    {
      id: "reviews",
      label: "Reviews",
      score: reviewsScore,
      detail:
        total === 0
          ? "No reviews yet — ask customers for feedback"
          : unanswered > 0
            ? `${unanswered} waiting for a reply · ${avgRating.toFixed(1)}★ avg`
            : `All caught up · ${avgRating.toFixed(1)}★ · ${total} reviews`,
    },
    {
      id: "photos",
      label: "Photos",
      score: photos,
      detail:
        typeof mediaCount === "number"
          ? `${mediaCount} photo${mediaCount === 1 ? "" : "s"} on your profile`
          : "Upload fresh photos regularly",
    },
    {
      id: "visibility",
      label: "Visibility",
      score: visibility,
      detail: Number.isFinite(viewsChange)
        ? `Views ${viewsChange >= 0 ? "up" : "down"} ${Math.abs(viewsChange).toFixed(0)}% vs prior 30d`
        : "Need more traffic data to score visibility",
    },
  ];

  const weights: Record<HealthCategory["id"], number> = {
    completeness: 0.25,
    activity: 0.2,
    reviews: 0.25,
    photos: 0.15,
    visibility: 0.15,
  };

  const score = clamp(
    categories.reduce((sum, c) => sum + c.score * weights[c.id], 0)
  );

  const weakCats = categories.filter((c) => c.score < 75);
  const weak = weakCats.length;
  const infoScore = categories.find((c) => c.id === "completeness")!.score;
  const activityScore = categories.find((c) => c.id === "activity")!.score;
  const reviewsCat = categories.find((c) => c.id === "reviews")!.score;
  const visibilityCat = categories.find((c) => c.id === "visibility")!.score;

  let headline: string;
  let diagnosis: string;

  if (infoScore >= 80 && (activityScore < 65 || reviewsCat < 65) && visibilityCat < 75) {
    headline =
      weak === 1
        ? "Your profile looks complete — activity is holding you back."
        : `Your profile looks complete, but ${weak} things are limiting visibility.`;
    const parts: string[] = [];
    if (activityScore < 65) {
      parts.push(
        mostRecentPost
          ? `your last post was ${daysSincePost} days ago`
          : "you haven't published a Google post yet"
      );
    }
    if (reviewsCat < 65) {
      parts.push(
        total === 0
          ? "you have no reviews yet"
          : total < 10
            ? `you only have ${total} review${total === 1 ? "" : "s"}`
            : unanswered > 0
              ? `${unanswered} review${unanswered === 1 ? "" : "s"} still need a reply`
              : "review momentum is soft"
      );
    }
    if (Number.isFinite(viewsChange) && viewsChange < -5) {
      parts.push(`views are down ${Math.abs(viewsChange).toFixed(0)}% vs last month`);
    }
    diagnosis =
      parts.length > 0
        ? `Completeness isn't the problem. Biggest drag: ${parts.join("; ")}. Fix those and re-check your score.`
        : "Focus on the prioritized actions below — then watch Profile Health climb.";
  } else if (score >= 85) {
    headline = "Strong profile — keep the momentum going.";
    diagnosis = "Stay consistent: reply fast, post weekly, and keep asking happy customers for reviews.";
  } else if (score >= 70) {
    headline =
      weak === 1
        ? "You're doing well — one area could lift your visibility."
        : `You're doing well, but ${weak} things could improve your visibility.`;
    diagnosis = `Weakest areas: ${weakCats
      .map((c) => c.label.toLowerCase())
      .join(", ")}. Clear the top actions below.`;
  } else if (score >= 50) {
    headline = `${weak} opportunities to strengthen your Google presence.`;
    diagnosis = `Start with the highest-impact fixes — especially ${weakCats
      .slice(0, 2)
      .map((c) => c.label.toLowerCase())
      .join(" and ")}.`;
  } else {
    headline = "Your profile needs attention — start with the top actions below.";
    diagnosis =
      "Google can't promote an incomplete or inactive profile. Work the list in order, then come back to re-check.";
  }

  return { score, categories, headline, diagnosis, gapCount: weak };
}
