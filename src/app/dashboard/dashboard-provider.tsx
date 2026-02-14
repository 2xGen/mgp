
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { fetchLocationDetails, fetchLocationPerformance, fetchLocalPosts, fetchReviews, fetchQuestions } from "@/app/actions";
import { subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import type { Review } from '@/components/dashboard/review-list';
import type { Question } from "@/components/dashboard/question-list";

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
    }
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
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const loadSingleLocationData = async (locationName: string, accountId: string) => {
    const today = new Date();
    const currentStartDate = subDays(today, 29);
    const currentEndDate = today;
    const previousStartDate = subDays(today, 59);
    const previousEndDate = subDays(today, 30);

    const locationId = locationName.split('/')[1];
    const accountIdNum = accountId.split('/')[1];
    const fullLocationPathForPosts = `accounts/${accountIdNum}/locations/${locationId}`;
    
    const [
        detailsResult,
        currentPerfResult,
        previousPerfResult,
        postsResult,
        reviewsResult,
        questionsResult,
    ] = await Promise.all([
        fetchLocationDetails(locationName),
        fetchLocationPerformance(locationName, currentStartDate.toISOString(), currentEndDate.toISOString()),
        fetchLocationPerformance(locationName, previousStartDate.toISOString(), previousEndDate.toISOString()),
        fetchLocalPosts(fullLocationPathForPosts),
        fetchReviews(accountIdNum, locationId),
        fetchQuestions(locationName),
    ]);
    
    const firstError = [detailsResult, currentPerfResult, previousPerfResult, postsResult, reviewsResult, questionsResult].find(r => r.error);
    if (firstError) {
        throw new Error(firstError.error);
    }
    
    const allReviews: Review[] = reviewsResult.data?.reviews || [];
    
    const currentPeriodReviews = allReviews.filter(review => 
        isWithinInterval(new Date(review.createTime), { start: startOfDay(currentStartDate), end: endOfDay(currentEndDate) })
    );

    const previousPeriodReviews = allReviews.filter(review => 
         isWithinInterval(new Date(review.createTime), { start: startOfDay(previousStartDate), end: endOfDay(previousEndDate) })
    );

    return {
        details: detailsResult,
        currentPerformance: currentPerfResult.data,
        previousPerformance: previousPerfResult.data,
        posts: postsResult.data?.localPosts || [],
        reviews: allReviews,
        questions: questionsResult.data?.questions || [],
        currentPeriodReviews,
        previousPeriodReviews
    };
};

const loadAllLocationsDataFunc = async (locations: {name: string, title: string, accountId: string}[]) => {
    const today = new Date();
    const currentStartDate = subDays(today, 29);
    const currentEndDate = today;
    const previousStartDate = subDays(today, 59);
    const previousEndDate = subDays(today, 30);

    const allData = await Promise.all(locations.map(async (loc) => {
    const locationId = loc.name.split('/')[1];
    const accountIdNum = loc.accountId.split('/')[1];
    const fullLocationPathForPosts = `accounts/${accountIdNum}/locations/${locationId}`;

    const [
        detailsResult,
        currentPerfResult,
        previousPerfResult,
        postsResult,
        reviewsResult,
        questionsResult,
    ] = await Promise.all([
        fetchLocationDetails(loc.name),
        fetchLocationPerformance(loc.name, currentStartDate.toISOString(), currentEndDate.toISOString()),
        fetchLocationPerformance(loc.name, previousStartDate.toISOString(), previousEndDate.toISOString()),
        fetchLocalPosts(fullLocationPathForPosts),
        fetchReviews(accountIdNum, locationId),
        fetchQuestions(loc.name),
    ]);

    if ([detailsResult, currentPerfResult, previousPerfResult, postsResult, reviewsResult, questionsResult].some(r => r.error)) {
      console.warn(`Could not fetch all data for ${loc.title}. Error:`, [detailsResult, currentPerfResult, previousPerfResult, postsResult, reviewsResult, questionsResult].find(r => r.error)?.error);
      return null;
    }
    
    const allReviews: Review[] = reviewsResult.data?.reviews || [];
    const currentPeriodReviews = allReviews.filter(review => isWithinInterval(new Date(review.createTime), { start: startOfDay(currentStartDate), end: endOfDay(currentEndDate) }));
    const previousPeriodReviews = allReviews.filter(review => isWithinInterval(new Date(review.createTime), { start: startOfDay(previousStartDate), end: endOfDay(previousEndDate) }));
    
    return {
      id: loc.name,
      details: detailsResult,
      currentPerformance: currentPerfResult.data,
      previousPerformance: previousPerfResult.data,
      posts: postsResult.data?.localPosts || [],
      reviews: allReviews,
      questions: questionsResult.data?.questions || [],
      currentPeriodReviews,
      previousPeriodReviews
    };
  }));

  return allData.filter(d => d !== null) as AllLocationsData[];
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string | null>(null);
  
  const [selectedLocation, setSelectedLocation] = useState<LocationFullData | null>(null);
  const [allLocationsData, setAllLocationsData] = useState<AllLocationsData[] | null>(null);

  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  
  const [managedLocationCount, setManagedLocationCount] = useState(0);

  useEffect(() => {
    // This effect handles loading data for a single selected location.
    if (selectedLocationName && accountId) {
        setIsDetailsLoading(true);
        setSelectedLocation(null);
        setAllLocationsData(null);
        setDetailsError(null);
        setActiveTab('overview');

        loadSingleLocationData(selectedLocationName, accountId)
            .then(data => {
                setSelectedLocation(data);
            })
            .catch(e => {
                setDetailsError(e.message || "Failed to fetch location details.");
            })
            .finally(() => {
                setIsDetailsLoading(false);
            });
    }
  }, [selectedLocationName, accountId]);
  
  const loadAllLocationsData = useCallback(async (locations: {name: string, title: string, accountId: string}[], newAccountId: string) => {
    setIsDetailsLoading(true);
    setAccountId(newAccountId);
    setSelectedLocationName(null);
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

  useEffect(() => {
    // This effect handles resetting state when the account ID is cleared.
    if (!accountId) {
      setSelectedLocationName(null);
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
