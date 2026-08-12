import { z } from 'zod';

export const PerformanceSummaryOutputSchema = z.object({
  performanceInsights: z
    .string()
    .describe(
      '2-4 sentences on performance trends vs the previous 30 days. Plain prose, no markdown.'
    ),
  reviewSentiment: z
    .string()
    .describe(
      '2-4 sentences on overall review tone and common themes. Plain prose, no markdown.'
    ),
  recommendations: z
    .array(z.string())
    .min(3)
    .max(3)
    .describe(
      'Exactly three short, actionable recommendations. Plain prose, no markdown or numbering.'
    ),
});

export type PerformanceSummaryOutput = z.infer<typeof PerformanceSummaryOutputSchema>;

const SECTION_ALIASES: Record<string, keyof Omit<PerformanceSummaryOutput, 'recommendations'>> = {
  'performance insights': 'performanceInsights',
  'performance insight': 'performanceInsights',
  'review sentiment analysis': 'reviewSentiment',
  'review sentiment': 'reviewSentiment',
  'sentiment analysis': 'reviewSentiment',
};

function normalizeHeading(line: string): string {
  return line
    .replace(/^#{1,6}\s+/, '')
    .replace(/\*\*/g, '')
    .replace(/[:：]\s*$/, '')
    .trim()
    .toLowerCase();
}

function isRecommendationsHeading(line: string): boolean {
  const n = normalizeHeading(line);
  return (
    n === 'actionable recommendations' ||
    n === 'recommendations' ||
    n === 'what to do next' ||
    n === 'next steps'
  );
}

function splitRecommendations(text: string): string[] {
  const cleaned = text.replace(/\*\*/g, '').trim();
  if (!cleaned) return [];

  // Split on "1. ", "2) ", or "1:" whether on new lines or inline.
  const parts = cleaned
    .split(/(?:^|\s)(?=\d+[\.\)\:]\s+)/)
    .map((p) => p.replace(/^\d+[\.\)\:]\s+/, '').trim())
    .filter(Boolean);

  if (parts.length >= 2) return parts.slice(0, 5);

  // Fallback: bullet lines
  const bullets = cleaned
    .split(/\n+/)
    .map((l) => l.replace(/^[-*•]\s+/, '').trim())
    .filter(Boolean);
  if (bullets.length >= 2) return bullets.slice(0, 5);

  return [cleaned];
}

/** Convert legacy markdown / plain-text AI summaries into structured sections. */
export function parseLegacyPerformanceSummary(raw: string): PerformanceSummaryOutput | null {
  const text = raw.replace(/\r\n/g, '\n').trim();
  if (!text) return null;

  const lines = text.split('\n').map((l) => l.trim());
  let performanceInsights = '';
  let reviewSentiment = '';
  let recommendationsRaw = '';
  let mode: 'none' | 'performance' | 'sentiment' | 'recommendations' = 'none';
  const buffer: string[] = [];

  const flush = () => {
    const body = buffer.join(' ').replace(/\s+/g, ' ').trim();
    buffer.length = 0;
    if (!body) return;
    if (mode === 'performance') performanceInsights = body;
    else if (mode === 'sentiment') reviewSentiment = body;
    else if (mode === 'recommendations') recommendationsRaw = body;
  };

  for (const line of lines) {
    if (!line) continue;

    if (isRecommendationsHeading(line)) {
      flush();
      mode = 'recommendations';
      continue;
    }

    const alias = SECTION_ALIASES[normalizeHeading(line)];
    if (alias === 'performanceInsights') {
      flush();
      mode = 'performance';
      continue;
    }
    if (alias === 'reviewSentiment') {
      flush();
      mode = 'sentiment';
      continue;
    }

    // Standalone title-case headers without aliases (short lines, no period)
    if (
      line.length < 60 &&
      !/[.!?]$/.test(line) &&
      !/^\d+[\.\)\:]/.test(line) &&
      /^[A-Z]/.test(line.replace(/^#+\s*/, ''))
    ) {
      const n = normalizeHeading(line);
      if (n.includes('performance')) {
        flush();
        mode = 'performance';
        continue;
      }
      if (n.includes('sentiment') || n.includes('review')) {
        flush();
        mode = 'sentiment';
        continue;
      }
      if (n.includes('recommend') || n.includes('action')) {
        flush();
        mode = 'recommendations';
        continue;
      }
    }

    if (mode === 'none') {
      // Preamble before first header → treat as performance
      mode = 'performance';
    }
    buffer.push(line.replace(/^#+\s+/, '').replace(/\*\*/g, ''));
  }
  flush();

  const recommendations = splitRecommendations(recommendationsRaw);
  if (!performanceInsights && !reviewSentiment && recommendations.length === 0) {
    return null;
  }

  return {
    performanceInsights:
      performanceInsights || 'No clear performance trend was identified from the available data.',
    reviewSentiment:
      reviewSentiment || 'Not enough recent review detail to summarize sentiment.',
    recommendations:
      recommendations.length > 0
        ? recommendations.slice(0, 5)
        : ['Keep posting weekly updates on your Google Business Profile.'],
  };
}

/** Parse stored summary (JSON preferred; legacy markdown/plain text supported). */
export function parsePerformanceSummary(raw: string): PerformanceSummaryOutput | null {
  try {
    const parsed = JSON.parse(raw);
    const result = PerformanceSummaryOutputSchema.safeParse(parsed);
    if (result.success) return result.data;
  } catch {
    // legacy plain text / markdown
  }
  return parseLegacyPerformanceSummary(raw);
}

export function isStructuredPerformanceSummary(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw);
    return PerformanceSummaryOutputSchema.safeParse(parsed).success;
  } catch {
    return false;
  }
}
