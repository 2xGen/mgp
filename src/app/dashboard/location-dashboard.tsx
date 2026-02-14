
"use client";

import MasterDashboard from "./master-dashboard";
import LocationDetails from "./location-details";
import PerformanceDashboard from "./performance-dashboard";
import ReviewsDashboard from "./reviews-dashboard";
import MediaList from "./media-list";
import LocalPostsList from "./local-posts-list";
import QuestionList from "./question-list";
import { useDashboard } from "@/app/dashboard/dashboard-provider";
import { useState, useEffect } from "react";
import EditableCoreInfo from "./editable-core-info";
import EditableDescription from "./editable-description";
import EditableOpeningHours from "./editable-opening-hours";
import type { LocationDetailsData } from "./dashboard-provider";
import { useAuth } from "@/app/auth-provider";
import OptimizationAlerts from "./optimization-alerts";

export default function LocationDashboard() {
    const { selectedLocation, accountId, activeTab } = useDashboard();
    const { user } = useAuth();
    
    const [currentLocationDetails, setCurrentLocationDetails] = useState<LocationDetailsData | null>(null);

    useEffect(() => {
        if (selectedLocation) {
            setCurrentLocationDetails(selectedLocation.details);
        }
    }, [selectedLocation]);

    if (!selectedLocation || !accountId || !currentLocationDetails || !user) {
        return null; 
    }
    
    const handleLocationUpdate = (updatedData: Partial<LocationDetailsData>) => {
        setCurrentLocationDetails(prev => prev ? { ...prev, ...updatedData } : null);
    };

    const { 
        currentPerformance, 
        previousPerformance, 
        posts, 
        reviews, 
        questions, 
        currentPeriodReviews, 
        previousPeriodReviews
    } = selectedLocation;
    
    const accountIdNum = accountId.split('/')[1];
    const locationId = currentLocationDetails.name.split('/')[1];
    const fullLocationPath = `accounts/${accountIdNum}/locations/${locationId}`;

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-4">
                        <MasterDashboard
                            userId={user.uid}
                            location={currentLocationDetails}
                            currentPerformance={currentPerformance}
                            previousPerformance={previousPerformance}
                            posts={posts}
                            reviews={reviews}
                            questions={questions}
                            currentPeriodReviews={currentPeriodReviews}
                            previousPeriodReviews={previousPeriodReviews}
                        />
                    </div>
                );
            case 'performance':
                return <PerformanceDashboard locationName={currentLocationDetails.name} />;
            case 'reviews':
                return <ReviewsDashboard reviews={reviews} accountId={accountId} />;
            case 'details':
                return (
                     <div className="space-y-8">
                        <OptimizationAlerts location={currentLocationDetails} />
                        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                            <div className="flex flex-col gap-8">
                                <EditableCoreInfo
                                    location={currentLocationDetails}
                                    onUpdateSuccess={handleLocationUpdate}
                                />
                            </div>
                            <div className="flex flex-col gap-8">
                                <EditableDescription 
                                    locationName={currentLocationDetails.name}
                                    description={currentLocationDetails.profile?.description}
                                    onUpdateSuccess={(newDescription) => handleLocationUpdate({ profile: { ...currentLocationDetails.profile, description: newDescription }})}
                                />
                                <EditableOpeningHours
                                    locationName={currentLocationDetails.name}
                                    regularHours={currentLocationDetails.regularHours}
                                    onUpdateSuccess={(newHours) => handleLocationUpdate({ regularHours: newHours })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'media':
                return <MediaList locationName={fullLocationPath} />;
            case 'posts':
                return <LocalPostsList locationName={fullLocationPath} />;
            case 'qa':
                return <QuestionList locationName={currentLocationDetails.name} accountId={accountId} allQuestions={questions} isLoading={false} error={null} />;
            default:
                return null;
        }
    }

    return (
        <div className="space-y-4">
           {renderActiveTab()}
        </div>
    )
}
