"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations, type Lang, type T } from "./translations";

const STORAGE_KEY = "wl-lang";

function detectLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored === "en" || stored === "es") {
    console.log("[lang] loaded from localStorage:", stored);
    return stored;
  }
  const browser = navigator.language || navigator.languages?.[0] || "en";
  console.log("[lang] navigator.language:", navigator.language);
  console.log("[lang] navigator.languages:", [...(navigator.languages ?? [])]);
  const detected: Lang = browser.toLowerCase().startsWith("es") ? "es" : "en";
  console.log("[lang] detected:", detected);
  return detected;
}

type ContextValue = { lang: Lang; setLang: (l: Lang) => void; t: T };

const LanguageContext = createContext<ContextValue>({
  lang: "en",
  setLang: () => {},
  t: translations["en"],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en"); // "en" matches SSR — no hydration mismatch

  useEffect(() => {
    setLang(detectLang());
  }, []);

  function handleSetLang(l: Lang) {
    localStorage.setItem(STORAGE_KEY, l);
    setLang(l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
