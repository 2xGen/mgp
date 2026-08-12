
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const mockData = [
    {
        id: 1,
        title: "Sunset Cafe - Downtown",
        views: 12403,
        viewsChange: 18.7,
        websiteClicks: 620,
        directionRequests: 410,
        avgRating: 4.8,
        reviewCount: 152,
        reviewsToReply: 2,
    },
    {
        id: 2,
        title: "Sunset Cafe - Beachfront",
        views: 9850,
        viewsChange: 15.2,
        websiteClicks: 450,
        directionRequests: 320,
        avgRating: 4.9,
        reviewCount: 210,
        reviewsToReply: 0,
    },
    {
        id: 3,
        title: "Joe's Garage - Midtown",
        views: 7600,
        viewsChange: -2.5,
        websiteClicks: 150,
        directionRequests: 550,
        avgRating: 4.5,
        reviewCount: 88,
        reviewsToReply: 5,
    },
     {
        id: 4,
        title: "The Book Nook",
        views: 15230,
        viewsChange: 25.1,
        websiteClicks: 890,
        directionRequests: 210,
        avgRating: 4.9,
        reviewCount: 350,
        reviewsToReply: 0,
    },
];

const ChangeIndicator = ({ change }: { change: number | null }) => {
    if (change === null || !isFinite(change)) {
        return <span className="text-muted-foreground">--</span>;
    }
    const isPositive = change > 0;
    const isNegative = change < 0;
    const color = isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-muted-foreground";

    return (
        <span className={`flex items-center text-xs font-medium ${color}`}>
            {isPositive && <ArrowUp className="h-3 w-3 mr-1" />}
            {isNegative && <ArrowDown className="h-3 w-3 mr-1" />}
            {change.toFixed(0)}%
        </span>
    );
};


export default function MultiLocationPreview() {
  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
        <div className="order-1 flex flex-col items-start gap-4 md:order-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Multi-location
            </div>
            <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                All your locations,{' '}
                <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                  one screen
                </span>
            </h2>
            <p className="text-lg text-muted-foreground">
                Stop switching between Google accounts. Compare performance, catch locations that need replies, and manage every profile from one dashboard.
            </p>
             <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-brand-green" />
                  No more logging in and out of multiple Google accounts.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-brand-green" />
                  Spot top and underperforming locations fast.
                </li>
                 <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-brand-green" />
                  One overview of your brand&apos;s local search health.
                </li>
              </ul>
              <Link href="/login" className="mt-2">
                <Button size="lg" variant="outline">
                    Start free trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
        <div className="order-2 min-w-0 overflow-hidden rounded-xl shadow-xl shadow-primary/10 md:order-1">
             <Card>
                <CardHeader>
                    <CardTitle>Locations Leaderboard</CardTitle>
                    <CardDescription>Comparative performance over the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[150px]">Location</TableHead>
                                    <TableHead className="text-right">Views</TableHead>
                                    <TableHead className="text-right">Avg. Rating</TableHead>
                                    <TableHead className="text-right">Replies Needed</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockData.map(loc => (
                                    <TableRow key={loc.id}>
                                        <TableCell className="font-medium">{loc.title}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end">
                                                <span>{loc.views.toLocaleString()}</span>
                                                <ChangeIndicator change={loc.viewsChange} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{loc.avgRating.toFixed(1)} ({loc.reviewCount})</TableCell>
                                        <TableCell className="text-right">
                                            {loc.reviewsToReply > 0 ? (
                                                <Badge variant="destructive">{loc.reviewsToReply}</Badge>
                                            ) : (
                                                <Badge variant="secondary">0</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
