import { NextRequest, NextResponse } from "next/server";
import { getTempMedia } from "@/lib/google/temp-media";

export const runtime = "nodejs";

/** Public (no auth) — Google fetches this URL during Media.Create sourceUrl uploads. */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!id || !/^[a-f0-9]{16,64}$/i.test(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const entry = await getTempMedia(id);
  if (!entry) {
    return NextResponse.json({ error: "Not found or expired" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(entry.bytes), {
    status: 200,
    headers: {
      "Content-Type": entry.contentType || "image/jpeg",
      "Cache-Control": "no-store, max-age=0",
      "Content-Length": String(entry.bytes.byteLength),
    },
  });
}
