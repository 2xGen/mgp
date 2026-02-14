"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type ConsentStatus = 'granted' | 'denied' | 'not-set';

interface CookieConsentContextType {
  consentStatus: ConsentStatus;
  grantConsent: () => void;
  denyConsent: () => void;
  resetConsent: () => void;
  showBanner: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const COOKIE_CONSENT_KEY = 'mygoprofile-cookie-consent';

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('not-set');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (storedConsent === 'granted' || storedConsent === 'denied') {
        setConsentStatus(storedConsent);
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    } catch (error) {
        // If localStorage is not available (e.g. server-side or blocked), default to not showing banner
        // and not having consent.
        setShowBanner(false);
        setConsentStatus('denied');
    }
  }, []);

  const grantConsent = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'granted');
      setConsentStatus('granted');
      setShowBanner(false);
    } catch (error) {
        console.error("Could not save cookie consent.", error);
    }
  }, []);

  const denyConsent = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'denied');
      setConsentStatus('denied');
      setShowBanner(false);
    } catch(error) {
      console.error("Could not save cookie consent.", error);
    }
  }, []);
  
  const resetConsent = useCallback(() => {
    try {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        setConsentStatus('not-set');
        setShowBanner(true);
    } catch(error) {
      console.error("Could not reset cookie consent.", error);
    }
  }, []);

  const value = {
    consentStatus,
    grantConsent,
    denyConsent,
    resetConsent,
    showBanner,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
