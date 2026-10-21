"use client";

import { useLang } from "@/lib/LanguageContext";

export type FilterKey = "all" | "enterprise" | "ai" | "saas" | "mobile";

interface ProjectFiltersProps {
  filters: FilterKey[];
  active: FilterKey;
  onChange: (filter: FilterKey) => void;
}

export function ProjectFilters({ filters, active, onChange }: ProjectFiltersProps) {
  const { t } = useLang();
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            active === key
              ? "bg-text-primary text-bg-primary"
              : "bg-bg-surface text-text-secondary border border-border hover:border-text-muted hover:text-text-primary"
          }`}
        >
          {t.projects.filters[key]}
        </button>
      ))}
    </div>
  );
}
