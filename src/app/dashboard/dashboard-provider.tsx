"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { loadLocationDashboardBundle } from "@/app/actions";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";
import type { Review } from '@/components/dashboard/review-list';
import type { Question } from "@/components/dashboard/question-list";
import {
  getCachedBundle,
  peekCachedBundle,
  setCachedBundle,
  saveDashboardSelection,
  loadDashboardSelection,
  bundleCacheKey,
} from "@/lib/dashboard-cache";

export type DashboardTab = 'overview' | 'details' | 'performance' | 'all-info' | 'reviews' | 'media' | 'posts' | 'qa';

export interface LocationDetailsData {
    name: string;
    title: string;
    phoneNumbers?: { primaryPhone?: string };
    websiteUri?: string;
    storefrontAddress?: {
        addressLines: string[];
        locality: string;
        administrativeArea: string;
        postalCode: string;
        regionCode: string;
    };
    categories?: {
        primaryCategory: {
            displayName: string;
        }
    };
    profile?: {
        description: string;
    };
    regularHours?: {
        periods: any[];
    };
    serviceArea?: {
        placeInfos: {
            placeName: string;
        }[];
    };
    metadata?: {
        placeId?: string;
        mapsUri?: string;
        newReviewUri?: string;
    };
}

interface LocationFullData {
    details: LocationDetailsData;
    currentPerformance: any;
    previousPerformance: any;
    posts: any;
    reviews: Review[];
    questions: Question[];
    currentPeriodReviews: Review[];
    previousPeriodReviews: Review[];
}

export interface AllLocationsData extends LocationFullData {
  id: string;
}

interface DashboardContextType {
  accountId: string | null;
  setAccountId: (id: string | null) => void;
  selectedLocationName: string | null;
  setSelectedLocationName: (name: string | null) => void;
  selectedLocation: LocationFullData | null;
  allLocationsData: AllLocationsData[] | null;
  isDetailsLoading: boolean;
  detailsError: string | null;
  setDetailsError: (error: string | null) => void;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  loadAllLocationsData: (locations: { name: string; title: string, accountId: string }[], accountId: string) => void;
  managedLocationCount: number;
  setManagedLocationCount: (count: number) => void;
  refreshSelectedLocation: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const loadSingleLocationData = async (locationName: string, accountId: string) => {
    const result = await loadLocationDashboardBundle(locationName, accountId);
    if (result.error || !result.data) {
        throw new Error(result.error || "Failed to load location data.");
    }

    const {
      details,
      currentPerformance,
      previousPerformance,
      posts,
      reviews,
      questions,
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
    } = result.data;

    const allReviews = (reviews || []) as Review[];
    const currentPeriodReviews = allReviews.filter((review) =>
      isWithinInterval(new Date(review.createTime), {
        start: startOfDay(new Date(currentStart)),
        end: endOfDay(new Date(currentEnd)),
      })
    );
    const previousPeriodReviews = allReviews.filter((review) =>
      isWithinInterval(new Date(review.createTime), {
        start: startOfDay(new Date(previousStart)),
        end: endOfDay(new Date(previousEnd)),
      })
    );

    return {
        details: details as LocationDetailsData,
        currentPerformance,
        previousPerformance,
        posts: posts || [],
        reviews: allReviews,
        questions: (questions || []) as Question[],
        currentPeriodReviews,
        previousPeriodReviews,
    };
};

const loadAllLocationsDataFunc = async (locations: {name: string, title: string, accountId: string}[]) => {
    const allData = await Promise.all(locations.map(async (loc) => {
      try {
        const data = await loadSingleLocationData(loc.name, loc.accountId);
        setCachedBundle(loc.accountId, loc.name, data);
        return { id: loc.name, ...data };
      } catch (e) {
        console.warn(`Could not fetch all data for ${loc.title}.`, e);
        return null;
      }
  }));

  return allData.filter(d => d !== null) as AllLocationsData[];
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const initialSelection = typeof window !== "undefined" ? loadDashboardSelection() : null;

  const [accountId, setAccountIdState] = useState<string | null>(
    initialSelection?.accountId ?? null
  );
  const [selectedLocationName, setSelectedLocationNameState] = useState<string | null>(
    initialSelection?.locationName ?? null
  );
  
  const [selectedLocation, setSelectedLocation] = useState<LocationFullData | null>(() => {
    if (!initialSelection) return null;
    return (
      getCachedBundle<LocationFullData>(
        initialSelection.accountId,
        initialSelection.locationName
      ) ||
      peekCachedBundle<LocationFullData>(
        initialSelection.accountId,
        initialSelection.locationName
      )
    );
  });
  const [allLocationsData, setAllLocationsData] = useState<AllLocationsData[] | null>(null);

  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  
  const [managedLocationCount, setManagedLocationCount] = useState(0);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const forceRefreshRef = useRef(false);
  const loadedKeyRef = useRef<string | null>(
    initialSelection
      ? bundleCacheKey(initialSelection.accountId, initialSelection.locationName)
      : null
  );

  const setAccountId = useCallback((id: string | null) => {
    setAccountIdState(id);
  }, []);

  const setSelectedLocationName = useCallback((name: string | null) => {
    setSelectedLocationNameState(name);
  }, []);

  useEffect(() => {
    if (accountId && selectedLocationName) {
      saveDashboardSelection({ accountId, locationName: selectedLocationName });
    }
  }, [accountId, selectedLocationName]);

  useEffect(() => {
    if (!selectedLocationName || !accountId) return;

    const key = bundleCacheKey(accountId, selectedLocationName);
    const force = forceRefreshRef.current;
    forceRefreshRef.current = false;

    const fresh = getCachedBundle<LocationFullData>(accountId, selectedLocationName);
    if (fresh && !force) {
      setSelectedLocation(fresh);
      setIsDetailsLoading(false);
      setDetailsError(null);
      loadedKeyRef.current = key;
      return;
    }

    const peeked =
      fresh || peekCachedBundle<LocationFullData>(accountId, selectedLocationName);
    if (peeked) {
      setSelectedLocation(peeked);
      setIsDetailsLoading(false);
      setDetailsError(null);
    }

    let cancelled = false;
    if (!peeked) {
      setIsDetailsLoading(true);
      setDetailsError(null);
    }

    loadSingleLocationData(selectedLocationName, accountId)
      .then((data) => {
        if (cancelled) return;
        setCachedBundle(accountId, selectedLocationName, data);
        setSelectedLocation(data);
        loadedKeyRef.current = key;
        setDetailsError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        if (!peeked) {
          setDetailsError(e.message || "Failed to fetch location details.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsDetailsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLocationName, accountId, refreshNonce]);
  
  const loadAllLocationsData = useCallback(async (locations: {name: string, title: string, accountId: string}[], newAccountId: string) => {
    setIsDetailsLoading(true);
    setAccountIdState(newAccountId);
    setSelectedLocationNameState(null);
    setSelectedLocation(null);
    setAllLocationsData(null);
    setDetailsError(null);
    setActiveTab('overview');

    try {
        const data = await loadAllLocationsDataFunc(locations);
        setAllLocationsData(data);
    } catch (e: any) {
        setDetailsError(e.message || "Failed to fetch data for all locations.");
    } finally {
        setIsDetailsLoading(false);
    }
  }, []);

  const refreshSelectedLocation = useCallback(() => {
    forceRefreshRef.current = true;
    setRefreshNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!accountId) {
      setSelectedLocationNameState(null);
      setSelectedLocation(null);
      setAllLocationsData(null);
      setDetailsError(null);
      setActiveTab('overview');
    }
  }, [accountId]);


  return (
    <DashboardContext.Provider
      value={{
        accountId,
        setAccountId,
        selectedLocationName,
        setSelectedLocationName,
        selectedLocation,
        allLocationsData,
        isDetailsLoading,
        detailsError,
        setDetailsError,
        activeTab,
        setActiveTab,
        loadAllLocationsData,
        managedLocationCount,
        setManagedLocationCount,
        refreshSelectedLocation,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
