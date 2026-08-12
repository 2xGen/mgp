"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse } from "lucide-react";
import { computeProfileHealth } from "@/lib/profile-health";
import type { LocationDetailsData } from "@/app/dashboard/dashboard-provider";
import type { Review } from "./review-list";

interface ProfileHealthProps {
  location: LocationDetailsData;
  reviews: Review[];
  posts: any[];
  viewsChange: number;
  /** Compact = score strip + category chips (overview). Full = detailed bars. */
  variant?: "compact" | "full";
}

export default function ProfileHealth({
  location,
  reviews,
  posts,
  viewsChange,
  variant = "compact",
}: ProfileHealthProps) {
  // Photos scored from posts already on the overview — no extra Google media API call.
  const health = useMemo(
    () =>
      computeProfileHealth({
        location,
        reviews,
        posts,
        viewsChange,
        mediaCount: null,
      }),
    [location, reviews, posts, viewsChange]
  );

  const barColor =
    health.score >= 80
      ? "bg-emerald-500"
      : health.score >= 60
        ? "bg-amber-500"
        : "bg-destructive";

  if (variant === "compact") {
    return (
      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <HeartPulse className="h-3.5 w-3.5" />
              Profile Health
            </div>
            <h2 className="mt-1 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              {location.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">{health.headline}</p>
          </div>
          <div className="text-right">
            <p className="font-headline text-4xl font-semibold tracking-tight">
              {health.score}
              <span className="text-lg font-normal text-muted-foreground">/100</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {health.gapCount === 0
                ? "Looking strong"
                : `${health.gapCount} area${health.gapCount === 1 ? "" : "s"} to improve`}
            </p>
          </div>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${health.score}%` }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {health.categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-2.5 py-1 text-xs"
            >
              <span className="font-medium">{cat.label}</span>
              <span
                className={
                  cat.score >= 75
                    ? "text-emerald-600"
                    : cat.score >= 50
                      ? "text-amber-600"
                      : "text-destructive"
                }
              >
                {cat.score}%
              </span>
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">{health.diagnosis}</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Profile Health</CardTitle>
            </div>
            <CardDescription className="mt-1">{health.headline}</CardDescription>
          </div>
          <div className="text-right">
            <p className="font-headline text-3xl font-semibold tracking-tight">
              {health.score}
              <span className="text-base font-normal text-muted-foreground">/100</span>
            </p>
          </div>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${health.score}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{health.diagnosis}</p>
        {health.categories.map((cat) => (
          <div key={cat.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{cat.label}</span>
              <span className="tabular-nums text-muted-foreground">{cat.score}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${barColor}`} style={{ width: `${cat.score}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{cat.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
