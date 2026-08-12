import { getGoogleAccessTokenForUserId } from "@/lib/google/access-token";

function pubsubTopic() {
  return (process.env.GOOGLE_PUBSUB_TOPIC || "").trim();
}

/**
 * Register this GBP account for NEW_REVIEW Pub/Sub notifications.
 * Requires GOOGLE_PUBSUB_TOPIC = projects/{project}/topics/{topic}
 * and publisher IAM for mybusiness-api-pubsub@system.gserviceaccount.com
 */
export async function enableNewReviewNotifications(params: {
  accountName: string; // accounts/{id}
  userId: string;
}): Promise<{ success?: true; skipped?: string; error?: string }> {
  const topic = pubsubTopic();
  if (!topic) {
    return { skipped: "GOOGLE_PUBSUB_TOPIC not set" };
  }

  const accountName = params.accountName.startsWith("accounts/")
    ? params.accountName
    : `accounts/${params.accountName}`;

  const auth = await getGoogleAccessTokenForUserId(params.userId);
  if (!auth.token) {
    return { error: auth.error || "GOOGLE_NOT_CONNECTED" };
  }

  const name = `${accountName}/notificationSetting`;
  const url = `https://mybusinessnotifications.googleapis.com/v1/${name}?updateMask=pubsubTopic,notificationTypes`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      pubsubTopic: topic,
      notificationTypes: ["NEW_REVIEW"],
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("enableNewReviewNotifications failed:", res.status, body.slice(0, 400));
    return {
      error: `Failed to enable review notifications (${res.status}): ${body.slice(0, 200)}`,
    };
  }

  return { success: true };
}

export async function enableNewReviewNotificationsForAccounts(
  userId: string,
  accountNames: string[]
) {
  const unique = [...new Set(accountNames.filter(Boolean))];
  const results = [];
  for (const accountName of unique) {
    results.push(await enableNewReviewNotifications({ accountName, userId }));
  }
  return results;
}
