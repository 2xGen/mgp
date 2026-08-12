"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Terminal, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { postReviewReply } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  generateReviewReply,
  GenerateReviewReplyInput,
  GenerateReviewReplyOutput,
} from "@/ai/flows/generate-review-reply-flow";
import type { Review } from "./review-list";
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
} from "@/components/ui/alert-dialog";

interface ReplyFormProps {
  review: Review;
  onReplyPosted: (newReply: unknown) => void;
  initialText?: string;
  onCancel?: () => void;
}

export default function ReplyForm({
  review,
  onReplyPosted,
  initialText = "",
  onCancel,
}: ReplyFormProps) {
  const [replyText, setReplyText] = useState(initialText);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatedReplies, setGeneratedReplies] =
    useState<GenerateReviewReplyOutput | null>(null);

  const isEditing = !!initialText;

  const handleGenerateReplies = async () => {
    setIsGenerating(true);
    setAiError(null);
    setGeneratedReplies(null);

    const input: GenerateReviewReplyInput = {
      reviewerName: review.reviewer.displayName,
      starRating: review.starRating,
      comment: review.comment,
    };

    try {
      const result = await generateReviewReply(input);
      setGeneratedReplies(result);
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : "Failed to generate AI replies.");
    } finally {
      setIsGenerating(false);
    }
  };

  const postReply = async () => {
    if (!replyText.trim()) return;

    setIsPosting(true);
    setError(null);
    setAiError(null);

    try {
      const result = await postReviewReply(review.name, replyText);
      if (result.error) {
        setError(result.error);
      } else {
        toast({
          title: "Posted to Google",
          description: `Your reply has been ${isEditing ? "updated" : "published"} on your Business Profile.`,
        });
        onReplyPosted(result.data);
        if (!isEditing) {
          setReplyText("");
          setGeneratedReplies(null);
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to post reply.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerateReplies}
        disabled={isGenerating || isPosting}
      >
        {isGenerating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Draft with AI
      </Button>
      <p className="text-xs text-muted-foreground">
        AI only drafts text. Nothing is sent to Google until you review and confirm.
      </p>

      {aiError && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>AI Error</AlertTitle>
          <AlertDescription>
            <pre className="whitespace-pre-wrap">{aiError}</pre>
          </AlertDescription>
        </Alert>
      )}

      {generatedReplies && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Choose a tone (still editable):</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-blue-100 text-blue-800 hover:bg-blue-200"
              onClick={() => setReplyText(generatedReplies.friendly)}
            >
              Friendly
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-purple-100 text-purple-800 hover:bg-purple-200"
              onClick={() => setReplyText(generatedReplies.concise)}
            >
              Concise
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-gray-100 text-gray-800 hover:bg-gray-200"
              onClick={() => setReplyText(generatedReplies.formal)}
            >
              Formal
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply or draft one with AI..."
          className="min-h-[120px]"
          disabled={isPosting}
        />
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>API Error</AlertTitle>
            <AlertDescription>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </AlertDescription>
          </Alert>
        )}
        <div className="flex justify-end gap-2">
          {isEditing && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPosting}
            >
              Cancel
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isPosting || !replyText.trim()}>
                {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update reply" : "Post reply"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Publish this reply on Google?</AlertDialogTitle>
                <AlertDialogDescription>
                  This posts publicly to your Google Business Profile review. You confirm
                  you authorize this response on behalf of the business.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                <AlertDialogAction onClick={() => void postReply()}>
                  Yes, publish to Google
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
