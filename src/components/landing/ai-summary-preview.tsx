
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Terminal, RefreshCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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


const mockSummary = `Based on your recent performance, customer engagement is showing a very positive trend, primarily driven by a significant increase in users interacting with your profile to get more information.

**Performance Insights:** While total views have seen a slight dip, the engagement rate has skyrocketed by over 350%. This indicates that the viewers you are getting are much more interested in your business than before. The increase in website clicks confirms this high intent.

**Actionable Recommendations:**
1.  **Capitalize on High Engagement:** Since users are highly engaged, consider running a "special offer" post on your GBP to convert this interest into immediate sales.
2.  **Boost Your Call-to-Action:** Your phone call numbers are low. Ensure your phone number is prominently displayed and consider adding a "Call Now" button to your website's landing page.
3.  **Encourage More Reviews:** With high engagement, now is a great time to ask recent customers for reviews to further boost your profile's authority.
`;

export default function AiSummaryPreview() {
    const [summary, setSummary] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const handleGenerateSummary = async () => {
        setIsGenerating(true);
        // Simulate an API call
        setTimeout(() => {
            setSummary(mockSummary);
            setIsGenerating(false);
        }, 1500);
    };
    
    return (
        <Card className="h-full shadow-2xl bg-brand-blue-light border-primary/20">
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
                     <Button onClick={handleGenerateSummary} disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                               <RefreshCcw className="mr-2 h-4 w-4" />
                               Generate AI Overview
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {(isGenerating) && (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Analyzing your data...</p>
                    </div>
                )}
                
                {summary && !isGenerating && (
                    <>
                        <div className="font-sans text-sm text-foreground/90">
                            <MarkdownRenderer text={summary} />
                        </div>
                         <p className="text-xs text-muted-foreground mt-4 text-right">
                           Generated just now
                        </p>
                    </>
                )}

                {!isGenerating && !summary && (
                     <div className="text-center text-muted-foreground p-8">
                        Click the button to generate your performance summary.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
