import { NextRequest, NextResponse } from "next/server";
import { hostImageForGoogleFetch } from "@/lib/google/temp-media";
import { getGoogleAccessToken } from "@/lib/google/access-token";

export const runtime = "nodejs";

/**
 * Host a photo at a public URL for Google localPosts media.sourceUrl.
 * Does NOT create a location Media item (byte upload is flaky; posts require a URL).
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await getGoogleAccessToken();
    if (!auth.token) {
      const status =
        auth.error === "SESSION_EXPIRED" || auth.error === "GOOGLE_NOT_CONNECTED"
          ? 401
          : 400;
      return NextResponse.json(
        { error: auth.error || "GOOGLE_NOT_CONNECTED" },
        { status }
      );
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Photo file is required." }, { status: 400 });
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      return NextResponse.json({ error: "Please upload a JPG or PNG image." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.byteLength < 10 * 1024) {
      return NextResponse.json(
        { error: "Photo must be at least 10KB (Google requirement)." },
        { status: 400 }
      );
    }
    if (bytes.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Max file size is 5MB." }, { status: 400 });
    }

    const hosted = await hostImageForGoogleFetch(bytes, file.type || "image/jpeg");
    // Keep the file available long enough for the user to draft + publish.
    setTimeout(() => {
      void hosted.cleanup();
    }, 30 * 60 * 1000);

    return NextResponse.json({
      success: true,
      sourceUrl: hosted.sourceUrl,
    });
  } catch (e: unknown) {
    console.error("POST /api/google/media/prepare-url failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not prepare image URL." },
      { status: 500 }
    );
  }
}
