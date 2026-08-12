'use server';
/**
 * @fileOverview A Genkit flow for generating an AI-powered summary of business performance.
 *
 * - generatePerformanceSummary - Analyzes performance metrics, reviews, and business info to create a summary.
 * - GeneratePerformanceSummaryInput - The input type for the generatePerformanceSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PerformanceSummaryOutputSchema } from '@/lib/performance-summary';

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
export type GeneratePerformanceSummaryInput = z.infer<
  typeof GeneratePerformanceSummaryInputSchema
>;

const summaryPrompt = ai.definePrompt({
  name: 'performanceSummaryPrompt',
  input: { schema: GeneratePerformanceSummaryInputSchema },
  output: { schema: PerformanceSummaryOutputSchema },
  prompt: `
    You are a business marketing expert analyzing a Google Business Profile.

    Business Name: {{{businessName}}}
    Description: {{{businessDescription}}}
    Current 30-Day Metrics: {{{json currentMetrics}}}
    Previous 30-Day Metrics: {{{json previousMetrics}}}
    Recent Reviews: {{{json recentReviews}}}

    Produce a structured analysis with:
    - performanceInsights: trends compared to the previous 30 days
    - reviewSentiment: overall tone and common themes from reviews
    - recommendations: exactly 3 clear, actionable next steps

    Tone: professional, helpful, and clear. No technical jargon.
    Important: Do not use markdown, headings, bullets, or numbered lists inside the strings.
  `,
});

const generatePerformanceSummaryFlow = ai.defineFlow(
  {
    name: 'generatePerformanceSummaryFlow',
    inputSchema: GeneratePerformanceSummaryInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await summaryPrompt(input);
    if (!output) {
      throw new Error('The AI model did not produce an output.');
    }
    // Persist as JSON so the UI can render structured sections.
    return JSON.stringify(output);
  }
);

export async function generatePerformanceSummary(
  input: GeneratePerformanceSummaryInput
): Promise<string> {
  return generatePerformanceSummaryFlow(input);
}
