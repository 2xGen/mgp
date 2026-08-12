"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { clearAccessTokenCookie } from "@/lib/google/access-token";

/**
 * Owner disconnects Google Business Profile from MyGoProfile.
 * Deletes stored refresh token and clears the short-lived access cookie.
 */
export async function disconnectGoogleBusinessProfile(): Promise<{
  success?: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const admin = createServiceClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("team_owner_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.team_owner_id) {
    return {
      error:
        "Team members can’t disconnect the owner’s Google account. Ask the owner or leave the team.",
    };
  }

  const { error } = await admin
    .from("google_connections")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to disconnect Google:", error);
    return { error: error.message };
  }

  await clearAccessTokenCookie();
  const { logActivity } = await import("@/lib/activity");
  await logActivity({
    action: "google_disconnected",
    summary: "Disconnected Google Business Profile",
    ownerId: user.id,
  });
  return { success: true };
}

export async function getGoogleConnectionStatus(): Promise<{
  connected: boolean;
  email?: string | null;
  connectedAt?: string | null;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { connected: false, error: "Not signed in" };
  }

  const admin = createServiceClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("team_owner_id")
    .eq("id", user.id)
    .maybeSingle();

  const connectionUserId = profile?.team_owner_id || user.id;

  const { data, error } = await admin
    .from("google_connections")
    .select("google_account_email, connected_at")
    .eq("user_id", connectionUserId)
    .maybeSingle();

  if (error) {
    return { connected: false, error: error.message };
  }

  return {
    connected: Boolean(data),
    email: data?.google_account_email ?? null,
    connectedAt: data?.connected_at ?? null,
  };
}
