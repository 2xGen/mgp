import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { decryptSecret, encryptSecret } from "@/lib/crypto/tokens";
import { refreshAccessToken } from "@/lib/google/oauth";

export async function setAccessTokenCookie(token: string, maxAgeSeconds = 3500) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearAccessTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
}

/**
 * Returns a usable Google GBP access token.
 * Owners use their own stored refresh token.
 * Team members use the owner's connection — they never need Google Business access.
 */
export async function getGoogleAccessToken(): Promise<{
  token?: string;
  error?: "AUTH_REQUIRED" | "GOOGLE_NOT_CONNECTED" | "SESSION_EXPIRED" | string;
}> {
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return { error: "AUTH_REQUIRED" };
  }

  const admin = createServiceClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("team_owner_id")
    .eq("id", user.id)
    .maybeSingle();

  const connectionUserId = profile?.team_owner_id || user.id;
  const isActingAsOwner = connectionUserId === user.id;

  // Owners can reuse a short-lived cookie; team members always resolve via owner connection.
  if (isActingAsOwner) {
    const cookieStore = await cookies();
    const cached = cookieStore.get("access_token")?.value;
    if (cached) {
      return { token: cached };
    }
  }

  const { data: connection, error } = await admin
    .from("google_connections")
    .select("refresh_token_encrypted")
    .eq("user_id", connectionUserId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load google connection:", error);
    return { error: error.message };
  }

  if (!connection?.refresh_token_encrypted) {
    return { error: "GOOGLE_NOT_CONNECTED" };
  }

  try {
    const refreshToken = decryptSecret(connection.refresh_token_encrypted);
    const tokens = await refreshAccessToken(refreshToken);

    // Only persist cookie for the account owner (avoids confusing team-member browsers).
    if (isActingAsOwner) {
      await setAccessTokenCookie(tokens.access_token, tokens.expires_in || 3500);
    }

    if (tokens.refresh_token) {
      await admin
        .from("google_connections")
        .update({
          refresh_token_encrypted: encryptSecret(tokens.refresh_token),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", connectionUserId);
    }

    return { token: tokens.access_token };
  } catch (err) {
    console.error("Google token refresh failed:", err);
    return { error: "SESSION_EXPIRED" };
  }
}

export async function hasGoogleConnection(userId: string): Promise<boolean> {
  const admin = createServiceClient();
  const { data } = await admin
    .from("google_connections")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  return Boolean(data?.id);
}

/**
 * Refresh a Google access token for a specific MyGoProfile user (no browser session).
 * Used by Pub/Sub webhooks and background jobs.
 */
export async function getGoogleAccessTokenForUserId(userId: string): Promise<{
  token?: string;
  error?: "GOOGLE_NOT_CONNECTED" | "SESSION_EXPIRED" | string;
}> {
  if (!userId) return { error: "GOOGLE_NOT_CONNECTED" };

  const admin = createServiceClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("team_owner_id")
    .eq("id", userId)
    .maybeSingle();

  const connectionUserId = profile?.team_owner_id || userId;

  const { data: connection, error } = await admin
    .from("google_connections")
    .select("refresh_token_encrypted")
    .eq("user_id", connectionUserId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load google connection:", error);
    return { error: error.message };
  }
  if (!connection?.refresh_token_encrypted) {
    return { error: "GOOGLE_NOT_CONNECTED" };
  }

  try {
    const refreshToken = decryptSecret(connection.refresh_token_encrypted);
    const tokens = await refreshAccessToken(refreshToken);

    if (tokens.refresh_token) {
      await admin
        .from("google_connections")
        .update({
          refresh_token_encrypted: encryptSecret(tokens.refresh_token),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", connectionUserId);
    }

    return { token: tokens.access_token };
  } catch (err) {
    console.error("Google token refresh failed:", err);
    return { error: "SESSION_EXPIRED" };
  }
}
