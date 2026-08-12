import { NextRequest, NextResponse } from "next/server";
import { uploadLocationPhotoBytes } from "@/lib/google/media-upload";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const locationName = String(form.get("locationName") || "");
    const description = String(form.get("description") || "");

    if (!locationName) {
      return NextResponse.json({ error: "Location name is required." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Photo file is required." }, { status: 400 });
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      return NextResponse.json({ error: "Please upload a JPG or PNG image." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await uploadLocationPhotoBytes({
      locationName,
      bytes,
      contentType: file.type || "image/jpeg",
      description,
    });

    if ("error" in result && result.error) {
      const status = result.error === "SESSION_EXPIRED" || result.error === "GOOGLE_NOT_CONNECTED" ? 401 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (e: unknown) {
    console.error("POST /api/google/media/upload failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 500 }
    );
  }
}
