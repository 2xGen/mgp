
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Terminal, HelpCircle, ThumbsUp, User, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import AnswerForm from "./answer-form";
import { Badge } from "@/components/ui/badge";

interface QuestionListProps {
    locationName: string;
    allQuestions: Question[];
    isLoading: boolean;
    error: string | null;
}

export interface Answer {
  name: string;
  authorDisplayName: string;
  text: string;
  upvoteCount: number;
  createTime: string;
  updateTime: string;
}

export interface Question {
  name: string;
  authorDisplayName: string;
  text: string;
  upvoteCount: number;
  createTime: string;
  answers: Answer[];
  totalAnswerCount: number;
}

export default function QuestionList({ allQuestions, isLoading, error }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>(allQuestions);

  useEffect(() => {
    setQuestions(allQuestions);
  }, [allQuestions]);
  
  const handleAnswerPosted = (questionName: string, newAnswer: Answer) => {
    setQuestions(currentQuestions => {
        if (!currentQuestions) return [];
        
        const updatedQuestions = currentQuestions.map(q => {
            if (q.name === questionName) {
                // The upsert logic means the new answer is the only one in the array
                // for owner replies. We will just add it for immediate UI feedback.
                const newAnswers = [...(q.answers || []), newAnswer];
                return { ...q, answers: newAnswers };
            }
            return q;
        });

        return updatedQuestions;
    });
  };
  
  const hasOwnerAnswer = (answers: Answer[]) => {
      // The API doesn't give a clear flag for owner, but authorDisplayName is null for owner replies.
      // This is based on observation and might need adjustment if the API changes.
      return answers?.some(a => a.authorDisplayName == null);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Fetching Q&amp;A...</span>
        </div>
      );
    }
    
    return (
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Feature Temporarily Unavailable</AlertTitle>
            <AlertDescription>
                Google has deprecated the API used for this feature. We are working on a new way to bring Q&A management back to your dashboard.
            </AlertDescription>
        </Alert>
    );

  }

  return (
    <Card>
      <CardHeader>
         <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <CardTitle>Questions &amp; Answers</CardTitle>
        </div>
        <CardDescription>
          Customer questions and your answers from this location's profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
