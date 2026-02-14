'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered replies to business reviews.
 *
 * - generateReviewReply - A function that generates three distinct tones of replies for a given review.
 * - GenerateReviewReplyInput - The input type for the generateReviewReply function.
 * - GenerateReviewReplyOutput - The return type for the generateReviewReply function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateReviewReplyInputSchema = z.object({
  reviewerName: z.string().describe('The name of the person who left the review.'),
  starRating: z.enum(['STAR_RATING_UNSPECIFIED', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE']).describe('The star rating the reviewer gave.'),
  comment: z.string().optional().describe('The text content of the review.'),
});
export type GenerateReviewReplyInput = z.infer<typeof GenerateReviewReplyInputSchema>;

const GenerateReviewReplyOutputSchema = z.object({
  friendly: z.string().describe('A reply in a friendly, warm, and personal tone.'),
  concise: z.string().describe('A reply that is very short and to the point.'),
  formal: z.string().describe('A reply in a professional and formal tone.'),
});
export type GenerateReviewReplyOutput = z.infer<typeof GenerateReviewReplyOutputSchema>;

const reviewReplyPrompt = ai.definePrompt({
  name: 'reviewReplyPrompt',
  input: { schema: GenerateReviewReplyInputSchema },
  output: { schema: GenerateReviewReplyOutputSchema },
  prompt: `
    You are an expert in customer service for a small business. Your task is to draft three distinct replies to a customer review.
    The business owner will use these as a starting point.

    Review Details:
    - Reviewer Name: {{{reviewerName}}}
    - Star Rating: {{{starRating}}}
    - Comment: {{{comment}}}

    Based on the review details, generate three replies with the following tones:
    1.  **Friendly**: Write a reply that is warm, personal, and conversational. Use the reviewer's name.
    2.  **Concise**: Write a reply that is very short and to the point, while still being polite.
    3.  **Formal**: Write a reply that is professional, polite, and uses formal language suitable for official business communication.

    Address the key points in the review if a comment is provided. If it's a positive review, thank them. If it's a negative review, apologize for their experience and offer to make things right if appropriate.
  `,
});

const generateReviewReplyFlow = ai.defineFlow(
  {
    name: 'generateReviewReplyFlow',
    inputSchema: GenerateReviewReplyInputSchema,
    outputSchema: GenerateReviewReplyOutputSchema,
  },
  async (input) => {
    const { output } = await reviewReplyPrompt(input);
    if (!output) {
      throw new Error('The AI model did not produce an output.');
    }
    return output;
  }
);

export async function generateReviewReply(input: GenerateReviewReplyInput): Promise<GenerateReviewReplyOutput> {
  return generateReviewReplyFlow(input);
}
