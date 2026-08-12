export type PlanId = "starter" | "growth" | "enterprise";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "cancelled"
  | "incomplete"
  | "past_due"
  | "unpaid"
  | null;

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  team_owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  planId: PlanId;
  status: SubscriptionStatus;
  trial_end: string | null;
  current_period_end: string | null;
  cancel_at_period_end?: boolean;
  /** True once Checkout created a Stripe subscription (card on file). */
  hasStripeSubscription?: boolean;
}

export interface ManagedLocation {
  id: string;
  user_id: string;
  location_name: string;
  account_id: string | null;
  title: string | null;
  emoji: string | null;
  date_added: string;
}

export interface Invite {
  id: string;
  owner_id: string;
  name: string | null;
  invite_code: string;
  location_names: string[];
  status: "pending" | "claimed" | "revoked";
  claimed_by: string | null;
  created_at: string;
}

export type UserRole = "owner" | "teamMember" | null;
