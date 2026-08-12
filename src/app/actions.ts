
"use server";

import { createServiceClient } from "@/lib/supabase/admin";
import type { ManagedLocation } from "./dashboard/select-locations/page";
import type { Subscription, SubscriptionStatus } from "@/lib/types";
import { addDays } from "date-fns";
import { randomBytes } from "crypto";
import { getStripe, getStripePriceId, planIdFromStripePriceId } from "@/lib/stripe";
import type { BillingInterval } from "@/lib/plans";
import Stripe from "stripe";
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome-email';
import SubscriptionActiveEmail from "@/emails/subscription-active-email";
import SubscriptionCancelledEmail from "@/emails/subscription-cancelled-email";
import NewUserAdminNotificationEmail from "@/emails/new-user-admin-notification";
import {
  getGoogleAccessToken,
  setAccessTokenCookie,
} from "@/lib/google/access-token";

export type { Subscription, SubscriptionStatus };

async function requireGoogleToken(): Promise<
  { token: string; error?: undefined } | { token?: undefined; error: string }
> {
  const result = await getGoogleAccessToken();
  if (!result.token) {
    return { error: result.error || "GOOGLE_NOT_CONNECTED" };
  }
  return { token: result.token };
}

const handleApiError = async (response: Response) => {
    if (response.status === 401) {
        return { error: "SESSION_EXPIRED" };
    }

    const raw = await response.text();
    let parsed: unknown = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      // Google sometimes returns HTML error pages (proxy/gateway) instead of JSON.
      parsed = null;
    }

    console.error("Google API Error:", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      bodyPreview: raw.slice(0, 500),
      parsed,
    });

    if (parsed && typeof parsed === "object") {
      return {
        error: `API Error: Google API responded with status: ${response.status}. Full error: ${JSON.stringify(parsed, null, 2)}`,
      };
    }

    const hint =
      response.status === 403
        ? "Permission denied — check Google Business Profile access."
        : response.status === 404
          ? "Resource not found."
          : response.status === 429
            ? "Google rate limit hit — try again in a moment."
            : response.status >= 500
              ? "Google is temporarily unavailable."
              : "Unexpected non-JSON error response from Google.";

    return { error: `API Error: ${response.status} — ${hint}` };
};

export async function setToken(token: string) {
  await setAccessTokenCookie(token);
}

export async function fetchAccounts() {
  const auth = await requireGoogleToken();
  if (auth.error || !auth.token) {
    return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
  }
  const token = auth.token;

  try {
    const response = await fetch(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return handleApiError(response);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch accounts:", error);
    return { error: error.message || "An unknown error occurred during fetch" };
  }
}


export async function fetchLocations(accountId: string) {
    const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
    if (!accountId) {
        return { error: "Account ID is required." };
    }
    try {
        const url = new URL(`https://mybusinessbusinessinformation.googleapis.com/v1/${accountId}/locations`);
        url.searchParams.append('readMask', 'name,title');
        
        const response = await fetch(
            url.toString(),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            return handleApiError(response);
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Failed to fetch locations:", error);
        return { error: error.message || "An unknown error occurred during fetch" };
    }
}

export async function fetchLocationDetails(locationName: string) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!locationName) {
    return { error: "Location name is required." };
  }

  try {
    const url = new URL(`https://mybusinessbusinessinformation.googleapis.com/v1/${locationName}`);
    url.searchParams.append('readMask', 'name,title,storefront_address,website_uri,phoneNumbers,categories,profile,serviceArea,regularHours,metadata');
    
    const response = await fetch(
        url.toString(),
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        return handleApiError(response);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
      console.error("Failed to fetch location details:", error);
      return { error: error.message || "An unknown error occurred during fetch" };
  }
}

export async function updateLocation(locationName: string, updateData: any, updateMask: string[]) {
    const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
    if (!locationName) {
        return { error: "Location name is required." };
    }
    try {
        const url = new URL(`https://mybusinessbusinessinformation.googleapis.com/v1/${locationName}`);
        url.searchParams.append('updateMask', updateMask.join(','));
        
        const response = await fetch(url.toString(), {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            return handleApiError(response);
        }
        const data = await response.json();
        return { success: true, data };
    } catch (error: any) {
        console.error('Failed to update location:', error);
        return { error: error.message || 'An unknown error occurred during update' };
    }
}


export async function fetchLocationPerformance(locationName: string, startDateStr?: string, endDateStr?: string) {
    const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
    if (!locationName) {
        return { error: "Location name is required." };
    }

    let startDateObj: Date;
    let endDateObj: Date;

    if (startDateStr && endDateStr) {
        startDateObj = new Date(startDateStr);
        endDateObj = new Date(endDateStr);
    } else {
        endDateObj = new Date();
        startDateObj = new Date();
        startDateObj.setDate(endDateObj.getDate() - 30);
    }
    
    const format_date = (date: Date) => ({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
    });

    const startDate = format_date(startDateObj);
    const endDate = format_date(endDateObj);

    const metricsToFetch = [
        "WEBSITE_CLICKS",
        "CALL_CLICKS",
        "BUSINESS_DIRECTION_REQUESTS",
        "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
        "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
        "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
        "BUSINESS_IMPRESSIONS_MOBILE_SEARCH"
    ];

    try {
        const url = new URL(`https://businessprofileperformance.googleapis.com/v1/${locationName}:fetchMultiDailyMetricsTimeSeries`);
        metricsToFetch.forEach(metric => url.searchParams.append('dailyMetrics', metric));
        url.searchParams.append('dailyRange.startDate.year', startDate.year.toString());
        url.searchParams.append('dailyRange.startDate.month', startDate.month.toString());
        url.searchParams.append('dailyRange.startDate.day', startDate.day.toString());
        url.searchParams.append('dailyRange.endDate.year', endDate.year.toString());
        url.searchParams.append('dailyRange.endDate.month', endDate.month.toString());
        url.searchParams.append('dailyRange.endDate.day', endDate.day.toString());
        
        const response = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return handleApiError(response);
        }

        const data = await response.json();
        return { success: true, data: data.multiDailyMetricTimeSeries || [] };

    } catch (error: any) {
        console.error("Failed to fetch location performance:", error);
        return { error: error.message || "An unknown error occurred during fetch" };
    }
}

export async function fetchSearchKeywords(locationName: string) {
    const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
    if (!locationName) {
        return { error: "Location name is required." };
    }

    try {
        // The API returns monthly data for the previous full month.
        const today = new Date();
        const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth);
        lastDayOfPreviousMonth.setDate(lastDayOfPreviousMonth.getDate() - 1);
        
        const year = lastDayOfPreviousMonth.getFullYear();
        const month = lastDayOfPreviousMonth.getMonth() + 1; // getMonth() is 0-indexed

        const url = new URL(`https://businessprofileperformance.googleapis.com/v1/${locationName}/searchkeywords/impressions/monthly`);
        
        url.searchParams.append('monthlyRange.startMonth.year', year.toString());
        url.searchParams.append('monthlyRange.startMonth.month', month.toString());
        url.searchParams.append('monthlyRange.endMonth.year', year.toString());
        url.searchParams.append('monthlyRange.endMonth.month', month.toString());

        const response = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return handleApiError(response);
        }

        const data = await response.json();
        return { success: true, data: data };

    } catch (error: any) {
        console.error("Failed to fetch search keywords:", error);
        return { error: error.message || "An unknown error occurred during fetch" };
    }
}

export async function fetchReviews(accountId: string, locationId: string) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!accountId || !locationId) {
    return { error: "Account and Location IDs are required." };
  }

  try {
    const url = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch reviews:", error);
    return { error: error.message || "An unknown error occurred during fetch" };
  }
}

export async function postReviewReply(reviewName: string, replyText: string) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!reviewName) {
    return { error: "Review name is required." };
  }
  if (!replyText || replyText.trim().length === 0) {
    return { error: "Reply text cannot be empty." };
  }

  try {
    const url = `https://mybusiness.googleapis.com/v4/${reviewName}/reply`;
    const payload = {
      comment: replyText,
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        return handleApiError(response);
    }

    const data = await response.json();
    const { logActivity } = await import("@/lib/activity");
    await logActivity({
      action: "review_reply_posted",
      summary: "Posted a review reply to Google",
      locationName: reviewName.split("/reviews/")[0] || null,
    });
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to post reply:", error);
    return { error: error.message || "An unknown error occurred during posting" };
  }
}

export async function deleteReviewReply(reviewName: string) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!reviewName) {
    return { error: "Review name is required." };
  }

  try {
    const url = `https://mybusiness.googleapis.com/v4/${reviewName}/reply`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        return handleApiError(response);
    }
    
    // A successful DELETE returns an empty response body
    const { logActivity } = await import("@/lib/activity");
    await logActivity({
      action: "review_reply_deleted",
      summary: "Deleted a review reply on Google",
      locationName: reviewName.split("/reviews/")[0] || null,
    });
    return { success: true };

  } catch (error: any) {
    console.error("Failed to delete reply:", error);
    return { error: error.message || "An unknown error occurred during deletion" };
  }
}


export async function fetchQuestions(locationName: string) {
  // Q&A API is deprecated as of Nov 3, 2023.
  // This function will now return an empty success state to avoid breaking changes in callers.
  console.warn("fetchQuestions is called, but the My Business Q&A API is deprecated. Returning empty list.");
  return { success: true, data: { questions: [] } };
}

/**
 * One client round-trip for the location overview (avoids 5–6 separate POSTs).
 * Google calls still run in parallel on the server.
 */
export async function loadLocationDashboardBundle(locationName: string, accountId: string) {
  if (!locationName || !accountId) {
    return { error: "Location and account are required." };
  }

  const locationId = locationName.includes("/")
    ? locationName.split("/").pop()!
    : locationName;
  const accountIdNum = accountId.includes("/") ? accountId.split("/").pop()! : accountId;
  const fullLocationPath = `accounts/${accountIdNum}/locations/${locationId}`;
  // Business Information API uses locations/{id} (or accounts/.../locations/... depending on caller).
  const detailsName = locationName.startsWith("locations/")
    ? locationName
    : locationName.startsWith("accounts/")
      ? `locations/${locationId}`
      : `locations/${locationName}`;

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const currentEnd = new Date(now);
  const currentStart = new Date(now - 29 * dayMs);
  const previousEnd = new Date(now - 30 * dayMs);
  const previousStart = new Date(now - 59 * dayMs);

  const [detailsResult, currentPerfResult, previousPerfResult, postsResult, reviewsResult] =
    await Promise.all([
      fetchLocationDetails(detailsName),
      fetchLocationPerformance(
        detailsName,
        currentStart.toISOString(),
        currentEnd.toISOString()
      ),
      fetchLocationPerformance(
        detailsName,
        previousStart.toISOString(),
        previousEnd.toISOString()
      ),
      fetchLocalPosts(fullLocationPath),
      fetchReviews(accountIdNum, locationId),
    ]);

  const firstError = [
    detailsResult,
    currentPerfResult,
    previousPerfResult,
    postsResult,
    reviewsResult,
  ].find((r) => r && typeof r === "object" && "error" in r && (r as { error?: string }).error);

  if (firstError && "error" in firstError && firstError.error) {
    return { error: firstError.error };
  }

  const allReviews = (reviewsResult as { data?: { reviews?: unknown[] } }).data?.reviews || [];

  return {
    success: true,
    data: {
      details: detailsResult,
      currentPerformance: (currentPerfResult as { data?: unknown }).data,
      previousPerformance: (previousPerfResult as { data?: unknown }).data,
      posts: (postsResult as { data?: { localPosts?: unknown[] } }).data?.localPosts || [],
      reviews: allReviews,
      questions: [] as unknown[],
      currentStart: currentStart.toISOString(),
      currentEnd: currentEnd.toISOString(),
      previousStart: previousStart.toISOString(),
      previousEnd: previousEnd.toISOString(),
    },
  };
}

export async function postAnswer(questionName: string, text: string) {
  // Q&A API is deprecated.
  console.warn("postAnswer is called, but the My Business Q&A API is deprecated. This action will have no effect.");
  return { error: "The Google My Business Q&A API is no longer supported." };
}

export async function fetchMedia(locationName: string, pageToken?: string) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!locationName) {
    return { error: "Location name is required." };
  }

  try {
    const url = new URL(`https://mybusiness.googleapis.com/v4/${locationName}/media`);
    url.searchParams.append('pageSize', '100');
    if (pageToken) {
      url.searchParams.append('pageToken', pageToken);
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch media:", error);
    return { error: error.message || "An unknown error occurred." };
  }
}

export async function deleteMedia(mediaName: string) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!mediaName) {
    return { error: "Media name is required to delete." };
  }

  try {
    const url = `https://mybusiness.googleapis.com/v4/${mediaName}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        return handleApiError(response);
    }

    return { success: true };
    
  } catch (error: any) {
    console.error("Failed to delete media item:", error);
    return { error: error.message || "An unknown error occurred during media deletion" };
  }
}

export async function fetchLocalPosts(locationName: string, pageToken?: string) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!locationName) {
    return { error: "Location name is required." };
  }

  try {
    const url = new URL(`https://mybusiness.googleapis.com/v4/${locationName}/localPosts`);
    url.searchParams.append('pageSize', '100');
    if (pageToken) {
      url.searchParams.append('pageToken', pageToken);
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        return handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any)
    {
    console.error("Failed to fetch local posts:", error);
    return { error: error.message || "An unknown error occurred during fetch" };
  }
}

export async function createLocalPost(
  locationName: string,
  summary: string,
  media?: { sourceUrl: string }[],
  options?: {
    recurringWeekly?: boolean;
    eventTitle?: string;
    weeks?: number;
    dayOfWeek?:
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY"
      | "SUNDAY";
  }
) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!locationName) {
    return { error: "Location name is required." };
  }
  if (!summary) {
    return { error: "Post summary cannot be empty." };
  }

  try {
    // Docs: POST .../localPosts — media must use sourceUrl (not dataRef/bytes).
    const url = `https://mybusiness.googleapis.com/v4/${locationName}/localPosts`;
    const payload: Record<string, unknown> = {
      languageCode: 'en-US',
      summary: summary,
      topicType: options?.recurringWeekly ? 'EVENT' : 'STANDARD',
    };

    if (media && media.length > 0) {
      payload.media = media.map(m => ({
        mediaFormat: 'PHOTO',
        sourceUrl: m.sourceUrl,
      }));
    }

    if (options?.recurringWeekly) {
      const start = new Date();
      start.setHours(9, 0, 0, 0);
      const end = new Date(start);
      end.setHours(17, 0, 0, 0);
      const weeks = Math.min(Math.max(options.weeks || 8, 1), 26);
      const seriesEnd = new Date(start);
      seriesEnd.setDate(seriesEnd.getDate() + weeks * 7);

      const dayNames = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ] as const;
      const dayOfWeek = options.dayOfWeek || dayNames[start.getDay()];

      payload.event = {
        title: options.eventTitle || summary.slice(0, 58),
        schedule: {
          startDate: {
            year: start.getFullYear(),
            month: start.getMonth() + 1,
            day: start.getDate(),
          },
          startTime: { hours: 9, minutes: 0, seconds: 0, nanos: 0 },
          endDate: {
            year: end.getFullYear(),
            month: end.getMonth() + 1,
            day: end.getDate(),
          },
          endTime: { hours: 17, minutes: 0, seconds: 0, nanos: 0 },
        },
        recurrenceInfo: {
          seriesEndTime: seriesEnd.toISOString(),
          weeklyPattern: {
            daysOfWeek: [dayOfWeek],
          },
        },
      };
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
        return handleApiError(response);
    }

    const data = await response.json();
    const { logActivity } = await import("@/lib/activity");
    await logActivity({
      action: "post_created",
      summary: options?.recurringWeekly
        ? `Created a recurring weekly post`
        : `Published a Google post`,
      locationName,
    });
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to create local post:", error);
    return { error: error.message || "An unknown error occurred during post creation" };
  }
}

export async function deleteLocalPost(postName: string) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!postName) {
    return { error: "Post name is required to delete." };
  }

  try {
    const url = `https://mybusiness.googleapis.com/v4/${postName}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        return handleApiError(response);
    }

    // A successful DELETE returns an empty response body
    return { success: true };
    
  } catch (error: any) {
    console.error("Failed to delete local post:", error);
    return { error: error.message || "An unknown error occurred during post deletion" };
  }
}

export async function startMediaUpload(locationName: string) {
    // Kept for compatibility; prefer POST /api/google/media/upload (FormData + bytes).
    const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;

    try {
        const url = `https://mybusiness.googleapis.com/v4/${locationName}/media:startUpload`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });
        if (!response.ok) {
            const err = await handleApiError(response);
            return { error: `Start upload failed. ${err.error}` };
        }
        const data = await response.json();
        const resourceName = data.resourceName as string | undefined;
        if (!resourceName) {
            return { error: "Google did not return an upload resource name." };
        }
        return { success: true, resourceName };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function createMediaItem(
    locationName: string,
    photoDataUrl: string,
    _resourceNameOrUploadUrl: string,
    description: string
) {
    // Decode data-URL and run the documented bytes flow (ignores stale client resourceName).
    try {
        const match = photoDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (!match) {
          return { error: "Invalid image data. Please upload a JPG or PNG." };
        }
        const { uploadLocationPhotoBytes } = await import("@/lib/google/media-upload");
        return uploadLocationPhotoBytes({
          locationName,
          bytes: Buffer.from(match[2], "base64"),
          contentType: match[1],
          description,
        });
    } catch (e: any) {
        console.error('Error in createMediaItem:', e);
        return { error: e.message };
    }
}

export async function saveSelectedLocations(userId: string, locationsToSave: ManagedLocation[]) {
  if (!userId) {
    return { error: "User ID is required." };
  }
  try {
    const supabase = createServiceClient();

    const { data: existing, error: fetchError } = await supabase
      .from("managed_locations")
      .select("id, location_name, date_added, emoji, account_id, title")
      .eq("user_id", userId);

    if (fetchError) throw fetchError;

    const existingByName = new Map(
      (existing || []).map((row) => [row.location_name, row])
    );
    const keepNames = new Set(locationsToSave.map((loc) => loc.locationName));

    const toDelete = (existing || []).filter((row) => !keepNames.has(row.location_name));
    if (toDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("managed_locations")
        .delete()
        .in(
          "id",
          toDelete.map((row) => row.id)
        );
      if (deleteError) throw deleteError;
    }

    if (locationsToSave.length > 0) {
      const rows = locationsToSave.map((loc) => {
        const prior = existingByName.get(loc.locationName);
        return {
          user_id: userId,
          location_name: loc.locationName,
          account_id: loc.accountId || prior?.account_id || null,
          title: loc.title || prior?.title || null,
          emoji: loc.emoji || null,
          date_added: prior?.date_added || new Date().toISOString(),
        };
      });

      const { error: upsertError } = await supabase
        .from("managed_locations")
        .upsert(rows, { onConflict: "user_id,location_name" });
      if (upsertError) throw upsertError;
    }

    // Enable GBP Pub/Sub NEW_REVIEW emails for each linked account (no-op if env unset).
    const accountIds = [
      ...new Set(
        locationsToSave
          .map((l) => l.accountId)
          .filter((id): id is string => Boolean(id))
      ),
    ];
    if (accountIds.length > 0) {
      try {
        const { enableNewReviewNotificationsForAccounts } = await import(
          "@/lib/google/notifications"
        );
        const results = await enableNewReviewNotificationsForAccounts(
          userId,
          accountIds
        );
        console.info("GBP review notification setup:", results);
      } catch (e) {
        console.warn("Could not enable GBP review notifications:", e);
      }
    }

    const { logActivity } = await import("@/lib/activity");
    await logActivity({
      action: "locations_updated",
      summary: `Updated managed locations (${locationsToSave.length} selected)`,
      ownerId: userId,
      metadata: { count: locationsToSave.length },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save locations:", error);
    return { error: error.message || "An unknown error occurred." };
  }
}

export async function getManagedLocations(userId: string): Promise<{ locations?: ManagedLocation[]; error?: string }> {
  if (!userId) {
    return { error: "User ID is required." };
  }
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("managed_locations")
      .select("location_name, date_added, emoji, account_id, title")
      .eq("user_id", userId);

    if (error) throw error;

    const locations: ManagedLocation[] = (data || []).map((row) => ({
      locationName: row.location_name,
      dateAdded: row.date_added
        ? new Date(row.date_added).toISOString()
        : new Date().toISOString(),
      emoji: row.emoji || null,
      accountId: row.account_id || null,
      title: row.title || null,
    }));

    return { locations };
  } catch (error: any) {
    console.error("Failed to get managed locations:", error);
    return { error: error.message || "An unknown error occurred." };
  }
}

export async function saveAiSummary(userId: string, locationName: string, summary: string) {
  if (!userId || !locationName) {
    return { error: "User ID and Location Name are required." };
  }
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("ai_summaries").upsert(
      {
        user_id: userId,
        location_name: locationName,
        summary,
        generated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,location_name" }
    );
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save AI summary:", error);
    return { error: error.message || "An unknown error occurred." };
  }
}

export async function getAiSummary(userId: string, locationName: string): Promise<{ summary?: string; generatedAt?: string; error?: string }> {
  if (!userId || !locationName) {
    return { error: "User ID and Location Name are required." };
  }
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("ai_summaries")
      .select("summary, generated_at")
      .eq("user_id", userId)
      .eq("location_name", locationName)
      .maybeSingle();

    if (error) throw error;
    if (!data) return {};

    // Google GBP policy: stored Content must be temporary (≤ 30 calendar days).
    if (data.generated_at) {
      const ageMs = Date.now() - new Date(data.generated_at).getTime();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      if (ageMs > thirtyDaysMs) {
        await supabase
          .from("ai_summaries")
          .delete()
          .eq("user_id", userId)
          .eq("location_name", locationName);
        return {};
      }
    }

    return {
      summary: data.summary,
      generatedAt: data.generated_at
        ? new Date(data.generated_at).toISOString()
        : undefined,
    };
  } catch (error: any) {
    console.error("Failed to get AI summary:", error);
    return { error: error.message || "An unknown error occurred." };
  }
}

export async function getTeamInvites(ownerId: string) {
    if (!ownerId) {
        return { error: "Owner ID is required." };
    }
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
          .from("invites")
          .select("id, name, invite_code, location_names, status, claimed_by, created_at")
          .eq("owner_id", ownerId);

        if (error) throw error;

        const invites = (data || []).map((row) => ({
            id: row.id,
            name: row.name,
            inviteCode: row.invite_code,
            locations: row.location_names || [],
            status: row.status,
            claimedBy: row.claimed_by || null,
            createdAt: row.created_at
              ? new Date(row.created_at).toISOString()
              : new Date().toISOString(),
        }));
        return { success: true, data: invites };
    } catch (error: any) {
        console.error("Failed to get team invites:", error);
        return { error: error.message || "An unknown error occurred." };
    }
}

export async function createTeamInvite(ownerId: string, inviteName: string, assignedLocations: string[]): Promise<{ success: boolean; inviteCode?: string; error?: string; }> {
    if (!ownerId || !inviteName) {
        return { success: false, error: "Owner ID and invite name are required." };
    }

    try {
        const inviteCode = randomBytes(4).toString('hex').toUpperCase();
        const supabase = createServiceClient();
        const { error } = await supabase.from("invites").insert({
            owner_id: ownerId,
            name: inviteName,
            invite_code: inviteCode,
            location_names: assignedLocations || [],
            status: "pending",
        });
        if (error) throw error;

        const { logActivity } = await import("@/lib/activity");
        await logActivity({
          action: "team_invite_created",
          summary: `Created team invite for ${inviteName}`,
          ownerId,
          metadata: { locationCount: assignedLocations?.length || 0 },
        });

        return { success: true, inviteCode: inviteCode };

    } catch (error: any) {
        console.error("Failed to create team invite:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function updateTeamInvite(inviteId: string, assignedLocations: string[]): Promise<{ success: boolean; error?: string; }> {
    if (!inviteId) {
        return { success: false, error: "Invite ID is required." };
    }

    try {
        const supabase = createServiceClient();
        const { error } = await supabase
          .from("invites")
          .update({ location_names: assignedLocations })
          .eq("id", inviteId);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update team invite:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}


export async function removeTeamInvite(inviteId: string) {
    if (!inviteId) {
        return { error: "Invite ID is required." };
    }
    try {
        const supabase = createServiceClient();
        const { data: invite, error: fetchError } = await supabase
          .from("invites")
          .select("id, claimed_by")
          .eq("id", inviteId)
          .maybeSingle();
        if (fetchError) throw fetchError;
        if (!invite) {
            return { error: "Invite not found." };
        }

        if (invite.claimed_by) {
          const { error: clearOwnerError } = await supabase
            .from("profiles")
            .update({ team_owner_id: null })
            .eq("id", invite.claimed_by);
          if (clearOwnerError) throw clearOwnerError;
        }

        const { error } = await supabase.from("invites").delete().eq("id", inviteId);
        if (error) throw error;

        const { logActivity } = await import("@/lib/activity");
        await logActivity({
          action: "team_invite_removed",
          summary: "Removed a team invite",
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to remove team invite:", error);
        return { error: error.message || "An unknown error occurred." };
    }
}

export async function claimTeamInvite(claimingUserId: string, inviteCode: string): Promise<{ success: boolean; error?: string }> {
    if (!claimingUserId || !inviteCode) {
        return { success: false, error: "User ID and invite code are required." };
    }

    try {
        const supabase = createServiceClient();
        const { data: invite, error: inviteError } = await supabase
          .from("invites")
          .select("id, owner_id, status")
          .eq("invite_code", inviteCode.toUpperCase())
          .maybeSingle();

        if (inviteError) throw inviteError;
        if (!invite) {
            return { success: false, error: "Invalid invite code." };
        }
        if (invite.status !== "pending") {
            return { success: false, error: "This invite code has already been claimed." };
        }

        const { error: updateInviteError } = await supabase
          .from("invites")
          .update({
            status: "claimed",
            claimed_by: claimingUserId,
          })
          .eq("id", invite.id);
        if (updateInviteError) throw updateInviteError;

        const { error: profileError } = await supabase
          .from("profiles")
          .update({ team_owner_id: invite.owner_id })
          .eq("id", claimingUserId);
        if (profileError) throw profileError;

        const { logActivity } = await import("@/lib/activity");
        await logActivity({
          action: "team_invite_claimed",
          summary: "Joined the team via invite code",
          ownerId: invite.owner_id,
        });

        return { success: true };

    } catch (error: any) {
        console.error("Failed to claim team invite:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function leaveTeam(teamMemberId: string): Promise<{ success: boolean; error?: string }> {
    if (!teamMemberId) {
        return { success: false, error: "Team member ID is required." };
    }

    try {
        const supabase = createServiceClient();
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("team_owner_id")
          .eq("id", teamMemberId)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile?.team_owner_id) {
            return { success: false, error: "User is not part of a team." };
        }

        const { error: clearOwnerError } = await supabase
          .from("profiles")
          .update({ team_owner_id: null })
          .eq("id", teamMemberId);
        if (clearOwnerError) throw clearOwnerError;

        const { error: deleteInviteError } = await supabase
          .from("invites")
          .delete()
          .eq("claimed_by", teamMemberId);
        if (deleteInviteError) throw deleteInviteError;

        return { success: true };

    } catch (error: any) {
        console.error("Failed to leave team:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}


export async function fetchAdminsForAccount(accountId: string) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!accountId) {
    return { error: "Account ID is required." };
  }

  try {
    const url = `https://mybusinessaccountmanagement.googleapis.com/v1/${accountId}/admins`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        return handleApiError(response);
    }

    const data = await response.json();
    // The v1 API nests admins in `accountAdmins`
    return { success: true, data: { admins: data.accountAdmins || [] } };

  } catch (error: any) {
    console.error(`Failed to fetch admins for account ${accountId}:`, error);
    return { error: `An unexpected error occurred while fetching admins.` };
  }
}

export async function fetchAdminsForLocation(locationId: string) {
  const auth = await requireGoogleToken();
    if (auth.error || !auth.token) {
        return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
    }
    const token = auth.token;
  if (!locationId) {
    return { error: "Location ID is required." };
  }

  try {
    const url = `https://mybusinessaccountmanagement.googleapis.com/v1/${locationId}/admins`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        return handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error: any) {
    console.error(`Failed to fetch admins for location ${locationId}:`, error);
    return { error: `An unexpected error occurred while fetching admins.` };
  }
}

export async function isTeamMember(userId: string): Promise<{ isTeamMember: boolean; ownerId?: string; error?: string }> {
  if (!userId) {
    return { isTeamMember: false, error: "User ID is required." };
  }
  try {
    const supabase = createServiceClient();
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("team_owner_id")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) throw profileError;

    if (profile?.team_owner_id) {
      const ownerId = profile.team_owner_id;
      const { data: ownerSub, error: subError } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", ownerId)
        .maybeSingle();

      if (subError) throw subError;

      if (ownerSub && ["trialing", "active"].includes(ownerSub.status)) {
        return { isTeamMember: true, ownerId };
      }
    }

    return { isTeamMember: false };
  } catch (error: any) {
    console.error("Failed to check team member status:", error);
    return { isTeamMember: false, error: error.message || "An unknown error occurred." };
  }
}

export async function startFreeTrial(userId: string, planId: 'starter' | 'growth' | 'enterprise'): Promise<{ success: boolean; error?: string }> {
    if (!userId || !planId) {
        return { success: false, error: "User ID and Plan ID are required." };
    }

    try {
        const supabase = createServiceClient();
        const { data: existingSub, error: subFetchError } = await supabase
          .from("subscriptions")
          .select("status, stripe_customer_id")
          .eq("user_id", userId)
          .maybeSingle();

        if (subFetchError) throw subFetchError;

        if (existingSub && ["trialing", "active"].includes(existingSub.status)) {
            return { success: false, error: "An active subscription or trial already exists." };
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("email, display_name")
          .eq("id", userId)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) {
            throw new Error("User profile does not exist. Run supabase/schema.sql if you haven't yet.");
        }

        // Stripe is optional during local rebuild — create customer when configured.
        let stripeCustomerId: string | null = existingSub?.stripe_customer_id ?? null;
        if (process.env.STRIPE_SECRET_KEY && !stripeCustomerId) {
            const customer = await getStripe().customers.create({
                email: profile.email || undefined,
                name: profile.display_name || undefined,
                metadata: {
                    supabaseUserId: userId,
                },
            });
            if (!customer) {
                throw new Error("Could not create Stripe customer.");
            }
            stripeCustomerId = customer.id;
        }

        const trialStart = new Date();
        const trialEnd = addDays(trialStart, 14);

        const { error: upsertError } = await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            plan_id: planId,
            status: "trialing",
            trial_start: trialStart.toISOString(),
            trial_end: trialEnd.toISOString(),
          },
          { onConflict: "user_id" }
        );
        if (upsertError) throw upsertError;

        return { success: true };
    } catch (error: any) {
        console.error("Failed to start free trial:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function getSubscriptionStatus(userId: string): Promise<{ subscription: Subscription | null, error?: string }> {
  if (!userId) {
    return { subscription: null, error: "User ID is required." };
  }
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("plan_id, status, trial_end, current_period_end, cancel_at_period_end, stripe_subscription_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return { subscription: null };
    }

    const subscription: Subscription = {
      planId: data.plan_id,
      status: data.status,
      trial_end: data.trial_end ? new Date(data.trial_end).toISOString() : null,
      current_period_end: data.current_period_end
        ? new Date(data.current_period_end).toISOString()
        : null,
      cancel_at_period_end: data.cancel_at_period_end || false,
      hasStripeSubscription: Boolean(data.stripe_subscription_id),
    };

    return { subscription };
  } catch (error: any) {
    console.error("Failed to get subscription status:", error);
    return { subscription: null, error: error.message || "An unknown error occurred." };
  }
}

export async function createUserDocumentIfNotExists(userId: string, email: string | null, displayName: string | null): Promise<{ success: boolean; error?: string }> {
    if (!userId) {
        return { success: false, error: "User ID is required." };
    }
    try {
        const supabase = createServiceClient();

        let existing: { id: string; welcome_email_sent_at?: string | null } | null = null;
        let welcomeTrackingReady = true;

        const { data: withFlag, error: flagError } = await supabase
          .from("profiles")
          .select("id, welcome_email_sent_at")
          .eq("id", userId)
          .maybeSingle();

        if (flagError) {
          // Column missing until supabase/welcome_email.sql is applied.
          welcomeTrackingReady = false;
          console.warn(
            "welcome_email_sent_at unavailable — run supabase/welcome_email.sql. Skipping welcome email to avoid duplicates.",
            flagError.message
          );
          const { data: fallback, error: fallbackError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", userId)
            .maybeSingle();
          if (fallbackError) throw fallbackError;
          existing = fallback;
        } else {
          existing = withFlag;
        }

        const { error: upsertError } = await supabase.from("profiles").upsert(
          {
            id: userId,
            email,
            display_name: displayName,
          },
          { onConflict: "id" }
        );
        if (upsertError) throw upsertError;

        if (welcomeTrackingReady && !existing?.welcome_email_sent_at) {
            await sendWelcomeEmail(email, displayName);
            await sendNewUserAdminNotification(email, displayName);
            const { error: markError } = await supabase
              .from("profiles")
              .update({ welcome_email_sent_at: new Date().toISOString() })
              .eq("id", userId);
            if (markError) {
              console.warn("Could not mark welcome_email_sent_at:", markError.message);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to create user document:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://mygoprofile.com").replace(/\/$/, "");
}

export async function createBillingPortalSession(userId: string): Promise<{ url: string | null; error: string | null; }> {
    if (!userId) {
        return { url: null, error: "User ID is required." };
    }

    try {
        const supabase = createServiceClient();
        const { data: sub, error } = await supabase
          .from("subscriptions")
          .select("stripe_customer_id")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) throw error;

        let stripeCustomerId = sub?.stripe_customer_id ?? null;
        if (!stripeCustomerId) {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("email, display_name")
              .eq("id", userId)
              .maybeSingle();
            if (profileError) throw profileError;

            const customer = await getStripe().customers.create({
                email: profile?.email || undefined,
                name: profile?.display_name || undefined,
                metadata: { supabaseUserId: userId },
            });
            stripeCustomerId = customer.id;

            if (sub) {
                await supabase
                  .from("subscriptions")
                  .update({ stripe_customer_id: stripeCustomerId })
                  .eq("user_id", userId);
            }
        }

        const portalSession = await getStripe().billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${getAppUrl()}/dashboard/settings`,
        });

        return { url: portalSession.url, error: null };

    } catch (error: any) {
        console.error("Failed to create billing portal session:", error);
        return { url: null, error: error.message || "An unknown error occurred." };
    }
}

export async function createCheckoutSession(
  userId: string,
  planId: 'starter' | 'growth' | 'enterprise',
  interval: BillingInterval = 'monthly'
): Promise<{ url: string | null; error: string | null; }> {
    if (!userId || !planId) {
        return { url: null, error: "User ID and Plan ID are required." };
    }

    try {
        const supabase = createServiceClient();
        const { data: sub, error } = await supabase
          .from("subscriptions")
          .select("stripe_customer_id, status, trial_end")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) throw error;
        if (!sub) {
            return { url: null, error: "No subscription found. Start a free trial first." };
        }

        // Backfill Stripe customer for trials started before Stripe was configured.
        let stripeCustomerId = sub.stripe_customer_id;
        if (!stripeCustomerId) {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("email, display_name")
              .eq("id", userId)
              .maybeSingle();
            if (profileError) throw profileError;

            const customer = await getStripe().customers.create({
                email: profile?.email || undefined,
                name: profile?.display_name || undefined,
                metadata: { supabaseUserId: userId },
            });
            stripeCustomerId = customer.id;

            const { error: updateError } = await supabase
              .from("subscriptions")
              .update({ stripe_customer_id: stripeCustomerId })
              .eq("user_id", userId);
            if (updateError) throw updateError;
        }

        const priceId = getStripePriceId(planId, interval);
        if (!priceId) {
            return { url: null, error: `Price ID for plan '${planId}' (${interval}) is not configured.` };
        }

        const appUrl = getAppUrl();

        // If they're still in the app trial, carry remaining days into Stripe so
        // they aren't charged until the trial they already started ends.
        let trialEndUnix: number | undefined;
        if (sub.status === 'trialing' && sub.trial_end) {
            const trialEnd = new Date(sub.trial_end);
            if (trialEnd.getTime() > Date.now() + 60_000) {
                trialEndUnix = Math.floor(trialEnd.getTime() / 1000);
            }
        }

        const checkoutSession = await getStripe().checkout.sessions.create({
            customer: stripeCustomerId,
            mode: "subscription",
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            success_url: `${appUrl}/dashboard/settings?billing=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/dashboard/settings?billing=cancelled`,
            subscription_data: {
                ...(trialEndUnix ? { trial_end: trialEndUnix } : {}),
                metadata: {
                    userId: userId,
                    planId,
                    interval,
                },
            },
            metadata: {
                userId: userId,
                planId,
                interval,
            },
            allow_promotion_codes: true,
        });

        return { url: checkoutSession.url, error: null };

    } catch (error: any) {
        console.error("Failed to create checkout session:", error);
        return { url: null, error: error.message || "An unknown error occurred." };
    }
}

/**
 * Sync subscription state from Stripe after Checkout.
 * Never trusts the URL alone — only applies updates when Stripe confirms a
 * completed session (and customer match) or an existing customer subscription.
 */
export async function syncSubscriptionFromStripe(
  userId: string,
  checkoutSessionId?: string | null
): Promise<{ success: boolean; status?: string | null; error?: string }> {
  if (!userId) {
    return { success: false, error: "User ID is required." };
  }

  try {
    const supabase = createServiceClient();
    const { data: sub, error } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    const stripeCustomerId = sub?.stripe_customer_id;
    if (!stripeCustomerId) {
      return { success: false, error: "No Stripe customer on this account." };
    }

    let stripeSub: Stripe.Subscription | null = null;

    if (checkoutSessionId) {
      if (!checkoutSessionId.startsWith("cs_")) {
        return { success: false, error: "Invalid checkout session." };
      }

      const session = await getStripe().checkout.sessions.retrieve(checkoutSessionId, {
        expand: ["subscription"],
      });

      const sessionCustomer =
        typeof session.customer === "string" ? session.customer : session.customer?.id;

      // Must belong to this user — blocks borrowing someone else's session_id.
      if (!sessionCustomer || sessionCustomer !== stripeCustomerId) {
        return { success: false, error: "Checkout session does not belong to this account." };
      }

      if (session.status !== "complete") {
        return { success: false, error: "Checkout was not completed." };
      }

      // Subscription mode: paid or still in (Stripe) trial both count as success.
      if (session.mode === "subscription") {
        const subRef = session.subscription;
        if (!subRef) {
          return { success: false, error: "No subscription on completed checkout." };
        }
        const subId = typeof subRef === "string" ? subRef : subRef.id;
        stripeSub = await getStripe().subscriptions.retrieve(subId, {
          expand: ["items.data.price"],
        });
      } else {
        return { success: false, error: "Unexpected checkout mode." };
      }
    } else {
      // Fallback without session_id: only sync if Stripe already has a real sub.
      // Keep expand ≤ 4 levels (data.items.data.price.product is too deep).
      const list = await getStripe().subscriptions.list({
        customer: stripeCustomerId,
        status: "all",
        limit: 10,
        expand: ["data.items.data.price"],
      });

      stripeSub =
        list.data.find((s) => s.status === "active" || s.status === "trialing") ??
        null;

      if (!stripeSub) {
        return { success: false, error: "No active Stripe subscription found for this customer." };
      }

      // Fetch full subscription so period fields / price ids are complete.
      stripeSub = await getStripe().subscriptions.retrieve(stripeSub.id, {
        expand: ["items.data.price"],
      });
    }

    await updateSubscription(stripeSub);
    return { success: true, status: stripeSub.status };
  } catch (error: any) {
    console.error("Failed to sync subscription from Stripe:", error);
    return { success: false, error: error.message || "Could not sync billing status." };
  }
}


// Admin actions
export async function getAdminDashboardData(password: string): Promise<{ data: any; error?: string }> {
    if (password !== process.env.ADMIN_PASSWORD) {
        return { data: null, error: "Unauthorized" };
    }

    try {
        const supabase = createServiceClient();

        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email, display_name, created_at");
        if (profilesError) throw profilesError;

        const { data: locationRows, error: locationsError } = await supabase
          .from("managed_locations")
          .select("user_id");
        if (locationsError) throw locationsError;

        const locationCountByUser = new Map<string, number>();
        for (const row of locationRows || []) {
          locationCountByUser.set(
            row.user_id,
            (locationCountByUser.get(row.user_id) || 0) + 1
          );
        }

        const { data: subscriptions, error: subsError } = await supabase
          .from("subscriptions")
          .select("user_id, plan_id, status, trial_end, created_at, current_period_end");
        if (subsError) throw subsError;

        return {
            data: {
                users: (profiles || []).map((u) => ({
                    uid: u.id,
                    email: u.email,
                    displayName: u.display_name,
                    createdAt: u.created_at
                      ? new Date(u.created_at).toISOString()
                      : null,
                    managedLocations: locationCountByUser.get(u.id) || 0,
                })),
                subscriptions: (subscriptions || []).map((s) => ({
                    userId: s.user_id,
                    planId: s.plan_id,
                    status: s.status,
                    trial_end: s.trial_end
                      ? new Date(s.trial_end).toISOString()
                      : null,
                    created_at: s.created_at
                      ? new Date(s.created_at).toISOString()
                      : null,
                    current_period_end: s.current_period_end
                      ? new Date(s.current_period_end).toISOString()
                      : null,
                })),
            }
        };
    } catch (error: any) {
        console.error("Failed to fetch admin data:", error);
        return { data: null, error: error.message || "An unknown error occurred." };
    }
}

function mapStripeStatus(status: Stripe.Subscription.Status): NonNullable<SubscriptionStatus> {
  if (status === "canceled") return "cancelled";
  if (status === "incomplete_expired" || status === "paused") return "cancelled";
  if (
    status === "trialing" ||
    status === "active" ||
    status === "incomplete" ||
    status === "past_due" ||
    status === "unpaid"
  ) {
    return status;
  }
  return "cancelled";
}

// Function called by Stripe webhook to update subscription status
export async function updateSubscription(sub: Stripe.Subscription) {
    const supabase = createServiceClient();
    let userId = sub.metadata.userId || sub.metadata.supabaseUserId || null;

    if (!userId) {
        const { data: bySubId } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", sub.id)
          .maybeSingle();

        if (bySubId?.user_id) {
            userId = bySubId.user_id;
        } else {
            const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
            const { data: byCustomer } = await supabase
              .from("subscriptions")
              .select("user_id")
              .eq("stripe_customer_id", customerId)
              .maybeSingle();

            if (byCustomer?.user_id) {
                userId = byCustomer.user_id;
            } else {
                console.error(`Webhook Error: Could not find user for subscription ID ${sub.id} or customer ID ${customerId}`);
                return;
            }
        }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, display_name")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
        console.error(`Webhook Error: Failed to load profile for user ID ${userId}`, profileError);
        return;
    }
    if (!profile) {
        console.error(`Webhook Error: User profile not found for user ID ${userId}`);
        return;
    }

    const { data: currentSub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();

    const currentStatus = currentSub?.status ?? null;
    const newStatus = mapStripeStatus(sub.status);

    let mainPlanId: "starter" | "growth" | "enterprise" | null = null;

    for (const item of sub.items.data) {
        const mapped = planIdFromStripePriceId(item.price.id);
        if (mapped) {
            mainPlanId = mapped;
            break;
        }
        // Fallback: product metadata from expanded price.product
        const product = item.price.product;
        if (product && typeof product !== "string" && !("deleted" in product && product.deleted)) {
            const metaPlan = product.metadata?.plan_id;
            if (metaPlan === "starter" || metaPlan === "growth" || metaPlan === "enterprise") {
                mainPlanId = metaPlan;
                break;
            }
        }
    }

    if (!mainPlanId) {
        const metaPlan = sub.metadata?.planId;
        if (metaPlan === "starter" || metaPlan === "growth" || metaPlan === "enterprise") {
            mainPlanId = metaPlan;
        }
    }

    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

    const dataToSet: Record<string, unknown> = {
        user_id: userId,
        stripe_subscription_id: sub.id,
        stripe_customer_id: customerId,
        status: newStatus,
        cancel_at_period_end: sub.cancel_at_period_end,
    };

    if (mainPlanId) {
        dataToSet.plan_id = mainPlanId;
    } else if (!currentSub) {
        // plan_id is required on insert; keep a safe default if webhook arrives first
        dataToSet.plan_id = "starter";
    }

    const periodStart =
      (sub as Stripe.Subscription & { current_period_start?: number }).current_period_start ??
      sub.items.data[0]?.current_period_start;
    const periodEnd =
      (sub as Stripe.Subscription & { current_period_end?: number }).current_period_end ??
      sub.items.data[0]?.current_period_end;

    if (periodStart) {
        dataToSet.current_period_start = new Date(periodStart * 1000).toISOString();
    }
    if (periodEnd) {
        dataToSet.current_period_end = new Date(periodEnd * 1000).toISOString();
    }
    if (sub.trial_end) {
        dataToSet.trial_end = new Date(sub.trial_end * 1000).toISOString();
    } else if (newStatus === "active") {
        dataToSet.trial_end = null;
    }

    const { error: upsertError } = await supabase
      .from("subscriptions")
      .upsert(dataToSet, { onConflict: "user_id" });

    if (upsertError) {
        console.error("Webhook Error: Failed to update subscription", upsertError);
        return;
    }

    if (currentStatus !== newStatus) {
        if (newStatus === "active" && (currentStatus === "trialing" || currentStatus === "incomplete")) {
            await sendSubscriptionActiveEmail(profile.email, profile.display_name, mainPlanId || "your plan");
        } else if (["cancelled", "past_due", "unpaid"].includes(newStatus)) {
            await sendSubscriptionCancelledEmail(profile.email, profile.display_name);
        }
    }
}

// Email actions — lazy init so build doesn't require RESEND_API_KEY
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY is not set.');
    _resend = new Resend(key);
  }
  return _resend;
}

async function getEmailFromAddress() {
  return process.env.EMAIL_FROM || 'MyGoProfile <hello@mygoprofile.com>';
}

function firstNameFromDisplayName(toName: string | null) {
  if (!toName?.trim()) return 'there';
  return toName.trim().split(/\s+/)[0];
}

async function sendWelcomeEmail(toEmail: string | null, toName: string | null) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key not configured. Skipping welcome email.");
    return;
  }
  if (!toEmail) {
    console.warn("No email address provided for new user. Skipping welcome email.");
    return;
  }

  const firstName = firstNameFromDisplayName(toName);
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://mygoprofile.com').replace(/\/$/, '');

  try {
    const { data, error } = await getResend().emails.send({
      from: await getEmailFromAddress(),
      to: [toEmail],
      subject: 'Welcome to MyGoProfile — your GBP, on autopilot',
      react: WelcomeEmail({ userFirstname: firstName, appUrl }),
      text: [
        `Hi ${firstName},`,
        '',
        'Welcome to MyGoProfile. We find what’s holding your Google Business Profile back, tell you what to fix, and use AI to help you fix it.',
        '',
        'Next steps:',
        '1. Start your 14-day free trial (no credit card)',
        '2. Connect your Google Business Profile',
        '3. Check Profile Health and your action list',
        '',
        `Continue setup: ${appUrl}/welcome`,
        '',
        '— The MyGoProfile Team',
      ].join('\n'),
    });

    if (error) {
      throw error;
    }

    console.log(`Welcome email sent to ${toEmail}. Message ID: ${data?.id}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

async function sendNewUserAdminNotification(newUserEmail: string | null, newUserName: string | null) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key not configured. Skipping admin notification email.");
    return;
  }
  
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || "matthijs@2xgen.com";

  try {
    const { data, error } = await getResend().emails.send({
      from: await getEmailFromAddress(),
      to: [adminEmail],
      subject: '🎉 New User Sign-Up on MyGoProfile!',
      react: NewUserAdminNotificationEmail({ newUserEmail, newUserName }),
      text: `A new user has signed up:\nName: ${newUserName || 'N/A'}\nEmail: ${newUserEmail || 'N/A'}`,
    });

    if (error) {
      throw error;
    }

    console.log(`Admin notification email sent to ${adminEmail}. Message ID: ${data?.id}`);
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
  }
}

async function sendSubscriptionActiveEmail(toEmail: string | null, toName: string | null, planName: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("Resend API key not configured. Skipping subscription active email.");
        return;
    }
    if (!toEmail) {
        console.warn("No email address provided. Skipping subscription active email.");
        return;
    }

    try {
        await getResend().emails.send({
            from: 'MyGoProfile <hello@mygoprofile.com>',
            to: [toEmail],
            subject: 'Your MyGoProfile Subscription is Active!',
            react: SubscriptionActiveEmail({
                userFirstname: toName || 'there',
                planName: planName,
            }),
            text: `Hi ${toName || 'there'},\n\nYour subscription to the MyGoProfile ${planName} plan is now active. Thank you for subscribing!\n\nYou can manage your subscription from your dashboard settings.\n\nBest,\nThe MyGoProfile Team`,
        });
    } catch (error) {
        console.error("Failed to send subscription active email:", error);
    }
}

async function sendSubscriptionCancelledEmail(toEmail: string | null, toName: string | null) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("Resend API key not configured. Skipping subscription cancelled email.");
        return;
    }
    if (!toEmail) {
        console.warn("No email address provided. Skipping subscription cancelled email.");
        return;
    }

    try {
        await getResend().emails.send({
            from: 'MyGoProfile <hello@mygoprofile.com>',
            to: [toEmail],
            subject: 'Your MyGoProfile Subscription Has Ended',
            react: SubscriptionCancelledEmail({ userFirstname: toName || 'there' }),
            text: `Hi ${toName || 'there'},\n\nThis is a confirmation that your MyGoProfile subscription has been cancelled. Your access to the dashboard has now ended.\n\nWe'd love to have you back. You can resubscribe at any time from our pricing page.\n\nBest,\nThe MyGoProfile Team`,
        });
    } catch (error) {
        console.error("Failed to send subscription cancelled email:", error);
    }
}

export async function joinWaitlist(email: string): Promise<{ ok: boolean; error?: string }> {
  const trimmed = email?.trim();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  let savedToDb = false;
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("waitlist").insert({ email: trimmed });
    if (error) throw error;
    savedToDb = true;
  } catch (dbErr: unknown) {
    console.warn("Waitlist Supabase save failed (you can still get signups via Resend):", dbErr);
  }

  if (process.env.RESEND_API_KEY) {
    const adminEmail = "matthijs@2xgen.com";
    try {
      const { error } = await getResend().emails.send({
        from: 'MyGoProfile <notifications@mygoprofile.com>',
        to: [adminEmail],
        subject: 'MyGoProfile waitlist signup',
        text: `New waitlist signup: ${trimmed}`,
      });
      if (error) {
        console.error("Resend API error:", JSON.stringify(error, null, 2));
        throw error;
      }
      return { ok: true };
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : String(err);
      console.error("Waitlist signup email failed:", message, err);
      if (savedToDb) {
        return { ok: true };
      }
      return { ok: false, error: "Something went wrong. Please try again." };
    }
  }

  return { ok: true };
}

