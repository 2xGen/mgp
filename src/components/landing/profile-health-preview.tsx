'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const ACTIONS = [
  {
    id: 'hours',
    title: 'Update opening hours',
    why: 'Hours are incomplete — Google may hide your profile outside peak times.',
    impact: 'High',
  },
  {
    id: 'photos',
    title: 'Add 3 fresh photos',
    why: 'Profiles with recent photos get more clicks from Search and Maps.',
    impact: 'Medium',
  },
  {
    id: 'reviews',
    title: 'Reply to 2 open reviews',
    why: 'Unanswered reviews signal inactivity to customers and to Google.',
    impact: 'High',
  },
] as const;

export default function ProfileHealthPreview() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const completed = Object.values(done).filter(Boolean).length;
  const score = 62 + completed * 8;

  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
      <div className="order-2 space-y-4 md:order-1">
        <Card className="overflow-hidden border-2 shadow-xl shadow-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Health</CardTitle>
            <Badge variant="secondary" className="tabular-nums">
              {score}/100
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {score < 80
                ? 'A few high-impact fixes would lift this score fast.'
                : 'Looking strong — keep posting and replying to stay ahead.'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              What to do next
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ACTIONS.map((action) => {
              const isDone = done[action.id];
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() =>
                    setDone((prev) => ({ ...prev, [action.id]: !prev[action.id] }))
                  }
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                    isDone
                      ? 'border-brand-green/40 bg-brand-green/5'
                      : 'hover:border-primary/40 hover:bg-primary/[0.03]'
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={cn('text-sm font-semibold', isDone && 'line-through opacity-70')}>
                        {action.title}
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        {action.impact}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{action.why}</p>
                  </div>
                </button>
              );
            })}
            <p className="pt-1 text-center text-xs text-muted-foreground">
              Click an action to try the interactive preview
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="order-1 flex flex-col items-start gap-4 md:order-2">
        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Profile Health
        </div>
        <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
          See what&apos;s holding you back —{' '}
          <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
            then fix it
          </span>
        </h2>
        <p className="text-lg text-muted-foreground">
          MyGoProfile scores your Google Business Profile, explains the gaps, and gives you a short list of what to do next — not another analytics dump.
        </p>
        <Link href="/login">
          <Button size="lg" className="mt-2">
            Check your profile free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
