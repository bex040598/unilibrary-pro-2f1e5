import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../../messages/en.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import uz from "../../messages/uz.json";
import type { Locale } from "../types";

interface Dictionary {
  [key: string]: string | Dictionary;
}

const messages: Record<Locale, Dictionary> = { uz, ru, en, tr };
const supportedLocales: Locale[] = ["uz", "ru", "en", "tr"];

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  locales: Locale[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readPath(locale: Locale) {
  const segment = window.location.pathname.split("/")[1];
  return supportedLocales.includes(segment as Locale) ? (segment as Locale) : locale;
}

function getNestedValue(dictionary: Dictionary, key: string): string | undefined {
  return key.split(".").reduce<string | Dictionary | undefined>((result, part) => {
    if (result && typeof result === "object" && part in result) {
      return result[part] as string | Dictionary;
    }
    return undefined;
  }, dictionary) as string | undefined;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readPath("uz"));

  useEffect(() => {
    setLocaleState(readPath(locale));
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    locales: supportedLocales,
    setLocale(nextLocale) {
      const segments = window.location.pathname.split("/").filter(Boolean);
      const rest = supportedLocales.includes(segments[0] as Locale) ? segments.slice(1) : segments;
      window.location.pathname = `/${nextLocale}/${rest.join("/")}`;
      setLocaleState(nextLocale);
    },
    t(key) {
      return (
        getNestedValue(messages[locale], key) ??
        getNestedValue(messages.uz, key) ??
        key
      );
    }
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
