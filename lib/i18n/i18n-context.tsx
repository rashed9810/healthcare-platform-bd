"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import enTranslations from "./translations/en.json";
import bnTranslations from "./translations/bn.json";

// Available languages
export type Language = "en" | "bn";

// Translation resources
const resources = {
  en: enTranslations,
  bn: bnTranslations,
};

// Type for nested translation keys
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}` | `${K & string}.${NestedKeyOf<T[K]> & string}`;
    }[keyof T]
  : never;

// Type for translation keys
export type TranslationKey = NestedKeyOf<typeof enTranslations>;

// Context interface
interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  dir: () => "ltr" | "rtl";
  availableLanguages: { code: Language; name: string }[];
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Available languages with their names
const availableLanguages = [
  { code: "en" as Language, name: "English" },
  { code: "bn" as Language, name: "বাংলা" },
];

// Provider component
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [storedLanguage, setStoredLanguage] = useLocalStorage<Language>("language", "en");
  const [language, setLanguage] = useState<Language>(storedLanguage);

  // Update stored language when language changes
  useEffect(() => {
    setStoredLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir();
  }, [language, setStoredLanguage]);

  // Get translation for a key
  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: any = resources[language];

    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }

    if (typeof value !== "string") return key;

    // Replace parameters in the translation
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{{${paramKey}}}`, "g"), String(paramValue));
      }, value);
    }

    return value;
  };

  // Get text direction based on language
  const dir = (): "ltr" | "rtl" => {
    // Add RTL languages here if needed
    const rtlLanguages: Language[] = [];
    return rtlLanguages.includes(language) ? "rtl" : "ltr";
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir,
        availableLanguages,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use the i18n context
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
