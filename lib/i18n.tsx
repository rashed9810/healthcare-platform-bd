"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface I18nContextType {
  language: "en" | "bn";
  setLanguage: (lang: "en" | "bn") => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [isClient, setIsClient] = useState(false);

  // Mark when we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load language preference from localStorage on mount
  useEffect(() => {
    if (isClient) {
      const savedLanguage = localStorage.getItem("language") as "en" | "bn";
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "bn")) {
        setLanguage(savedLanguage);
      }
    }
  }, [isClient]);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("language", language);
    }
  }, [language, isClient]);

  const changeLanguage = (lang: "en" | "bn") => {
    setLanguage(lang);
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
