"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Subscription, UserRole } from "@/lib/types";
import { getSubscriptionStatus, isTeamMember, createUserDocumentIfNotExists } from "@/app/actions";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  role: UserRole;
  teamOwnerId: string | null;
  subscription: Subscription | null;
  isSubscriptionLoading: boolean;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  role: null,
  teamOwnerId: null,
  subscription: null,
  isSubscriptionLoading: true,
  signOut: async () => {},
  refreshSubscription: async () => {},
});

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [teamOwnerId, setTeamOwnerId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);

  const hydrateAccess = async (currentUser: User) => {
    setIsSubscriptionLoading(true);

    if (
      process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
      currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      setRole("owner");
      setTeamOwnerId(null);
      setSubscription({
        planId: "enterprise",
        status: "active",
        trial_end: null,
        current_period_end: null,
        cancel_at_period_end: false,
      });
      setIsSubscriptionLoading(false);
      return;
    }

    const roleResult = await isTeamMember(currentUser.id);
    if (roleResult.isTeamMember && roleResult.ownerId) {
      setRole("teamMember");
      setTeamOwnerId(roleResult.ownerId);
      const ownerSub = await getSubscriptionStatus(roleResult.ownerId);
      setSubscription(ownerSub.subscription);
    } else {
      setRole("owner");
      setTeamOwnerId(null);
      const ownSub = await getSubscriptionStatus(currentUser.id);
      setSubscription(ownSub.subscription);
    }

    setIsSubscriptionLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setRole(null);
      setTeamOwnerId(null);
      setSubscription(null);
      setIsSubscriptionLoading(false);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    const loadSession = async () => {
      setIsLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setTeamOwnerId(null);
        setSubscription(null);
        setIsSubscriptionLoading(false);
        setIsLoading(false);
        return;
      }

      await createUserDocumentIfNotExists(
        currentUser.id,
        currentUser.email ?? null,
        (currentUser.user_metadata?.full_name as string | undefined) ||
          (currentUser.user_metadata?.name as string | undefined) ||
          null
      );
      await hydrateAccess(currentUser);
      if (!cancelled) setIsLoading(false);
    };

    void loadSession();

    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setRole(null);
        setTeamOwnerId(null);
        setSubscription(null);
        setIsSubscriptionLoading(false);
        setIsLoading(false);
      } else {
        void loadSession();
      }
    });

    return () => {
      cancelled = true;
      authSub.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setTeamOwnerId(null);
    setSubscription(null);
  };

  const refreshSubscription = async () => {
    if (!user) return;
    await hydrateAccess(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        role,
        teamOwnerId,
        subscription,
        isSubscriptionLoading,
        signOut,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
