import { getGoogleAccessToken } from "@/lib/google/access-token";
import { hostImageForGoogleFetch } from "@/lib/google/temp-media";

async function handleGoogleError(response: Response) {
  if (response.status === 401) {
    return { error: "SESSION_EXPIRED" };
  }
  const raw = await response.text();
  let parsed: unknown = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  console.error("Google media API error:", {
    status: response.status,
    bodyPreview: raw.slice(0, 500),
  });
  if (parsed && typeof parsed === "object") {
    return {
      error: `API Error: Google API responded with status: ${response.status}. Full error: ${JSON.stringify(parsed, null, 2)}`,
    };
  }
  return {
    error: `API Error: Google API responded with status: ${response.status}.`,
  };
}

/**
 * Upload a location photo.
 *
 * Prefer Media.Create with sourceUrl — Google's byte-upload + dataRef flow is a
 * known flaky/broken API (often 500 / "Fetching image failed").
 * Local posts must also use sourceUrl; after this succeeds, use data.googleUrl.
 */
export async function uploadLocationPhotoBytes(params: {
  locationName: string;
  bytes: Buffer;
  contentType: string;
  description?: string;
}): Promise<{ success: true; data: any } | { success?: false; error: string }> {
  const auth = await getGoogleAccessToken();
  if (!auth.token) {
    return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
  }
  const token = auth.token;
  const { locationName, bytes, contentType, description } = params;

  if (bytes.byteLength < 10 * 1024) {
    return { error: "Photo must be at least 10KB (Google requirement)." };
  }
  if (bytes.byteLength > 5 * 1024 * 1024) {
    return { error: "Max file size is 5MB." };
  }

  let hosted: { sourceUrl: string; cleanup: () => Promise<void> } | null = null;
  try {
    hosted = await hostImageForGoogleFetch(bytes, contentType || "image/jpeg");

    const createPayload: Record<string, unknown> = {
      mediaFormat: "PHOTO",
      locationAssociation: { category: "ADDITIONAL" },
      sourceUrl: hosted.sourceUrl,
    };
    if (description?.trim()) {
      createPayload.description = description.trim();
    }

    console.info("Google media create via sourceUrl:", {
      locationName,
      sourceHost: (() => {
        try {
          return new URL(hosted.sourceUrl).host;
        } catch {
          return "unknown";
        }
      })(),
      bytes: bytes.byteLength,
    });

    let createRes = await fetch(
      `https://mybusiness.googleapis.com/v4/${locationName}/media`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createPayload),
        cache: "no-store",
      }
    );

    if (createRes.status === 500 || createRes.status === 400) {
      await new Promise((r) => setTimeout(r, 1500));
      createRes = await fetch(
        `https://mybusiness.googleapis.com/v4/${locationName}/media`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createPayload),
          cache: "no-store",
        }
      );
    }

    if (!createRes.ok) {
      const err = await handleGoogleError(createRes);
      return {
        error: `Google rejected the photo. ${err.error} Tip: use a JPG/PNG at least 250×250px and 10KB+.`,
      };
    }

    const data = await createRes.json();
    return { success: true, data };
  } catch (e: unknown) {
    console.error("uploadLocationPhotoBytes failed:", e);
    return {
      error: e instanceof Error ? e.message : "Upload failed.",
    };
  } finally {
    if (hosted) {
      // Give Google a moment to fetch before deleting our temp copy.
      const cleanup = hosted.cleanup;
      setTimeout(() => {
        void cleanup();
      }, 60_000);
    }
  }
}

/**
 * Location photo upload when you already have a public URL.
 */
export async function uploadLocationPhotoFromUrl(params: {
  locationName: string;
  sourceUrl: string;
  description?: string;
}): Promise<{ success: true; data: any } | { success?: false; error: string }> {
  const auth = await getGoogleAccessToken();
  if (!auth.token) {
    return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
  }

  const createPayload: Record<string, unknown> = {
    mediaFormat: "PHOTO",
    locationAssociation: { category: "ADDITIONAL" },
    sourceUrl: params.sourceUrl,
  };
  if (params.description?.trim()) {
    createPayload.description = params.description.trim();
  }

  const createRes = await fetch(
    `https://mybusiness.googleapis.com/v4/${params.locationName}/media`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createPayload),
      cache: "no-store",
    }
  );

  if (!createRes.ok) {
    const err = await handleGoogleError(createRes);
    return { error: `Google rejected the photo. ${err.error}` };
  }

  const data = await createRes.json();
  return { success: true, data };
}
