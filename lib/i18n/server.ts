import { cookies } from "next/headers";
import enTranslations from "./translations/en.json";
import bnTranslations from "./translations/bn.json";
import { Language, TranslationKey } from "./i18n-context";

// Translation resources
const resources = {
  en: enTranslations,
  bn: bnTranslations,
};

/**
 * Get translation for a key in server components
 * @param key Translation key
 * @param params Parameters to replace in the translation
 * @returns Translated string
 */
export function getServerTranslation(
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  // Get language from cookies
  const cookieStore = cookies();
  const languageCookie = (await cookieStore).get("language");
  const language = (languageCookie?.value || "en") as Language;

  // Get translation
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
      return acc.replace(
        new RegExp(`{{${paramKey}}}`, "g"),
        String(paramValue)
      );
    }, value);
  }

  return value;
}

/**
 * Get the current language from cookies
 * @returns Current language
 */
export async function getServerLanguage(): Promise<Language> {
  const cookieStore = cookies();
  const languageCookie = (await cookieStore).get("language");
  return (languageCookie?.value || "en") as Language;
}
