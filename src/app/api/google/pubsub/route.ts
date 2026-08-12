import { NextRequest, NextResponse } from "next/server";
import {
  processNewReviewNotification,
  type GbpPubSubNotification,
} from "@/lib/google/process-new-review-notification";

export const runtime = "nodejs";

/**
 * Cloud Pub/Sub push endpoint for GBP notifications.
 * Configure push subscription URL as:
 *   https://mygoprofile.com/api/google/pubsub?token=YOUR_GOOGLE_PUBSUB_VERIFICATION_TOKEN
 */
export async function POST(req: NextRequest) {
  const expected = process.env.GOOGLE_PUBSUB_VERIFICATION_TOKEN || "";
  const provided = req.nextUrl.searchParams.get("token") || "";
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const dataB64 = body?.message?.data;
    if (!dataB64 || typeof dataB64 !== "string") {
      // Ack empty / test messages
      return NextResponse.json({ ok: true, ignored: true });
    }

    const decoded = Buffer.from(dataB64, "base64").toString("utf8");
    let payload: GbpPubSubNotification = {};
    try {
      payload = JSON.parse(decoded);
    } catch {
      console.error("Pub/Sub message not JSON:", decoded.slice(0, 200));
      return NextResponse.json({ ok: true, ignored: true });
    }

    console.info("GBP Pub/Sub notification:", {
      type: payload.type,
      review: payload.review || payload.review_name || payload.reviewName,
      messageId: body?.message?.messageId,
    });

    const result = await processNewReviewNotification(payload);
    // Always 200 so Pub/Sub does not retry forever on "no owner" cases.
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("POST /api/google/pubsub failed:", e);
    // 500 → Pub/Sub retries
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "handler failed" },
      { status: 500 }
    );
  }
}
