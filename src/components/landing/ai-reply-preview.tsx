
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, User, Check, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';

const replies = {
  friendly:
    "Hi Alex! Thank you so much for your amazing 5-star review! We're thrilled to hear you enjoyed the 'Sunrise Special' espresso. It's one of our favorites too! We can't wait to see you again soon. ☀️",
  concise:
    "Thanks for the 5-star review, Alex! We're glad you enjoyed your visit and hope to see you again.",
  formal:
    'Dear Alex, we sincerely appreciate you taking the time to provide your feedback. It is wonderful to hear that you were pleased with your experience. We look forward to serving you again in the future.',
};

type ReplyTone = keyof typeof replies;

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

const StatusCard = ({ responded }: { responded: boolean }) => {
    const Icon = responded ? CheckCircle2 : AlertTriangle;
    const title = responded ? "All caught up!" : "1 review to reply";
    const description = responded ? "You have responded to all pending reviews." : "A review needs your response.";
    const colorClass = responded ? "text-green-600" : "text-yellow-600";

    return (
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviews to Reply</CardTitle>
                <Icon className={cn("h-4 w-4", colorClass)} />
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", colorClass)}>{title}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
};


export default function AiReplyPreview() {
  const [activeTone, setActiveTone] = useState<ReplyTone>('friendly');
  const [isResponded, setIsResponded] = useState(false);
  const reviewImage = placeholderImages.review_card;

  // Reset responded state when tone changes
  useEffect(() => {
    setIsResponded(false);
  }, [activeTone]);

  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
      <div className="order-1 flex flex-col items-start gap-4 md:order-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                AI review replies
            </div>
            <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                Reply to every review{' '}
                <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                  without the blank page
                </span>
            </h2>
            <p className="text-lg text-muted-foreground">
                AI drafts on-brand replies in three tones. Pick one, tweak if you want, post — so unanswered reviews stop sitting on your profile.
            </p>
             <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-green" />
                  Turn positive reviews into loyal customers.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-green" />
                  Professionally handle negative feedback.
                </li>
                 <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-green" />
                  Maintain a perfect response rate effortlessly.
                </li>
              </ul>
              <Link href="/login" className="mt-2">
                <Button size="lg" variant="outline">
                    Start free trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
        <div className="order-2 flex min-w-0 flex-col gap-4 md:order-1">
        <StatusCard responded={isResponded} />
        <Card className="shadow-2xl">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-muted">
                            <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-semibold">Alex Morgan</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isResponded && <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Responded</Badge>}
                        <StarRatingDisplay rating={5} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-foreground/80 italic">
                    "Absolutely love this place! The 'Sunrise Special' espresso is the best I've ever had. The atmosphere is cozy and the staff are always welcoming. A must-visit for any coffee lover."
                </p>

                {!isResponded && (
                    <div className="rounded-lg border bg-background p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <h4 className="flex items-center gap-2 text-sm font-semibold shrink-0">
                                <Sparkles className="h-4 w-4 text-primary" />
                                AI-Powered Reply Drafts
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {(Object.keys(replies) as ReplyTone[]).map((tone) => (
                                    <Button
                                    key={tone}
                                    size="sm"
                                    variant={activeTone === tone ? 'default' : 'outline'}
                                    onClick={() => setActiveTone(tone)}
                                    className={cn("capitalize", activeTone === tone && "bg-primary text-primary-foreground")}
                                    >
                                    {tone}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="min-h-[120px] rounded-md bg-muted p-3 text-sm text-muted-foreground">
                            {replies[activeTone]}
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => setIsResponded(true)}>
                                Respond
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
