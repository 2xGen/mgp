/** Shared marketing + product plan definitions (wired to Stripe price IDs via env). */

export type PlanId = "starter" | "growth" | "enterprise";

export type BillingInterval = "monthly" | "annual";

export const PLAN_LABELS: Record<PlanId, string> = {
  starter: "Starter",
  growth: "Growth",
  enterprise: "Agency",
};

export const PLAN_LIMITS: Record<
  PlanId,
  { locations: number; teamMembers: number }
> = {
  starter: { locations: 1, teamMembers: 1 },
  growth: { locations: 3, teamMembers: 3 },
  enterprise: { locations: 10, teamMembers: 5 },
};

/** Monthly list price in EUR (display). Stripe products wired later. */
export const PLAN_PRICE_MONTHLY_EUR: Record<PlanId, number> = {
  starter: 29,
  growth: 49,
  enterprise: 99,
};

/** Annual billed monthly-equivalent (2 months free ≈ 17% off). */
export const PLAN_PRICE_ANNUAL_EUR: Record<PlanId, number> = {
  starter: 24,
  growth: 41,
  enterprise: 83,
};

/** Clean yearly totals (2 months free). */
export const PLAN_PRICE_ANNUAL_TOTAL_EUR: Record<PlanId, number> = {
  starter: 290,
  growth: 490,
  enterprise: 990,
};

/** Core toolkit — included on every plan. Trial is shown under the price, not here. */
export const CORE_PLAN_FEATURES = [
  "Profile Health score & diagnosis",
  "Prioritized “what to do next” actions",
  "AI Google post drafts & publish",
  "AI review reply drafts",
  "Review request kit (link, WhatsApp, email, SMS, QR)",
  "Performance insights (this vs prior period)",
  "Team activity log",
] as const;

/** Light, legitimate scale extras — not artificial AI gates. */
export const PLAN_EXTRA_FEATURES: Record<PlanId, string[]> = {
  starter: [],
  growth: ["Location comparison across your profiles"],
  enterprise: [
    "Location comparison across your profiles",
    "Multi-location overview dashboard",
  ],
};

/** @deprecated Prefer CORE_PLAN_FEATURES + PLAN_EXTRA_FEATURES */
export const SHARED_PLAN_FEATURES = CORE_PLAN_FEATURES;

export function planFeatureList(planId: PlanId): string[] {
  const { locations, teamMembers } = PLAN_LIMITS[planId];
  return [
    locations === 1
      ? "1 Google Business location"
      : `Up to ${locations} Google Business locations`,
    teamMembers === 1 ? "1 team seat" : `Up to ${teamMembers} team seats`,
    ...CORE_PLAN_FEATURES,
    ...PLAN_EXTRA_FEATURES[planId],
  ];
}

export function planScaleLine(planId: PlanId): string {
  const { locations, teamMembers } = PLAN_LIMITS[planId];
  const loc = locations === 1 ? "1 location" : `Up to ${locations} locations`;
  const team =
    teamMembers === 1 ? "1 team seat" : `Up to ${teamMembers} team seats`;
  return `${loc} · ${team}`;
}

export const PLAN_BLURBS: Record<PlanId, string> = {
  starter: "For a single business that wants to improve its Google presence.",
  growth: "For owners and small teams managing a few locations.",
  enterprise: "For agencies and operators managing multiple business profiles.",
};

/** Feature comparison matrix for pricing page. */
export type ComparisonCell = true | false | string;

export const PLAN_COMPARISON_ROWS: {
  label: string;
  values: Record<PlanId, ComparisonCell>;
}[] = [
  {
    label: "Locations",
    values: { starter: "1", growth: "3", enterprise: "10" },
  },
  {
    label: "Team seats",
    values: { starter: "1", growth: "3", enterprise: "5" },
  },
  {
    label: "Profile Health & diagnosis",
    values: { starter: true, growth: true, enterprise: true },
  },
  {
    label: "AI recommendations",
    values: { starter: true, growth: true, enterprise: true },
  },
  {
    label: "AI posts",
    values: { starter: true, growth: true, enterprise: true },
  },
  {
    label: "AI review replies",
    values: { starter: true, growth: true, enterprise: true },
  },
  {
    label: "Review request kit",
    values: { starter: true, growth: true, enterprise: true },
  },
  {
    label: "Performance insights",
    values: { starter: true, growth: true, enterprise: true },
  },
  {
    label: "Location comparison",
    values: { starter: false, growth: true, enterprise: true },
  },
  {
    label: "Multi-location overview",
    values: { starter: false, growth: true, enterprise: true },
  },
  {
    label: "Team activity log",
    values: { starter: true, growth: true, enterprise: true },
  },
];
