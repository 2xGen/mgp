'use server';
/**
 * @fileOverview A Genkit flow for generating an AI-powered summary of business performance.
 *
 * - generatePerformanceSummary - Analyzes performance metrics, reviews, and business info to create a summary.
 * - GeneratePerformanceSummaryInput - The input type for the generatePerformanceSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Simplified review type for the prompt
const ReviewSchema = z.object({
  starRating: z.string(),
  comment: z.string().optional(),
});

const GeneratePerformanceSummaryInputSchema = z.object({
  businessName: z.string(),
  businessDescription: z.string().optional(),
  currentMetrics: z.any(),
  previousMetrics: z.any(),
  recentReviews: z.array(ReviewSchema),
});
export type GeneratePerformanceSummaryInput = z.infer<typeof GeneratePerformanceSummaryInputSchema>;

const summaryPrompt = ai.definePrompt({
  name: 'performanceSummaryPrompt',
  input: { schema: GeneratePerformanceSummaryInputSchema },
  output: { format: 'text' },
  prompt: `
    You are a business marketing expert analyzing a Google Business Profile.

    Business Name: {{{businessName}}}
    Description: {{{businessDescription}}}
    Current 30-Day Metrics: {{{json currentMetrics}}}
    Previous 30-Day Metrics: {{{json previousMetrics}}}
    Recent Reviews: {{{json recentReviews}}}
    
    What you must output
    Write a short summary (max 3 paragraphs) that includes:

    Performance insights (trends compared to the previous 30 days).

    Review sentiment analysis (overall tone and common themes).

    Three clear, actionable recommendations for improving performance.

    Tone: professional, helpful, and clear. No technical jargon.
    Format: plain text with simple section headers.
  `,
});

const generatePerformanceSummaryFlow = ai.defineFlow(
  {
    name: 'generatePerformanceSummaryFlow',
    inputSchema: GeneratePerformanceSummaryInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { text } = await summaryPrompt(input);
    return text;
  }
);

export async function generatePerformanceSummary(input: GeneratePerformanceSummaryInput): Promise<string> {
  return generatePerformanceSummaryFlow(input);
}
