"use client";

import { useLang } from "@/lib/LanguageContext";
import { ProjectsGrid } from "./ProjectsGrid";
import type { Project } from "@/types";

export function ProjectsContent({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-3">
            {t.projects.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            {t.projects.title}
          </h1>
          <p className="text-text-secondary max-w-xl">{t.projects.desc}</p>
        </div>
        <ProjectsGrid projects={projects} />
      </div>
    </div>
  );
}
