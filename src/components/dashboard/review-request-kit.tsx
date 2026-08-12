"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, Copy, Check, Mail, MessageCircle, Smartphone, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LocationDetailsData } from "@/app/dashboard/dashboard-provider";
import type { Review } from "./review-list";

const RATING_MAP: Record<string, number> = {
  FIVE: 5,
  FOUR: 4,
  THREE: 3,
  TWO: 2,
  ONE: 1,
  STAR_RATING_UNSPECIFIED: 0,
};

function buildReviewUrl(location: LocationDetailsData): string | null {
  const uri = location.metadata?.newReviewUri;
  if (uri) return uri;
  const placeId = location.metadata?.placeId;
  if (placeId) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
  }
  return null;
}

function defaultMessage(businessName: string, reviewUrl: string) {
  return `Hi! Thanks for choosing ${businessName}. If you had a great experience, would you mind leaving us a quick Google review? It really helps.\n\n${reviewUrl}`;
}

interface ReviewRequestKitProps {
  location: LocationDetailsData;
  reviews: Review[];
}

export default function ReviewRequestKit({ location, reviews }: ReviewRequestKitProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState<"link" | "message" | null>(null);
  const [customerName, setCustomerName] = useState("");

  const reviewUrl = useMemo(() => buildReviewUrl(location), [location]);
  const stats = useMemo(() => {
    const total = reviews?.length || 0;
    const avg =
      total > 0
        ? reviews.reduce((s, r) => s + (RATING_MAP[r.starRating] || 0), 0) / total
        : 0;
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = (reviews || []).filter(
      (r) => new Date(r.createTime).getTime() >= thirtyDaysAgo
    ).length;
    return { total, avg, recent };
  }, [reviews]);

  const message = useMemo(() => {
    if (!reviewUrl) return "";
    const base = defaultMessage(location.title, reviewUrl);
    if (!customerName.trim()) return base;
    return `Hi ${customerName.trim()}! Thanks for choosing ${location.title}. If you had a great experience, would you mind leaving us a quick Google review? It really helps.\n\n${reviewUrl}`;
  }, [location.title, reviewUrl, customerName]);

  const qrSrc = reviewUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(reviewUrl)}`
    : null;

  const copyText = async (text: string, kind: "link" | "message") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      toast({ title: "Copied", description: kind === "link" ? "Review link copied." : "Message copied." });
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Select and copy manually.", variant: "destructive" });
    }
  };

  if (!reviewUrl) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Get more reviews</CardTitle>
          </div>
          <CardDescription>
            We couldn&apos;t find a Google review link for this location yet. Reconnect Google or
            open your profile in Search to confirm the place is verified.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const encodedMsg = encodeURIComponent(message);
  const whatsappHref = `https://wa.me/?text=${encodedMsg}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(`Quick review for ${location.title}`)}&body=${encodedMsg}`;
  const smsHref = `sms:?&body=${encodedMsg}`;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <CardTitle className="text-lg">Get more reviews</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Share a ready-made request — WhatsApp, email, SMS, or QR.
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{stats.avg ? stats.avg.toFixed(1) : "—"}★</span>
            {" · "}
            {stats.total} total
            {stats.recent > 0 && (
              <span className="text-emerald-700"> · +{stats.recent} this month</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer-name">Customer name (optional)</Label>
          <Input
            id="customer-name"
            placeholder="e.g. Sarah"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="review-message">Message</Label>
          <Textarea id="review-message" value={message} readOnly rows={5} className="resize-none text-sm" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => copyText(reviewUrl, "link")}>
            {copied === "link" ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            Copy link
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => copyText(message, "message")}>
            {copied === "message" ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            Copy message
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-1.5 h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <a href={emailHref}>
              <Mail className="mr-1.5 h-4 w-4" />
              Email
            </a>
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <a href={smsHref}>
              <Smartphone className="mr-1.5 h-4 w-4" />
              SMS
            </a>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <QrCode className="mr-1.5 h-4 w-4" />
                QR code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Review QR code</DialogTitle>
                <DialogDescription>
                  Print this or show it at checkout so customers can leave a Google review in one scan.
                </DialogDescription>
              </DialogHeader>
              {qrSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrSrc}
                  alt="QR code linking to Google review"
                  className="mx-auto rounded-lg border bg-white p-3"
                  width={220}
                  height={220}
                />
              )}
              <p className="break-all text-center text-xs text-muted-foreground">{reviewUrl}</p>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
