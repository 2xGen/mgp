
"use client";

import { useEffect, useState } from 'react';
import { fetchSearchKeywords } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '../ui/skeleton';

interface SearchKeywordsProps {
    locationName: string;
}

interface Keyword {
    searchKeyword: string;
    insights?: { // Can be undefined
        impressionCount: string;
    };
    insightsValue?: { // Can be undefined
        threshold: string;
    }
}

interface KeywordsData {
    searchKeywordsCounts: Keyword[];
}

export default function SearchKeywords({ locationName }: SearchKeywordsProps) {
    const [keywordsData, setKeywordsData] = useState<KeywordsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!locationName) return;

        const getKeywords = async () => {
            setIsLoading(true);
            setError(null);
            setKeywordsData(null);
            try {
                const result = await fetchSearchKeywords(locationName);
                if (result.error) {
                    setError(result.error);
                } else if (result.success && result.data) {
                    setKeywordsData(result.data);
                }
            } catch (e: any) {
                setError(e.message || "Failed to fetch search keywords.");
            } finally {
                setIsLoading(false);
            }
        };

        getKeywords();
    }, [locationName]);

    const keywords = keywordsData?.searchKeywordsCounts || [];

    const getImpressionDisplay = (kw: Keyword) => {
        if (kw.insights?.impressionCount) {
            return kw.insights.impressionCount;
        }
        if (kw.insightsValue?.threshold) {
            return `< ${kw.insightsValue.threshold}`;
        }
        return 'N/A';
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="p-6 space-y-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/4" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive" className="mx-6 mb-6">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>API Error</AlertTitle>
                    <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
                </Alert>
            );
        }

        if (keywords.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
                    <Search className="h-10 w-10 mb-2" />
                    <p className="font-semibold">No Search Keywords</p>
                    <p className="text-sm">No keyword data is available for the last month.</p>
                </div>
            );
        }
        
        return (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead className="text-right">Impressions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {keywords.map((kw, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{kw.searchKeyword}</TableCell>
                            <TableCell className="text-right">{getImpressionDisplay(kw)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Search Keywords</CardTitle>
                <CardDescription>Keywords that led to impressions last month.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {renderContent()}
            </CardContent>
        </Card>
    );
}
