import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import {
  exchangeCodeForTokens,
  fetchGoogleUserEmail,
} from "@/lib/google/oauth";
import { encryptSecret } from "@/lib/crypto/tokens";
import { setAccessTokenCookie } from "@/lib/google/access-token";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      `${appUrl()}/connect-google?error=${encodeURIComponent(oauthError)}`
    );
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(
      `${appUrl()}/connect-google?error=invalid_state`
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl()}/login`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        `${appUrl()}/connect-google?error=missing_refresh_token`
      );
    }

    const email = await fetchGoogleUserEmail(tokens.access_token);
    const admin = createServiceClient();

    const { error } = await admin.from("google_connections").upsert(
      {
        user_id: user.id,
        google_account_email: email,
        refresh_token_encrypted: encryptSecret(tokens.refresh_token),
        scopes: (tokens.scope || "").split(" ").filter(Boolean),
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) throw error;

    await setAccessTokenCookie(tokens.access_token, tokens.expires_in || 3500);

    const { logActivity } = await import("@/lib/activity");
    await logActivity({
      action: "google_connected",
      summary: `Connected Google Business Profile${email ? ` (${email})` : ""}`,
      ownerId: user.id,
    });

    return NextResponse.redirect(`${appUrl()}/dashboard/select-locations`);
  } catch (err) {
    console.error("Google OAuth callback failed:", err);
    return NextResponse.redirect(
      `${appUrl()}/connect-google?error=token_exchange_failed`
    );
  }
}
