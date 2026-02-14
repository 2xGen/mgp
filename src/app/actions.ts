
"use server";

import { headers } from "next/headers";
import { cookies } from "next/headers";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp, Timestamp, updateDoc, collection, addDoc, getDocs, query, where, deleteDoc, writeBatch, deleteField } from "firebase/firestore";
import type { ManagedLocation } from "./dashboard/select-locations/page";
import { addDays } from "date-fns";
import { randomBytes } from "crypto";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome-email';
import SubscriptionActiveEmail from "@/emails/subscription-active-email";
import SubscriptionCancelledEmail from "@/emails/subscription-cancelled-email";
import NewUserAdminNotificationEmail from "@/emails/new-user-admin-notification";


const handleApiError = async (response: Response) => {
    if (response.status === 401) {
        return { error: "SESSION_EXPIRED" };
    }
    const errorData = await response.json();
    console.error("Google API Error:", errorData);
    const errorMessage = `Google API responded with status: ${response.status}. Full error: ${JSON.stringify(errorData, null, 2)}`;
    return { error: `API Error: ${errorMessage}` };
}

export async function setToken(token: string) {
  cookies().set("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function fetchAccounts() {
  const token = cookies().get("access_token")?.value;

  if (!token) {
    // This case might happen if cookies are cleared or not set properly.
    // We treat it as a session expiration for simplicity.
    return { error: "SESSION_EXPIRED" };
  }

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
    const token = cookies().get("access_token")?.value;
    if (!token) {
        return { error: "SESSION_EXPIRED" };
    }
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
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
  if (!locationName) {
    return { error: "Location name is required." };
  }

  try {
    const url = new URL(`https://mybusinessbusinessinformation.googleapis.com/v1/${locationName}`);
    url.searchParams.append('readMask', 'name,title,storefront_address,website_uri,phoneNumbers,categories,profile,serviceArea,regularHours');
    
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
    const token = cookies().get("access_token")?.value;
    if (!token) {
        return { error: "SESSION_EXPIRED" };
    }
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
    const token = cookies().get("access_token")?.value;
    if (!token) {
        return { error: "SESSION_EXPIRED" };
    }
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
    const token = cookies().get("access_token")?.value;
    if (!token) {
        return { error: "SESSION_EXPIRED" };
    }
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
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
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
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
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
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to post reply:", error);
    return { error: error.message || "An unknown error occurred during posting" };
  }
}

export async function deleteReviewReply(reviewName: string) {
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
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

export async function postAnswer(questionName: string, text: string) {
  // Q&A API is deprecated.
  console.warn("postAnswer is called, but the My Business Q&A API is deprecated. This action will have no effect.");
  return { error: "The Google My Business Q&A API is no longer supported." };
}

export async function fetchMedia(locationName: string, pageToken?: string) {
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
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
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
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
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
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

export async function createLocalPost(locationName: string, summary: string, media?: { sourceUrl: string }[]) {
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
  if (!locationName) {
    return { error: "Location name is required." };
  }
  if (!summary) {
    return { error: "Post summary cannot be empty." };
  }

  try {
    const url = `https://mybusiness.googleapis.com/v4/${locationName}/localPosts`;
    const payload: any = {
      languageCode: 'en-US',
      summary: summary,
      topicType: 'STANDARD',
    };

    if (media && media.length > 0) {
      payload.media = media.map(m => ({
        mediaFormat: 'PHOTO',
        sourceUrl: m.sourceUrl,
      }));
    }
    
    const response = await fetch(url, {
      method: 'POST',
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
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to create local post:", error);
    return { error: error.message || "An unknown error occurred during post creation" };
  }
}

export async function deleteLocalPost(postName: string) {
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
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
    const token = cookies().get('access_token')?.value;
    if (!token) {
        return { error: "SESSION_EXPIRED" };
    }

    try {
        const url = `https://mybusiness.googleapis.com/v4/${locationName}/media:startUpload`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        if (!response.ok) {
            return handleApiError(response);
        }
        const data = await response.json();
        return { success: true, uploadUrl: data.uploadUrl };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function createMediaItem(
    locationName: string,
    photoDataUrl: string,
    uploadUrl: string,
    description: string
) {
    const token = cookies().get('access_token')?.value;
    if (!token) {
        return { error: "SESSION_EXPIRED" };
    }

    try {
        // 1. Upload bytes to the uploadUrl
        const photoBlob = await (await fetch(photoDataUrl)).blob();

        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/octet-stream',
            },
            body: photoBlob,
        });

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.text();
            throw new Error(`Failed to upload photo bytes: ${errorData}`);
        }
        
        const uploadResult = await uploadResponse.json();
        const mediaKey = uploadResult.mediaKey;

        // 2. Create the media item using the mediaKey
        const createUrl = `https://mybusiness.googleapis.com/v4/${locationName}/media`;
        const createPayload = {
            mediaFormat: 'PHOTO',
            description: description,
            mediaKey: mediaKey
        };
        
        const createResponse = await fetch(createUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createPayload),
        });

        if (!createResponse.ok) {
            return handleApiError(createResponse);
        }

        const data = await createResponse.json();
        return { success: true, data };

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
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    
    // Get existing locations from DB, converting Timestamps to Dates for comparison
    const existingLocations: ManagedLocation[] = docSnap.exists() 
        ? (docSnap.data().managedLocations || []).map((loc: any) => ({
            ...loc,
            dateAdded: loc.dateAdded.toDate(), // convert Firestore Timestamp to JS Date
        }))
        : [];

    const newManagedLocations = locationsToSave.map(newLoc => {
      // Find if this location already exists in our records
      const existing = existingLocations.find(l => l.locationName === newLoc.locationName);
      if (existing) {
        // If it exists, preserve its original dateAdded and just update the emoji
        return { 
            locationName: newLoc.locationName, 
            dateAdded: existing.dateAdded, // Keep original timestamp
            emoji: newLoc.emoji || null 
        };
      }
      // If it's a completely new addition, add it with the current timestamp and emoji
      return { 
        locationName: newLoc.locationName, 
        dateAdded: Timestamp.now(), // New location, new timestamp
        emoji: newLoc.emoji || null 
      };
    });

    // We replace the entire array with the new one which contains all selected locations
    await setDoc(userDocRef, { managedLocations: newManagedLocations }, { merge: true });
    
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
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const managedLocations: ManagedLocation[] = data.managedLocations || [];
      
      // Firestore Timestamps need to be converted to a serializable format (like ISO strings)
      // for the client component.
      const serializableLocations = managedLocations.map(loc => ({
          ...loc,
          dateAdded: loc.dateAdded.toDate().toISOString(),
          emoji: loc.emoji || null
      }));

      return { locations: serializableLocations };
    } else {
      return { locations: [] };
    }
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
    const userDocRef = doc(db, "users", userId);
    const fieldPath = `aiSummaries.${locationName.replace(/\//g, '_')}`; // Sanitize location name for Firestore field path
    
    // Using updateDoc with dot notation
    await updateDoc(userDocRef, {
      [fieldPath]: {
        summary: summary,
        generatedAt: Timestamp.now(),
      }
    });

    return { success: true };
  } catch (error: any) {
    // If the document doesn't exist, or aiSummaries map doesn't exist, use setDoc with merge.
    if (error.code === 'not-found' || error.message.includes('No document to update')) {
      try {
        const userDocRef = doc(db, "users", userId);
        const fieldPath = `aiSummaries.${locationName.replace(/\//g, '_')}`;
        await setDoc(userDocRef, { 
            aiSummaries: {
                [locationName.replace(/\//g, '_')]: {
                    summary: summary,
                    generatedAt: Timestamp.now(),
                }
            }
        }, { merge: true });
        return { success: true };
      } catch (e: any) {
        console.error("Failed to save AI summary with setDoc:", e);
        return { error: e.message || "An unknown error occurred." };
      }
    }
    console.error("Failed to save AI summary with updateDoc:", error);
    return { error: error.message || "An unknown error occurred." };
  }
}

export async function getAiSummary(userId: string, locationName: string): Promise<{ summary?: string; generatedAt?: string; error?: string }> {
  if (!userId || !locationName) {
    return { error: "User ID and Location Name are required." };
  }
  try {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    const sanitizedLocationName = locationName.replace(/\//g, '_');

    if (docSnap.exists()) {
      const data = docSnap.data();
      const summaryData = data.aiSummaries?.[sanitizedLocationName];
      if (summaryData && summaryData.generatedAt) {
        return {
          summary: summaryData.summary,
          generatedAt: summaryData.generatedAt.toDate().toISOString(),
        };
      }
    }
    return {}; // No summary found
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
        const invitesCollectionRef = collection(db, "invites");
        const q = query(invitesCollectionRef, where('ownerId', '==', ownerId));
        const querySnapshot = await getDocs(q);

        const invites = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                inviteCode: data.inviteCode,
                locations: data.locations,
                status: data.status,
                claimedBy: data.claimedBy || null,
                createdAt: data.createdAt.toDate().toISOString(),
            };
        });
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
        const invitesCollectionRef = collection(db, "invites");

        await addDoc(invitesCollectionRef, {
            ownerId: ownerId,
            name: inviteName,
            inviteCode: inviteCode,
            locations: assignedLocations || [],
            status: 'pending',
            createdAt: serverTimestamp(),
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
        const inviteDocRef = doc(db, "invites", inviteId);
        await updateDoc(inviteDocRef, {
            locations: assignedLocations
        });
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
        const inviteDocRef = doc(db, "invites", inviteId);
        await deleteDoc(inviteDocRef);
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
        const invitesRef = collection(db, 'invites');
        const q = query(invitesRef, where('inviteCode', '==', inviteCode.toUpperCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { success: false, error: "Invalid invite code." };
        }

        const inviteDoc = querySnapshot.docs[0];
        const inviteData = inviteDoc.data();

        if (inviteData.status !== 'pending') {
            return { success: false, error: "This invite code has already been claimed." };
        }

        // The user document for the team member.
        const teamMemberUserDocRef = doc(db, "users", claimingUserId);
        
        // The invite document itself.
        const inviteDocRef = inviteDoc.ref;

        const batch = writeBatch(db);

        // 1. Update the invite to mark it as claimed.
        batch.update(inviteDocRef, {
            status: 'claimed',
            claimedBy: claimingUserId,
            claimedAt: serverTimestamp(),
        });
        
        // 2. Set the teamOwnerId on the team member's user document for future reference.
        batch.set(teamMemberUserDocRef, {
            teamOwnerId: inviteData.ownerId
        }, { merge: true });

        await batch.commit();

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
        const userDocRef = doc(db, "users", teamMemberId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists() || !userDocSnap.data().teamOwnerId) {
            return { success: false, error: "User is not part of a team." };
        }

        const batch = writeBatch(db);

        // 1. Remove the teamOwnerId from the user's document
        batch.update(userDocRef, {
            teamOwnerId: deleteField()
        });

        // 2. Find and delete the corresponding invite document
        const invitesRef = collection(db, 'invites');
        const q = query(invitesRef, where('claimedBy', '==', teamMemberId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const inviteDoc = querySnapshot.docs[0];
            batch.delete(inviteDoc.ref);
        }

        await batch.commit();
        
        return { success: true };

    } catch (error: any) {
        console.error("Failed to leave team:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}


export async function fetchAdminsForAccount(accountId: string) {
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
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
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return { error: "SESSION_EXPIRED" };
  }
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
    // A user is a team member if their own user document has a `teamOwnerId` field.
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists() && docSnap.data().teamOwnerId) {
        const ownerId = docSnap.data().teamOwnerId;

        // CRITICAL: Check if the owner's subscription is still active.
        const ownerSubRef = doc(db, 'subscriptions', ownerId);
        const ownerSubSnap = await getDoc(ownerSubRef);

        if (ownerSubSnap.exists() && ['trialing', 'active'].includes(ownerSubSnap.data().status)) {
             return { isTeamMember: true, ownerId: ownerId };
        }
    }
    
    // If no owner ID, or owner has no active sub, they are not a valid team member.
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
        const subscriptionDocRef = doc(db, "subscriptions", userId);
        const docSnap = await getDoc(subscriptionDocRef);

        if (docSnap.exists()) {
            const subData = docSnap.data();
            if (subData.status !== 'cancelled' && !subData.stripeCustomerId) {
                 // Prevent re-creating everything if they already have a sub object.
                 // The !stripeCustomerId check is to handle legacy users before stripe was added.
                 return { success: false, error: "An active subscription or trial already exists." };
            }
        }
        
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            throw new Error("User document does not exist.");
        }
        const { email, displayName } = userDoc.data();
        
        // Create a Stripe Customer
        const customer = await stripe.customers.create({
            email: email,
            name: displayName,
            metadata: {
                firebaseUID: userId,
            },
        });
        
        if (!customer) {
            throw new Error("Could not create Stripe customer.");
        }

        const trialStartDate = Timestamp.now();
        const trialEndDate = Timestamp.fromDate(addDays(new Date(), 14));

        await setDoc(subscriptionDocRef, {
            userId: userId,
            stripeCustomerId: customer.id,
            planId: planId,
            status: 'trialing',
            trial_start: trialStartDate,
            trial_end: trialEndDate,
            created_at: serverTimestamp(),
        }, { merge: true });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to start free trial:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export type SubscriptionStatus = 'trialing' | 'active' | 'cancelled' | 'incomplete' | 'past_due' | 'unpaid' | null;

export interface Subscription {
  planId: 'starter' | 'growth' | 'enterprise';
  status: SubscriptionStatus;
  trial_end: string | null;
  current_period_end: string | null;
  cancel_at_period_end?: boolean;
}

export async function getSubscriptionStatus(userId: string): Promise<{ subscription: Subscription | null, error?: string }> {
  if (!userId) {
    return { subscription: null, error: "User ID is required." };
  }
  try {
    const subscriptionDocRef = doc(db, "subscriptions", userId);
    const docSnap = await getDoc(subscriptionDocRef);

    if (!docSnap.exists()) {
      return { subscription: null };
    }
    
    const data = docSnap.data();

    // Convert Firestore Timestamps to serializable ISO strings
    const trialEnd = data.trial_end ? data.trial_end.toDate().toISOString() : null;
    const currentPeriodEnd = data.current_period_end ? data.current_period_end.toDate().toISOString() : null;

    const subscription: Subscription = {
      planId: data.planId,
      status: data.status,
      trial_end: trialEnd,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: data.cancel_at_period_end || false,
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
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            await setDoc(userDocRef, {
                uid: userId,
                email: email,
                displayName: displayName,
                createdAt: serverTimestamp(),
            });
            // Send welcome email on first-time creation
            await sendWelcomeEmail(email, displayName);
            // Send admin notification
            await sendNewUserAdminNotification(email, displayName);
        }
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create user document:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function createBillingPortalSession(userId: string): Promise<{ url: string | null; error: string | null; }> {
    if (!userId) {
        return { url: null, error: "User ID is required." };
    }

    try {
        const subscriptionDocRef = doc(db, "subscriptions", userId);
        const subSnap = await getDoc(subscriptionDocRef);

        if (!subSnap.exists() || !subSnap.data()?.stripeCustomerId) {
            return { url: null, error: "Stripe customer ID not found for this user." };
        }
        
        const stripeCustomerId = subSnap.data()?.stripeCustomerId;
        
        const returnUrl = 'https://mygoprofile.com/dashboard/settings';

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: returnUrl,
        });

        return { url: portalSession.url, error: null };

    } catch (error: any) {
        console.error("Failed to create billing portal session:", error);
        return { url: null, error: error.message || "An unknown error occurred." };
    }
}

export async function createCheckoutSession(userId: string, planId: 'starter' | 'growth' | 'enterprise'): Promise<{ url: string | null; error: string | null; }> {
    if (!userId || !planId) {
        return { url: null, error: "User ID and Plan ID are required." };
    }

    try {
        const subscriptionDocRef = doc(db, "subscriptions", userId);
        const subSnap = await getDoc(subscriptionDocRef);

        if (!subSnap.exists() || !subSnap.data()?.stripeCustomerId) {
            return { url: null, error: "Stripe customer ID not found for this user." };
        }
        
        const stripeCustomerId = subSnap.data()?.stripeCustomerId;
        let priceId;
        if (planId === 'starter') {
            priceId = process.env.STARTER_PLAN_PRICE_ID;
        } else if (planId === 'growth') {
            priceId = process.env.GROWTH_PLAN_PRICE_ID;
        } else if (planId === 'enterprise') {
            priceId = process.env.ENTERPRISE_PLAN_PRICE_ID;
        }


        if (!priceId) {
            return { url: null, error: `Price ID for plan '${planId}' is not configured.` };
        }

        const successUrl = 'https://mygoprofile.com/';
        const cancelUrl = 'https://mygoprofile.com/welcome';

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: 'subscription',
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            success_url: successUrl,
            cancel_url: cancelUrl,
            subscription_data: {
                // Add metadata to link the Stripe subscription back to our user
                metadata: {
                    userId: userId,
                },
            },
            // Add metadata to the session as well
            metadata: {
                userId: userId,
            },
            allow_promotion_codes: true,
        });

        return { url: checkoutSession.url, error: null };

    } catch (error: any) {
        console.error("Failed to create checkout session:", error);
        return { url: null, error: error.message || "An unknown error occurred." };
    }
}


// Admin actions
export async function getAdminDashboardData(password: string): Promise<{ data: any; error?: string }> {
    if (password !== process.env.ADMIN_PASSWORD) {
        return { data: null, error: "Unauthorized" };
    }

    try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const subscriptionsSnapshot = await getDocs(collection(db, "subscriptions"));
        const subscriptions = subscriptionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return {
            data: {
                users: users.map(u => ({
                    uid: u.uid,
                    email: u.email,
                    displayName: u.displayName,
                    createdAt: u.createdAt?.toDate().toISOString(),
                    managedLocations: u.managedLocations?.length || 0,
                })),
                subscriptions: subscriptions.map(s => ({
                    userId: s.userId,
                    planId: s.planId,
                    status: s.status,
                    trial_end: s.trial_end?.toDate().toISOString() || null,
                    created_at: s.created_at?.toDate().toISOString() || null,
                    current_period_end: s.current_period_end?.toDate().toISOString() || null,
                })),
            }
        };
    } catch (error: any) {
        console.error("Failed to fetch admin data:", error);
        return { data: null, error: error.message || "An unknown error occurred." };
    }
}


// Function called by Stripe webhook to update subscription status
export async function updateSubscription(sub: Stripe.Subscription) {
    let userId = sub.metadata.userId;

    // Fallback for finding user ID if not in metadata
    if (!userId) {
        const subsRef = collection(db, 'subscriptions');
        const q = query(subsRef, where('stripeSubscriptionId', '==', sub.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            userId = querySnapshot.docs[0].id;
        } else {
             const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
             const customerQ = query(subsRef, where('stripeCustomerId', '==', customerId));
             const customerSnapshot = await getDocs(customerQ);
             if (!customerSnapshot.empty) {
                 userId = customerSnapshot.docs[0].id;
             } else {
                  console.error(`Webhook Error: Could not find user for subscription ID ${sub.id} or customer ID ${customerId}`);
                  return;
             }
        }
    }
    
    // Get user's current subscription state and email
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
        console.error(`Webhook Error: User document not found for user ID ${userId}`);
        return;
    }
    const { email, displayName } = userDocSnap.data();

    const subscriptionDocRef = doc(db, 'subscriptions', userId);
    const currentSubSnap = await getDoc(subscriptionDocRef);
    const currentStatus = currentSubSnap.exists() ? currentSubSnap.data().status : null;
    const newStatus = sub.status;

    let mainPlanId: 'starter' | 'growth' | 'enterprise' | null = null;

    for (const item of sub.items.data) {
        const priceId = item.price.id;

        if (priceId === process.env.STARTER_PLAN_PRICE_ID) {
            mainPlanId = 'starter';
        } else if (priceId === process.env.GROWTH_PLAN_PRICE_ID) {
            mainPlanId = 'growth';
        } else if (priceId === process.env.ENTERPRISE_PLAN_PRICE_ID) {
            mainPlanId = 'enterprise';
        }
    }
    
    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;

    const dataToSet: any = {
        stripeSubscriptionId: sub.id,
        stripeCustomerId: customerId,
        status: newStatus,
        cancel_at_period_end: sub.cancel_at_period_end,
    };
    
    if (mainPlanId) {
        dataToSet.planId = mainPlanId;
    }
    
    if (sub.current_period_start) {
        dataToSet.current_period_start = Timestamp.fromMillis(sub.current_period_start * 1000);
    }
    if (sub.current_period_end) {
        dataToSet.current_period_end = Timestamp.fromMillis(sub.current_period_end * 1000);
    }
    
    await setDoc(subscriptionDocRef, dataToSet, { merge: true });

    // --- Email Sending Logic ---
    if (currentStatus !== newStatus) {
        if (newStatus === 'active' && (currentStatus === 'trialing' || currentStatus === 'incomplete')) {
            await sendSubscriptionActiveEmail(email, displayName, mainPlanId || 'your plan');
        } else if (['cancelled', 'past_due', 'unpaid'].includes(newStatus)) {
            await sendSubscriptionCancelledEmail(email, displayName);
        }
    }
}

// Email actions
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(toEmail: string | null, toName: string | null) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key not configured. Skipping welcome email.");
    return;
  }
  if (!toEmail) {
    console.warn("No email address provided for new user. Skipping welcome email.");
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'MyGoProfile <hello@mygoprofile.com>',
      to: [toEmail],
      subject: 'Welcome to MyGoProfile!',
      react: WelcomeEmail({ userFirstname: toName || 'there' }),
      text: `Welcome to MyGoProfile, ${toName || 'there'}! Get ready to supercharge your Google Business Profile.`,
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
  
  const adminEmail = "matthijs@2xgen.com";

  try {
    const { data, error } = await resend.emails.send({
      from: 'MyGoProfile <notifications@mygoprofile.com>',
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
        await resend.emails.send({
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
        await resend.emails.send({
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

  let savedToFirestore = false;
  try {
    const waitlistRef = collection(db, "waitlist");
    await addDoc(waitlistRef, { email: trimmed, createdAt: serverTimestamp() });
    savedToFirestore = true;
  } catch (firestoreErr: unknown) {
    console.warn("Waitlist Firestore save failed (you can still get signups via Resend):", firestoreErr);
  }

  if (process.env.RESEND_API_KEY) {
    const adminEmail = "matthijs@2xgen.com";
    try {
      const { error } = await resend.emails.send({
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
      if (savedToFirestore) {
        return { ok: true };
      }
      return { ok: false, error: "Something went wrong. Please try again." };
    }
  }

  return { ok: true };
}

