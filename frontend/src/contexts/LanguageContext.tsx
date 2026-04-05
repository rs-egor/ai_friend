import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import ruTranslations from "@/locales/ru.json";
import enTranslations from "@/locales/en.json";

type Lang = "ru" | "en";

type Translations = typeof ruTranslations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Translations> = {
  ru: ruTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "ru" || saved === "en") return saved;
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = translations[lang];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
};
