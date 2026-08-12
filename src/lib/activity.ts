"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

export type ActivityAction =
  | "review_reply_posted"
  | "review_reply_deleted"
  | "post_created"
  | "google_connected"
  | "google_disconnected"
  | "team_invite_created"
  | "team_invite_claimed"
  | "team_invite_removed"
  | "locations_updated";

export async function logActivity(input: {
  action: ActivityAction;
  summary: string;
  locationName?: string | null;
  metadata?: Record<string, unknown>;
  /** When logging on behalf of an owner (e.g. invite create). Defaults to current user / their team owner. */
  ownerId?: string;
}): Promise<void> {
  try {
    const supabaseAuth = await createClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    if (!user) return;

    const admin = createServiceClient();
    let ownerId = input.ownerId;
    if (!ownerId) {
      const { data: profile } = await admin
        .from("profiles")
        .select("team_owner_id")
        .eq("id", user.id)
        .maybeSingle();
      ownerId = profile?.team_owner_id || user.id;
    }

    await admin.from("activity_log").insert({
      owner_id: ownerId,
      actor_id: user.id,
      location_name: input.locationName || null,
      action: input.action,
      summary: input.summary,
      metadata: input.metadata || {},
    });
  } catch (err) {
    // Never block product actions on logging failures.
    console.warn("activity_log write failed:", err);
  }
}

export async function getRecentActivity(limit = 20): Promise<{
  items?: {
    id: string;
    action: string;
    summary: string;
    locationName: string | null;
    createdAt: string;
    actorName: string | null;
  }[];
  error?: string;
}> {
  try {
    const supabaseAuth = await createClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    if (!user) return { error: "Not signed in" };

    const admin = createServiceClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("team_owner_id")
      .eq("id", user.id)
      .maybeSingle();
    const ownerId = profile?.team_owner_id || user.id;

    const { data, error } = await admin
      .from("activity_log")
      .select("id, action, summary, location_name, created_at, actor_id")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const actorIds = [...new Set((data || []).map((r) => r.actor_id).filter(Boolean))];
    let nameById = new Map<string, string>();
    if (actorIds.length > 0) {
      const { data: actors } = await admin
        .from("profiles")
        .select("id, display_name, email")
        .in("id", actorIds as string[]);
      nameById = new Map(
        (actors || []).map((a) => [
          a.id,
          a.display_name || a.email?.split("@")[0] || "Someone",
        ])
      );
    }

    return {
      items: (data || []).map((row) => ({
        id: row.id,
        action: row.action,
        summary: row.summary,
        locationName: row.location_name,
        createdAt: row.created_at,
        actorName: row.actor_id ? nameById.get(row.actor_id) || null : null,
      })),
    };
  } catch (err: unknown) {
    console.error("getRecentActivity failed:", err);
    return {
      error: err instanceof Error ? err.message : "Could not load activity",
    };
  }
}
