
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isTeamMember, getSubscriptionStatus, Subscription, createUserDocumentIfNotExists } from "./actions";

type UserRole = 'owner' | 'teamMember' | null;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  role: UserRole;
  teamOwnerId: string | null;
  subscription: Subscription | null;
  isSubscriptionLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  role: null,
  teamOwnerId: null,
  subscription: null,
  isSubscriptionLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [teamOwnerId, setTeamOwnerId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoading(true);
      setIsSubscriptionLoading(true);
      setSubscription(null); // Reset subscription on user change

      if (currentUser) {
        // Create user document on first login
        await createUserDocumentIfNotExists(currentUser.uid, currentUser.email, currentUser.displayName);

        // Check if the current user is the admin
        if (currentUser.uid === process.env.ADMIN_UID) {
          setRole('owner');
          setTeamOwnerId(null);
          // Grant admin a permanent "enterprise" plan
          setSubscription({
            planId: 'enterprise',
            status: 'active',
            trial_end: null,
            current_period_end: null,
            cancel_at_period_end: false,
          });
        } else {
          // Determine if user is a team member or owner
          const roleResult = await isTeamMember(currentUser.uid);
          
          if (roleResult.isTeamMember && roleResult.ownerId) {
            setRole('teamMember');
            setTeamOwnerId(roleResult.ownerId);
            // Team member's access is determined by the owner's subscription
            const ownerSubscriptionResult = await getSubscriptionStatus(roleResult.ownerId);
            if (ownerSubscriptionResult.subscription) {
              setSubscription(ownerSubscriptionResult.subscription);
            }
          } else {
            setRole('owner');
            setTeamOwnerId(null);
            // Owner's access is determined by their own subscription
            const subscriptionResult = await getSubscriptionStatus(currentUser.uid);
            if (subscriptionResult.subscription) {
              setSubscription(subscriptionResult.subscription);
            }
          }
        }
        
      } else {
        // Reset all states on logout
        setRole(null);
        setTeamOwnerId(null);
        setSubscription(null);
      }

      setIsSubscriptionLoading(false);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
    role,
    teamOwnerId,
    subscription,
    isSubscriptionLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
