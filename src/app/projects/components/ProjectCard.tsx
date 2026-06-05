"use client";

import { useLang } from "@/lib/LanguageContext";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  const { t } = useLang();

  const STATUS_LABEL: Record<string, string> = {
    active: t.projects.active,
    completed: t.projects.completed,
    "in-progress": t.projects.inProgress,
  };

  const STATUS_CLASS: Record<string, string> = {
    active: "bg-green-500/10 text-green-600 dark:text-green-400",
    completed: "bg-bg-surface text-text-muted",
    "in-progress": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  return (
    <article className="group flex flex-col bg-bg-card border border-border rounded-xl overflow-hidden hover:border-text-muted transition-colors duration-200">
      <div className="h-0.5 w-full bg-border group-hover:bg-text-muted transition-colors duration-200" />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Tags + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {project.categories.slice(0, 2).map((cat) => (
              <span key={cat} className="px-2 py-0.5 rounded text-xs font-medium bg-bg-surface text-text-muted border border-border">
                {cat}
              </span>
            ))}
          </div>
          <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${STATUS_CLASS[project.status]}`}>
            {STATUS_LABEL[project.status]}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-semibold text-text-primary leading-snug mb-1">{project.title}</h3>
          <p className="text-xs text-text-muted">{project.company} · {project.role}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed flex-1">{project.description}</p>

        {/* Stack */}
        {project.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span key={tech} className="px-2.5 py-1 rounded-full text-xs text-text-muted border border-border bg-bg-surface">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-text-muted hover:text-text-primary transition-colors">
              GitHub →
            </a>
          )}
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-text-muted hover:text-text-primary transition-colors">
              {t.projects.liveDemo}
            </a>
          )}
          {!project.links.github && !project.links.demo && (
            <span className="text-xs text-text-muted italic">{t.projects.privateProject}</span>
          )}
        </div>
      </div>
    </article>
  );
}
