
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { deleteReviewReply } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Terminal, MessageSquare, Star, User, Edit, Trash2, ExternalLink, AlertTriangle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import ReplyForm from "./reply-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ReviewListProps {
    locationName: string;
    accountId: string;
    allReviews: Review[];
    isLoading: boolean;
    error: string | null;
}

export interface Reviewer {
  profilePhotoUrl?: string;
  displayName: string;
  isAnonymous: boolean;
}

export interface ReviewReply {
    comment: string;
    updateTime: string;
}

/** Google Reviews API moderation / policy fields (2026). */
export type ReviewReplyState =
  | 'REVIEW_REPLY_STATE_UNSPECIFIED'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | string;

export interface PolicyViolation {
  category?: string;
  description?: string;
  /** Some API shapes nest details differently — keep flexible. */
  [key: string]: unknown;
}

export interface ReviewMediaItem {
  mediaFormat?: "PHOTO" | "VIDEO" | string;
  googleUrl?: string;
  thumbnailUrl?: string;
  sourceUrl?: string;
}

export interface Review {
  name: string;
  reviewId: string;
  reviewer: Reviewer;
  starRating: 'STAR_RATING_UNSPECIFIED' | 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: ReviewReply;
  reviewReplyState?: ReviewReplyState;
  policyViolation?: PolicyViolation | PolicyViolation[];
  reviewReplyUrl?: string;
  reviewMediaItems?: ReviewMediaItem[];
  /** Some API responses use camelCase reviewMediaItem singular array alias */
  reviewMediaItem?: ReviewMediaItem[];
}

const StarRatingDisplay = ({ rating }: { rating: Review['starRating'] }) => {
    const ratingMap = {
        'FIVE': 5,
        'FOUR': 4,
        'THREE': 3,
        'TWO': 2,
        'ONE': 1,
        'STAR_RATING_UNSPECIFIED': 0
    };
    const numericRating = ratingMap[rating] || 0;
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < numericRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

function ReplyStatusBadges({ review }: { review: Review }) {
  const state = (review.reviewReplyState || "").toUpperCase();
  const violations = Array.isArray(review.policyViolation)
    ? review.policyViolation
    : review.policyViolation
      ? [review.policyViolation]
      : [];

  if (!review.reviewReply && !state && violations.length === 0) {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
        Needs response
      </Badge>
    );
  }

  let stateBadge: ReactNode = null;
  if (state.includes("PENDING")) {
    stateBadge = (
      <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-900 border-amber-200">
        <Clock className="h-3 w-3" />
        Reply pending review
      </Badge>
    );
  } else if (state.includes("REJECTED")) {
    stateBadge = (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        Reply rejected
      </Badge>
    );
  } else if (review.reviewReply || state.includes("APPROVED")) {
    stateBadge = (
      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
        Responded
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {stateBadge}
      {violations.length > 0 && (
        <Badge variant="outline" className="gap-1 border-destructive/40 text-destructive">
          <AlertTriangle className="h-3 w-3" />
          Policy issue
        </Badge>
      )}
    </div>
  );
}

function ReviewMediaGallery({ review }: { review: Review }) {
  const media = review.reviewMediaItems || review.reviewMediaItem || [];
  if (!media.length) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {media.slice(0, 6).map((item, idx) => {
        const src = item.thumbnailUrl || item.googleUrl || item.sourceUrl;
        if (!src) return null;
        const isVideo = (item.mediaFormat || "").toUpperCase().includes("VIDEO");
        return (
          <a
            key={idx}
            href={item.googleUrl || item.sourceUrl || src}
            target="_blank"
            rel="noreferrer"
            className="relative h-20 w-20 overflow-hidden rounded-lg border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            {isVideo && (
              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] text-white">
                Video
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}

function PolicyViolationNotice({ review }: { review: Review }) {
  const violations = Array.isArray(review.policyViolation)
    ? review.policyViolation
    : review.policyViolation
      ? [review.policyViolation]
      : [];

  if (violations.length === 0) return null;

  return (
    <Alert variant="destructive" className="mt-3">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Google policy violation</AlertTitle>
      <AlertDescription className="space-y-1">
        {violations.map((v, i) => {
          const category = typeof v.category === "string" ? v.category : null;
          const description =
            typeof v.description === "string"
              ? v.description
              : typeof (v as { reason?: string }).reason === "string"
                ? (v as { reason: string }).reason
                : "This reply was flagged by Google. Edit and resubmit.";
          return (
            <p key={i} className="text-sm">
              {category ? <span className="font-medium">{category}: </span> : null}
              {description}
            </p>
          );
        })}
        {review.reviewReplyUrl && (
          <a
            href={review.reviewReplyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium underline"
          >
            View on Google <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </AlertDescription>
    </Alert>
  );
}


export default function ReviewList({ allReviews, isLoading, error }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(allReviews);
  const [editingReviewName, setEditingReviewName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setReviews(allReviews);
  }, [allReviews]);
  
  const handleReplyUpdate = (reviewName: string, newReply: ReviewReply) => {
    setReviews(currentReviews => {
      const updatedReviews = currentReviews.map(r => {
        if (r.name === reviewName) {
          return { ...r, reviewReply: newReply };
        }
        return r;
      });
      setEditingReviewName(null); // Exit editing mode
      return updatedReviews;
    });
  };

  const handleDeleteReply = async (reviewName: string) => {
    const result = await deleteReviewReply(reviewName);
    if (result.error) {
        toast({
            title: "Error",
            description: `Failed to delete reply: ${result.error}`,
            variant: "destructive"
        });
    } else {
        toast({
            title: "Success",
            description: "Your reply has been deleted."
        });
        setReviews(currentReviews => {
            const updatedReviews = currentReviews.map(r => {
                if (r.name === reviewName) {
                    const { reviewReply, ...rest } = r;
                    return rest as Review;
                }
                return r;
            });
            return updatedReviews;
        });
    }
  }

  const renderContent = () => {
     if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground p-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Fetching reviews...</span>
        </div>
      );
    }

    if (error) {
       return (
            <Alert variant="destructive" className="m-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>API Error</AlertTitle>
                <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
            </Alert>
        );
    }
    
    if (reviews.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                No reviews found for this location.
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            {reviews.map((review) => (
                <Card key={review.reviewId} className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    {review.reviewer.profilePhotoUrl && <AvatarImage src={review.reviewer.profilePhotoUrl} alt={review.reviewer.displayName} />}
                                    <AvatarFallback>
                                        {review.reviewer.isAnonymous ? <User className="h-4 w-4" /> : review.reviewer.displayName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{review.reviewer.displayName}</p>
                                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(review.createTime), { addSuffix: true })}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                               <ReplyStatusBadges review={review} />
                                <StarRatingDisplay rating={review.starRating} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {review.comment && <p className="text-sm text-foreground/80 mb-4">{review.comment}</p>}
                        <ReviewMediaGallery review={review} />
                        
                        {editingReviewName === review.name ? (
                             <ReplyForm 
                                review={review}
                                initialText={review.reviewReply?.comment || ''}
                                onReplyPosted={(newReply) => handleReplyUpdate(review.name, newReply)}
                                onCancel={() => setEditingReviewName(null)}
                            />
                        ) : review.reviewReply ? (
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-sm mb-2">Your reply</p>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{review.reviewReply.comment}</p>
                                        <p className="text-xs text-muted-foreground/80 mt-2">Updated {formatDistanceToNow(new Date(review.reviewReply.updateTime), { addSuffix: true })}</p>
                                        {review.reviewReplyUrl && (
                                          <a
                                            href={review.reviewReplyUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                          >
                                            Open on Google <ExternalLink className="h-3 w-3" />
                                          </a>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingReviewName(review.name)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your reply from the review.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteReply(review.name)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                                <PolicyViolationNotice review={review} />
                            </div>
                        ) : (
                            <ReplyForm 
                                review={review}
                                onReplyPosted={(newReply) => handleReplyUpdate(review.name, newReply)}
                            />
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
  };

  return (
    <Card>
        <CardHeader>
             <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <CardTitle>Reviews</CardTitle>
            </div>
            <CardDescription>
                Recent customer reviews for this location.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
             {renderContent()}
        </CardContent>
    </Card>
  );
}

    
