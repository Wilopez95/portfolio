"use client";

import { useLang } from "@/lib/LanguageContext";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-bg-surface p-0.5 text-xs font-semibold">
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
          lang === "en"
            ? "bg-bg-card text-text-primary shadow-sm"
            : "text-text-muted hover:text-text-secondary"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("es")}
        className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
          lang === "es"
            ? "bg-bg-card text-text-primary shadow-sm"
            : "text-text-muted hover:text-text-secondary"
        }`}
      >
        ES
      </button>
    </div>
  );
}
