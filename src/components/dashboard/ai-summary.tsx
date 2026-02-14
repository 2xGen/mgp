
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Terminal, Info, RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generatePerformanceSummary, GeneratePerformanceSummaryInput } from "@/ai/flows/generate-performance-summary-flow";
import { getAiSummary, saveAiSummary } from "@/app/actions";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import type { Review } from "./review-list";
import type { LocationDetailsData } from "../dashboard/dashboard-provider";

interface AiSummaryProps {
    userId: string;
    location: LocationDetailsData;
    currentPerformance: any[];
    previousPerformance: any[];
    recentReviews: Pick<Review, 'starRating' | 'comment'>[];
}

const COOLDOWN_DAYS = 7;

// A simple component to render text with bolding for **...** syntax.
const MarkdownRenderer = ({ text }: { text: string }) => {
    return (
        <div className="space-y-4">
            {text.split('\n').map((line, index) => {
                if (line.trim() === '') return <br key={index} />;

                const parts = line.split(/(\*\*.*?\*\*)/g);

                return (
                    <p key={index}>
                        {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={i}>{part.slice(2, -2)}</strong>;
                            }
                            return part;
                        })}
                    </p>
                );
            })}
        </div>
    );
};


export default function AiSummary({ userId, location, currentPerformance, previousPerformance, recentReviews }: AiSummaryProps) {
    const [summary, setSummary] = useState<string | null>(null);
    const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchSummary = async () => {
            if (!userId || !location.name) return;
            setIsFetching(true);
            const result = await getAiSummary(userId, location.name);
            if (result.summary && result.generatedAt) {
                setSummary(result.summary);
                setLastGenerated(new Date(result.generatedAt));
            } else {
                // Clear out old state if no summary is found
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

    const canGenerate = useMemo(() => {
        if (!lastGenerated) return true;
        return differenceInDays(new Date(), lastGenerated) >= COOLDOWN_DAYS;
    }, [lastGenerated]);

    const nextGenerationTime = useMemo(() => {
        if (!lastGenerated || canGenerate) return '';
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
            recentReviews: recentReviews.map(r => ({ starRating: r.starRating, comment: r.comment })),
        };

        try {
            const result = await generatePerformanceSummary(input);
            setSummary(result);
            setLastGenerated(new Date());
            const saveResult = await saveAiSummary(userId, location.name, result);
            if (saveResult.error) {
                // Show a non-blocking error to the user
                 console.error("Failed to save AI summary:", saveResult.error);
                 setError(`Failed to save summary: ${saveResult.error}`);
            }
        } catch (e: any) {
            setError(e.message || "Failed to generate AI summary.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const GenerateButton = () => {
        const button = (
             <Button onClick={handleGenerateSummary} disabled={isGenerating || !canGenerate}>
                {isGenerating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                       <RefreshCcw className="mr-2 h-4 w-4" />
                       {lastGenerated ? 'Regenerate Overview' : 'Generate AI Overview'}
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
            )
        }

        return button;
    }


    return (
        <Card className="shadow-md bg-primary/5">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                           <Sparkles className="h-5 w-5 text-primary" />
                           <CardTitle>AI-Powered Summary</CardTitle>
                        </div>
                         <CardDescription>
                            Get an intelligent analysis of your recent performance and reviews.
                        </CardDescription>
                    </div>
                    <GenerateButton />
                </div>
            </CardHeader>
            <CardContent>
                {(isGenerating || isFetching) && (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                {error && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>AI Error</AlertTitle>

                        <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
                    </Alert>
                )}
                {summary && !isGenerating && (
                    <>
                    <div className="font-sans text-sm text-foreground/90">
                        <MarkdownRenderer text={summary} />
                    </div>
                     {lastGenerated && (
                        <p className="text-xs text-muted-foreground mt-4 text-right">
                           Generated {formatDistanceToNow(lastGenerated, { addSuffix: true })}
                        </p>
                     )}
                    </>
                )}
                {!isGenerating && !isFetching && !summary && !error && (
                     <div className="text-center text-muted-foreground p-8">
                        Click the button to generate your performance summary.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
