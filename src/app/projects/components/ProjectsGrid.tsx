"use client";

import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters, type FilterKey } from "./ProjectFilters";

// Maps each project tag to one of the top-level filters
const TAG_TO_FILTER: Record<string, Exclude<FilterKey, "all">> = {
  Enterprise: "enterprise",
  ERP: "enterprise",
  Security: "enterprise",
  PAM: "enterprise",
  Frontend: "enterprise",
  AI: "ai",
  Agents: "ai",
  WhatsApp: "ai",
  "Data Analytics": "ai",
  SaaS: "saas",
  Mobile: "mobile",
  "E-commerce": "mobile",
};

const FILTERS: FilterKey[] = ["all", "enterprise", "ai", "saas", "mobile"];

function filtersOf(project: Project): Set<FilterKey> {
  return new Set(project.categories.map((c) => TAG_TO_FILTER[c]).filter((f): f is Exclude<FilterKey, "all"> => !!f));
}

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const { t } = useLang();
  const [active, setActive] = useState<FilterKey>("all");

  const filtered = (active === "all" ? projects : projects.filter((p) => filtersOf(p).has(active)))
    .slice()
    .sort((a, b) => Number(!!b.spotlight) - Number(!!a.spotlight));

  return (
    <div className="space-y-8">
      <ProjectFilters filters={FILTERS} active={active} onChange={setActive} />

      {filtered.length === 0 ? (
        <p className="text-text-muted text-sm py-12 text-center">{t.projects.empty}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
