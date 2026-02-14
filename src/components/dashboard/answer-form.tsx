"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { postAnswer } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface AnswerFormProps {
  questionName: string;
  onAnswerPosted: (newAnswer: any) => void;
}

export default function AnswerForm({ questionName, onAnswerPosted }: AnswerFormProps) {
  const [answerText, setAnswerText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    setIsPosting(true);
    setError(null);

    try {
      const result = await postAnswer(questionName, answerText);
      if (result.error) {
        setError(result.error);
      } else {
        toast({
          title: "Success",
          description: "Your answer has been posted.",
        });
        onAnswerPosted(result.data); 
        setAnswerText("");
      }
    } catch (e: any) {
      setError(e.message || "Failed to post answer.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
            <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPosting || !answerText.trim()}>
          {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Post Answer
        </Button>
      </div>
    </form>
  );
}
