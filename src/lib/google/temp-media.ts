import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/admin";

type TempEntry = {
  contentType: string;
  bytes: Buffer;
  expiresAt: number;
};

const globalStore = globalThis as unknown as {
  __mgpTempMedia?: Map<string, TempEntry>;
};

function memoryStore() {
  if (!globalStore.__mgpTempMedia) {
    globalStore.__mgpTempMedia = new Map();
  }
  return globalStore.__mgpTempMedia;
}

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://mygoprofile.com").replace(
    /\/$/,
    ""
  );
}

/** Persist briefly so Google can GET the image (DB row, not Storage bucket). */
export async function putTempMedia(
  bytes: Buffer,
  contentType: string,
  ttlMs = 10 * 60 * 1000
): Promise<string> {
  const id = randomBytes(16).toString("hex");
  const expiresAt = Date.now() + ttlMs;
  memoryStore().set(id, { contentType, bytes, expiresAt });

  try {
    const admin = createServiceClient();
    await admin.from("temp_media_uploads").upsert({
      id,
      content_type: contentType,
      data_base64: bytes.toString("base64"),
      expires_at: new Date(expiresAt).toISOString(),
    });
  } catch (e) {
    // Table may not exist yet — memory still works on a single Node process.
    console.warn("temp_media_uploads persist skipped:", e);
  }

  return id;
}

export async function getTempMedia(id: string): Promise<TempEntry | null> {
  const local = memoryStore().get(id);
  if (local) {
    if (local.expiresAt < Date.now()) {
      memoryStore().delete(id);
    } else {
      return local;
    }
  }

  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("temp_media_uploads")
      .select("content_type, data_base64, expires_at")
      .eq("id", id)
      .maybeSingle();
    if (error || !data?.data_base64) return null;
    if (new Date(data.expires_at).getTime() < Date.now()) {
      await admin.from("temp_media_uploads").delete().eq("id", id);
      return null;
    }
    const entry: TempEntry = {
      contentType: data.content_type || "image/jpeg",
      bytes: Buffer.from(data.data_base64, "base64"),
      expiresAt: new Date(data.expires_at).getTime(),
    };
    memoryStore().set(id, entry);
    return entry;
  } catch {
    return null;
  }
}

export async function deleteTempMedia(id: string) {
  memoryStore().delete(id);
  try {
    const admin = createServiceClient();
    await admin.from("temp_media_uploads").delete().eq("id", id);
  } catch {
    // ignore
  }
}

/**
 * Host image at a URL Google can fetch.
 * Production: our public route. Local/dev: short-lived third-party host
 * (Google's byte-upload API is unreliable / often 500s).
 */
export async function hostImageForGoogleFetch(
  bytes: Buffer,
  contentType: string
): Promise<{ sourceUrl: string; cleanup: () => Promise<void> }> {
  const appUrl = getAppUrl();
  const appIsLocal = /localhost|127\.0\.0\.1/i.test(appUrl);
  const useAppHost =
    process.env.MEDIA_USE_APP_HOST === "1" ||
    (!!process.env.VERCEL && !appIsLocal);

  if (useAppHost || (!appIsLocal && process.env.NODE_ENV === "production")) {
    const id = await putTempMedia(bytes, contentType);
    return {
      sourceUrl: `${appUrl}/api/google/media/public/${id}`,
      cleanup: async () => {
        await deleteTempMedia(id);
      },
    };
  }

  // Dev / localhost: Google cannot reach this machine — bridge via litterbox (1h TTL).
  const sourceUrl = await uploadToLitterbox(bytes, contentType);
  return {
    sourceUrl,
    cleanup: async () => {},
  };
}

async function uploadToLitterbox(
  bytes: Buffer,
  contentType: string
): Promise<string> {
  const ext = contentType.includes("png") ? "png" : "jpg";
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("time", "1h");
  form.append(
    "fileToUpload",
    new Blob([new Uint8Array(bytes)], { type: contentType || "image/jpeg" }),
    `photo.${ext}`
  );

  const res = await fetch(
    "https://litterbox.catbox.moe/resources/internals/api.php",
    { method: "POST", body: form }
  );
  const text = (await res.text()).trim();
  if (!res.ok || !/^https?:\/\//i.test(text)) {
    throw new Error(
      `Could not create a temporary public URL for Google (dev bridge failed: ${text.slice(0, 120) || res.status}).`
    );
  }
  return text;
}
