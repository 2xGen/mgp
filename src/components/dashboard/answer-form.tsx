"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { postAnswer } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
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

interface AnswerFormProps {
  questionName: string;
  onAnswerPosted: (newAnswer: unknown) => void;
}

export default function AnswerForm({ questionName, onAnswerPosted }: AnswerFormProps) {
  const [answerText, setAnswerText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const postAnswerToGoogle = async () => {
    if (!answerText.trim()) return;

    setIsPosting(true);
    setError(null);

    try {
      const result = await postAnswer(questionName, answerText);
      if (result.error) {
        setError(result.error);
      } else {
        toast({
          title: "Posted to Google",
          description: "Your answer is live on your Business Profile Q&A.",
        });
        onAnswerPosted(result.data);
        setAnswerText("");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to post answer.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <Textarea
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        placeholder="Write your answer..."
        className="min-h-[100px]"
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
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isPosting || !answerText.trim()}>
              {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post answer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Publish this answer on Google?</AlertDialogTitle>
              <AlertDialogDescription>
                This posts publicly to your Google Business Profile Q&A. You confirm you
                authorize this answer on behalf of the business.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep editing</AlertDialogCancel>
              <AlertDialogAction onClick={() => void postAnswerToGoogle()}>
                Yes, publish to Google
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
