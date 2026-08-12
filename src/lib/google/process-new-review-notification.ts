import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/admin";
import { getGoogleAccessTokenForUserId } from "@/lib/google/access-token";
import NewReviewEmail from "@/emails/new-review-email";

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://mygoprofile.com").replace(
    /\/$/,
    ""
  );
}

function starLabel(rating: string | undefined) {
  const map: Record<string, string> = {
    ONE: "1★",
    TWO: "2★",
    THREE: "3★",
    FOUR: "4★",
    FIVE: "5★",
  };
  return (rating && map[rating]) || rating || "New review";
}

function locationIdFromResource(name: string | undefined) {
  if (!name) return null;
  const parts = name.split("/");
  const idx = parts.indexOf("locations");
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return parts[parts.length - 1] || null;
}

function accountIdFromResource(name: string | undefined) {
  if (!name) return null;
  const parts = name.split("/");
  const idx = parts.indexOf("accounts");
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return null;
}

export type GbpPubSubNotification = {
  type?: string;
  location?: string;
  review?: string;
  location_name?: string;
  review_name?: string;
  locationName?: string;
  reviewName?: string;
};

export async function processNewReviewNotification(
  payload: GbpPubSubNotification
): Promise<{ handled: boolean; reason?: string }> {
  const type = payload.type || "";
  if (type && type !== "NEW_REVIEW") {
    return { handled: false, reason: `ignored type ${type}` };
  }

  const reviewName =
    payload.review || payload.review_name || payload.reviewName || "";
  const locationName =
    payload.location ||
    payload.location_name ||
    payload.locationName ||
    (reviewName.includes("/reviews/")
      ? reviewName.split("/reviews/")[0]
      : "");

  if (!reviewName) {
    return { handled: false, reason: "missing review name" };
  }

  const admin = createServiceClient();

  const { data: already } = await admin
    .from("review_notification_emails")
    .select("review_name")
    .eq("review_name", reviewName)
    .maybeSingle();
  if (already) {
    return { handled: true, reason: "already emailed" };
  }

  const locId = locationIdFromResource(locationName || reviewName);
  const acctId = accountIdFromResource(locationName || reviewName);

  let ownerRow:
    | { user_id: string; location_name: string; title: string | null }
    | null = null;

  if (locId) {
    const candidates = [
      `locations/${locId}`,
      acctId ? `accounts/${acctId}/locations/${locId}` : null,
    ].filter((v): v is string => Boolean(v));

    const { data: byName } = await admin
      .from("managed_locations")
      .select("user_id, location_name, title")
      .in("location_name", candidates)
      .limit(1)
      .maybeSingle();
    ownerRow = byName;

    if (!ownerRow) {
      const { data: bySuffix } = await admin
        .from("managed_locations")
        .select("user_id, location_name, title")
        .like("location_name", `%/locations/${locId}`)
        .limit(1)
        .maybeSingle();
      ownerRow = bySuffix;
    }
  }

  if (!ownerRow && acctId) {
    const { data } = await admin
      .from("managed_locations")
      .select("user_id, location_name, title")
      .or(`account_id.eq.accounts/${acctId},account_id.eq.${acctId}`)
      .limit(1)
      .maybeSingle();
    ownerRow = data;
  }

  if (!ownerRow?.user_id) {
    console.warn("NEW_REVIEW: no managed location owner for", reviewName);
    return { handled: false, reason: "no owner mapping" };
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("id, email, display_name, team_owner_id")
    .eq("id", ownerRow.user_id)
    .maybeSingle();

  // Email the account owner (team members map to owner connection; prefer owner email).
  let emailTo = profile?.email || null;
  let displayName = profile?.display_name || null;
  if (profile?.team_owner_id) {
    const { data: ownerProfile } = await admin
      .from("profiles")
      .select("email, display_name")
      .eq("id", profile.team_owner_id)
      .maybeSingle();
    emailTo = ownerProfile?.email || emailTo;
    displayName = ownerProfile?.display_name || displayName;
  }

  if (!emailTo) {
    return { handled: false, reason: "owner has no email" };
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing; skipping new review email");
    return { handled: false, reason: "resend not configured" };
  }

  // Fetch review details with owner's Google token
  let starRating = "New review";
  let reviewerName = "A customer";
  let comment = "";
  let businessName = ownerRow.title || "Your business";

  const auth = await getGoogleAccessTokenForUserId(ownerRow.user_id);
  if (auth.token) {
    try {
      const res = await fetch(
        `https://mybusiness.googleapis.com/v4/${reviewName}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const review = await res.json();
        starRating = starLabel(review.starRating);
        reviewerName =
          review.reviewer?.displayName ||
          review.reviewer?.profilePhotoUrl ||
          "A customer";
        comment = review.comment || "";
      }
    } catch (e) {
      console.error("Failed to fetch review details:", e);
    }
  }

  const firstName = displayName?.trim().split(/\s+/)[0] || "there";
  const appUrl = getAppUrl();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error: sendError } = await resend.emails.send({
    from:
      process.env.EMAIL_FROM || "MyGoProfile <notifications@mygoprofile.com>",
    to: [emailTo],
    subject: `${starRating} new review for ${businessName}`,
    react: NewReviewEmail({
      userFirstname: firstName,
      businessName,
      starRating,
      reviewerName,
      comment,
      appUrl,
    }),
    text: [
      `Hi ${firstName},`,
      "",
      `${businessName} received a new Google review (${starRating}) from ${reviewerName}.`,
      "",
      comment || "(No written comment)",
      "",
      `Reply in MyGoProfile: ${appUrl}/dashboard`,
    ].join("\n"),
  });

  if (sendError) {
    console.error("Failed to send new review email:", sendError);
    return { handled: false, reason: "email send failed" };
  }

  await admin.from("review_notification_emails").upsert({
    review_name: reviewName,
    user_id: ownerRow.user_id,
    location_name: ownerRow.location_name,
    sent_at: new Date().toISOString(),
  });

  return { handled: true };
}
