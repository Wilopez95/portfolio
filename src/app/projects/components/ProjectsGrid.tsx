"use client";

import { useState } from "react";
import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [active, setActive] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(projects.flatMap((p) => p.categories))),
  ];

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.categories.includes(active));

  return (
    <div className="space-y-8">
      <ProjectFilters categories={categories} active={active} onChange={setActive} />

      {filtered.length === 0 ? (
        <p className="text-text-muted text-sm py-12 text-center">No projects in this category.</p>
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
