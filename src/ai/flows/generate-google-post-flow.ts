'use server';
/**
 * @fileOverview Genkit flow that drafts a Google Business Profile post.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateGooglePostInputSchema = z.object({
  businessName: z.string().describe('The business display name.'),
  category: z.string().optional().describe('Primary Google category.'),
  description: z.string().optional().describe('Existing business description.'),
  locality: z.string().optional().describe('City or locality.'),
  tone: z
    .enum(['friendly', 'professional', 'promotional'])
    .default('friendly')
    .describe('Desired voice for the post.'),
  topicHint: z
    .string()
    .optional()
    .describe('Optional topic the owner wants to post about.'),
});
export type GenerateGooglePostInput = z.infer<typeof GenerateGooglePostInputSchema>;

const GenerateGooglePostOutputSchema = z.object({
  summary: z
    .string()
    .describe('The Google post body, under 1400 characters, ready to publish.'),
  title: z
    .string()
    .optional()
    .describe('Optional short event-style title if useful (under 58 chars).'),
});
export type GenerateGooglePostOutput = z.infer<typeof GenerateGooglePostOutputSchema>;

const googlePostPrompt = ai.definePrompt({
  name: 'googlePostPrompt',
  input: { schema: GenerateGooglePostInputSchema },
  output: { schema: GenerateGooglePostOutputSchema },
  prompt: `
You write Google Business Profile posts for local businesses.
Write ONE post the owner can publish immediately.

Business:
- Name: {{{businessName}}}
- Category: {{{category}}}
- Locality: {{{locality}}}
- Description: {{{description}}}
- Tone: {{{tone}}}
- Topic hint: {{{topicHint}}}

Rules:
- Sound human, specific, and useful — not spammy or full of hashtags.
- 2–4 short paragraphs or a tight paragraph with a clear call to action.
- No markdown, no bullet lists, no emoji overload (0–2 max).
- Stay under 1200 characters.
- If topic hint is empty, invent a timely, evergreen update (welcome message, what makes them special, seasonal invite, or tip).
- Do not invent false promotions, prices, or hours.
`,
});

const generateGooglePostFlow = ai.defineFlow(
  {
    name: 'generateGooglePostFlow',
    inputSchema: GenerateGooglePostInputSchema,
    outputSchema: GenerateGooglePostOutputSchema,
  },
  async (input) => {
    const { output } = await googlePostPrompt(input);
    if (!output?.summary) {
      throw new Error('The AI model did not produce a post.');
    }
    return {
      summary: output.summary.trim().slice(0, 1500),
      title: output.title?.trim().slice(0, 58),
    };
  }
);

export async function generateGooglePost(
  input: GenerateGooglePostInput
): Promise<GenerateGooglePostOutput> {
  return generateGooglePostFlow(input);
}
