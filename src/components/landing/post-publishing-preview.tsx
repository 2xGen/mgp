
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, ArrowRight, AlertTriangle, CheckCircle2, Calendar, Loader2 } from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';

const StatusCard = ({ isPosted }: { isPosted: boolean }) => {
    const Icon = isPosted ? CheckCircle2 : AlertTriangle;
    const title = isPosted ? "Fresh post" : "Post getting old";
    const description = isPosted ? "Posted just now" : "Last post was over 2 weeks ago";
    const colorClass = isPosted ? "text-green-600" : "text-yellow-600";

    return (
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Post Recency</CardTitle>
                <Icon className={cn("h-4 w-4", colorClass)} />
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", colorClass)}>{title}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
};

export default function PostPublishingPreview() {
  const [isPosted, setIsPosted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [postContent, setPostContent] = useState("🎉 Grand Re-opening! Join us this weekend for live music, special discounts on all menu items, and a free coffee with any pastry purchase. We can't wait to welcome you back!");

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
        setIsPosted(true);
        setIsPublishing(false);
    }, 1000);
  }

  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Stay Fresh & Relevant
            </div>
            <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                AI drafts posts —{' '}
                <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                  you publish to Google
                </span>
            </h2>
            <p className="text-lg text-muted-foreground">
                Keep the profile active without staring at a blank box. Draft with AI, add a photo, publish offers and events straight to Search and Maps.
            </p>
             <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                    <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-brand-green/10 text-brand-green">
                       <Check className="h-5 w-5" />
                    </div>
                    <span className="pt-1">AI-written announcements, offers, and events.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-brand-green/10 text-brand-green">
                       <Check className="h-5 w-5" />
                    </div>
                    <span className="pt-1">Publish with photos so your profile stays fresh.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-brand-green/10 text-brand-green">
                       <Check className="h-5 w-5" />
                    </div>
                    <span className="pt-1">Weekly recurring event posts when you want autopilot.</span>
                </li>
              </ul>
              <Link href="/login" className="mt-2">
                <Button size="lg" variant="outline">
                    Start free trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
        <div className="min-w-0">
             <div className="flex flex-col gap-4">
                <StatusCard isPosted={isPosted} />
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5"/>
                            Create a New Post
                        </CardTitle>
                        <CardDescription>
                            This post will be published to your Google Business Profile.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            rows={5}
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            disabled={isPosted || isPublishing}
                            placeholder="What's new with your business?"
                        />
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            onClick={handlePublish}
                            disabled={isPosted || isPublishing || !postContent}
                        >
                            {isPublishing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : isPosted ? (
                                <Check className="mr-2 h-4 w-4" />
                            ) : null}
                            {isPublishing ? 'Publishing...' : isPosted ? 'Published!' : 'Publish Post'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  );
}
