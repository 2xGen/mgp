"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  Sparkles,
  Terminal,
  RefreshCcw,
  TrendingUp,
  MessageSquareText,
  ListChecks,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  generatePerformanceSummary,
  type GeneratePerformanceSummaryInput,
} from "@/ai/flows/generate-performance-summary-flow";
import {
  isStructuredPerformanceSummary,
  parsePerformanceSummary,
  type PerformanceSummaryOutput,
} from "@/lib/performance-summary";
import { getAiSummary, saveAiSummary } from "@/app/actions";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import type { Review } from "./review-list";
import type { LocationDetailsData } from "../dashboard/dashboard-provider";

interface AiSummaryProps {
  userId: string;
  location: LocationDetailsData;
  currentPerformance: any[];
  previousPerformance: any[];
  recentReviews: Pick<Review, "starRating" | "comment">[];
  /** Compact overview: diagnosis-style header, collapsible detail. */
  compact?: boolean;
}

const COOLDOWN_DAYS = 7;

function StructuredSummary({ data }: { data: PerformanceSummaryOutput }) {
  return (
    <div className="space-y-3">
      <section className="rounded-xl border bg-background/80 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold tracking-tight">Performance insights</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{data.performanceInsights}</p>
      </section>

      <section className="rounded-xl border bg-background/80 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <MessageSquareText className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold tracking-tight">Review sentiment</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{data.reviewSentiment}</p>
      </section>

      <section className="rounded-xl border bg-background/80 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <ListChecks className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold tracking-tight">What to do next</h3>
        </div>
        <ol className="space-y-3">
          {data.recommendations.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function SummaryBody({ raw }: { raw: string }) {
  const structured = parsePerformanceSummary(raw);
  if (!structured) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{raw}</p>
    );
  }
  return <StructuredSummary data={structured} />;
}

export default function AiSummary({
  userId,
  location,
  currentPerformance,
  previousPerformance,
  recentReviews,
  compact = false,
}: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `${userId}::${location.name}`;
    const cached = (globalThis as any).__mgpAiSummaryCache?.[cacheKey] as
      | { summary: string; generatedAt: string; at: number }
      | undefined;
    if (cached && Date.now() - cached.at < 10 * 60 * 1000) {
      setSummary(cached.summary);
      setLastGenerated(new Date(cached.generatedAt));
      setIsFetching(false);
      return;
    }

    const fetchSummary = async () => {
      if (!userId || !location.name) return;
      setIsFetching(true);
      const result = await getAiSummary(userId, location.name);
      if (result.summary && result.generatedAt) {
        setSummary(result.summary);
        setLastGenerated(new Date(result.generatedAt));
        (globalThis as any).__mgpAiSummaryCache = {
          ...((globalThis as any).__mgpAiSummaryCache || {}),
          [cacheKey]: {
            summary: result.summary,
            generatedAt: result.generatedAt,
            at: Date.now(),
          },
        };
      } else {
        setSummary(null);
        setLastGenerated(null);
      }
      if (result.error) {
        console.warn("Could not fetch AI summary:", result.error);
      }
      setIsFetching(false);
    };
    fetchSummary();
  }, [userId, location.name]);

  const needsFormatUpgrade = Boolean(summary && !isStructuredPerformanceSummary(summary));

  const canGenerate = useMemo(() => {
    if (!lastGenerated) return true;
    if (needsFormatUpgrade) return true;
    return differenceInDays(new Date(), lastGenerated) >= COOLDOWN_DAYS;
  }, [lastGenerated, needsFormatUpgrade]);

  const nextGenerationTime = useMemo(() => {
    if (!lastGenerated || canGenerate) return "";
    const nextDate = new Date(lastGenerated);
    nextDate.setDate(nextDate.getDate() + COOLDOWN_DAYS);
    return formatDistanceToNow(nextDate, { addSuffix: true });
  }, [lastGenerated, canGenerate]);

  const handleGenerateSummary = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setError(null);
    setSummary(null);

    const input: GeneratePerformanceSummaryInput = {
      businessName: location.title,
      businessDescription: location.profile?.description,
      currentMetrics: currentPerformance,
      previousMetrics: previousPerformance,
      recentReviews: recentReviews.map((r) => ({
        starRating: r.starRating,
        comment: r.comment,
      })),
    };

    try {
      const result = await generatePerformanceSummary(input);
      setSummary(result);
      setLastGenerated(new Date());
      const saveResult = await saveAiSummary(userId, location.name, result);
      if (saveResult.error) {
        console.error("Failed to save AI summary:", saveResult.error);
        setError(`Failed to save summary: ${saveResult.error}`);
      }
      (globalThis as any).__mgpAiSummaryCache = {
        ...((globalThis as any).__mgpAiSummaryCache || {}),
        [`${userId}::${location.name}`]: {
          summary: result,
          generatedAt: new Date().toISOString(),
          at: Date.now(),
        },
      };
    } catch (e: any) {
      setError(e.message || "Failed to generate AI summary.");
    } finally {
      setIsGenerating(false);
    }
  };

  const GenerateButton = () => {
    const button = (
      <Button
        onClick={handleGenerateSummary}
        disabled={isGenerating || !canGenerate}
        size={compact ? "sm" : "default"}
        variant={compact ? "secondary" : "default"}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {lastGenerated
              ? compact
                ? "Refresh analysis"
                : "Regenerate Overview"
              : compact
                ? "Generate detailed analysis"
                : "Generate AI Overview"}
          </>
        )}
      </Button>
    );

    if (!canGenerate && !isGenerating) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{button}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>You can generate a new summary {nextGenerationTime}.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  return (
    <Card className={compact ? "shadow-sm" : "shadow-md bg-primary/5"}>
      <CardHeader className={compact ? "pb-3" : undefined}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className={compact ? "text-lg" : undefined}>
                {compact ? "Why this score" : "AI-Powered Summary"}
              </CardTitle>
            </div>
            <CardDescription>
              {compact
                ? "Optional deeper analysis of performance and reviews."
                : "Get an intelligent analysis of your recent performance and reviews."}
            </CardDescription>
          </div>
          <GenerateButton />
        </div>
      </CardHeader>
      <CardContent>
        {(isGenerating || isFetching) && (
          <div
            className={`flex items-center ${compact ? "gap-2 py-2 text-sm text-muted-foreground" : "justify-center p-8"}`}
          >
            <Loader2 className={`animate-spin text-primary ${compact ? "h-4 w-4" : "h-8 w-8"}`} />
            {compact && <span>Loading analysis…</span>}
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>AI Error</AlertTitle>
            <AlertDescription>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </AlertDescription>
          </Alert>
        )}
        {summary && !isGenerating && (
          <>
            <SummaryBody raw={summary} />
            {lastGenerated && (
              <p className="mt-4 text-right text-xs text-muted-foreground">
                Generated {formatDistanceToNow(lastGenerated, { addSuffix: true })}
              </p>
            )}
          </>
        )}
        {!isGenerating && !isFetching && !summary && !error && (
          <div className={`text-muted-foreground ${compact ? "py-1 text-sm" : "p-8 text-center"}`}>
            {compact
              ? "Generate a detailed analysis when you want the full story behind the numbers."
              : "Click the button to generate your performance summary."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
