"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, History } from "lucide-react";
import { getRecentActivity } from "@/lib/activity";
import { formatDistanceToNow } from "date-fns";

type ActivityItem = {
  id: string;
  summary: string;
  createdAt: string;
  actorName: string | null;
};

let activityCache: { items: ActivityItem[]; at: number } | null = null;
const ACTIVITY_TTL_MS = 60_000;

export default function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>(() =>
    activityCache && Date.now() - activityCache.at < ACTIVITY_TTL_MS ? activityCache.items : []
  );
  const [loading, setLoading] = useState(
    !(activityCache && Date.now() - activityCache.at < ACTIVITY_TTL_MS)
  );

  useEffect(() => {
    if (activityCache && Date.now() - activityCache.at < ACTIVITY_TTL_MS) {
      setItems(activityCache.items);
      setLoading(false);
      return;
    }

    let cancelled = false;
    void getRecentActivity(12).then((res) => {
      if (cancelled) return;
      if (res.items) {
        activityCache = { items: res.items, at: Date.now() };
        setItems(res.items);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <CardTitle className="text-lg">Team activity</CardTitle>
        </div>
        <CardDescription>
          Recent changes made in MyGoProfile — so everyone stays transparent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading activity…
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recorded activity yet. Replies, posts, and team changes will show up here.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium leading-snug">{item.summary}</p>
                  {item.actorName && (
                    <p className="mt-0.5 text-xs text-muted-foreground">by {item.actorName}</p>
                  )}
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
