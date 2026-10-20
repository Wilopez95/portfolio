"use client";

import Image from "next/image";
import { useLang } from "@/lib/LanguageContext";
import type { Project } from "@/types";

function ProjectMedia({ project, spotlight }: { project: Project; spotlight: boolean }) {
  const frame = `relative overflow-hidden bg-bg-surface border-border ${
    spotlight ? "aspect-[16/9] lg:aspect-auto lg:w-1/2 border-b lg:border-b-0 lg:border-r" : "aspect-[16/9] border-b"
  }`;

  if (project.image) {
    return (
      <div className={frame}>
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes={spotlight ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover object-top"
        />
      </div>
    );
  }

  // Placeholder until a screenshot is added (set `image` in data/projects.json)
  const words = project.title.split(/[\s/—()-]+/).filter(Boolean);
  const initials = (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();

  return (
    <div className={`${frame} flex items-center justify-center`} aria-hidden>
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <span className="relative font-mono text-3xl font-semibold tracking-tight text-text-muted">
        {initials}
      </span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { lang, t } = useLang();
  const spotlight = !!project.spotlight;
  const desc = project.description[lang];

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

  const linkClass = "text-xs font-medium text-text-muted hover:text-text-primary transition-colors";

  return (
    <article
      className={`group flex flex-col bg-bg-card border border-border rounded-xl overflow-hidden hover:border-text-muted transition-colors duration-200 ${
        spotlight ? "md:col-span-2 lg:flex-row" : ""
      }`}
    >
      <ProjectMedia project={project} spotlight={spotlight} />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Tags + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {spotlight && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-text-primary text-bg-primary">
                {t.projects.featured}
              </span>
            )}
            {project.categories.slice(0, spotlight ? 3 : 2).map((cat) => (
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
          <h3 className={`${spotlight ? "text-xl" : "text-base"} font-semibold text-text-primary leading-snug mb-1`}>
            {project.title}
          </h3>
          <p className="text-xs text-text-muted">
            {project.position ?? t.projects.personalProject}
            {project.role && <span className="ml-2 px-1.5 py-px rounded border border-border">{project.role}</span>}
          </p>
        </div>

        {/* Problem → What I did → Result */}
        <dl className="space-y-2.5 flex-1 text-sm leading-relaxed">
          {([
            [t.projects.problem, desc.problem],
            [t.projects.solution, desc.solution],
            [t.projects.result, desc.result],
          ] as const).map(([label, text]) => (
            <div key={label}>
              <dt className="text-[11px] font-semibold text-text-muted tracking-widest uppercase mb-0.5">{label}</dt>
              <dd className="text-text-secondary">{text}</dd>
            </div>
          ))}
        </dl>

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
          {project.links.website && (
            <a href={project.links.website} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {t.projects.visitSite}
            </a>
          )}
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
              GitHub →
            </a>
          )}
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {t.projects.liveDemo}
            </a>
          )}
          {!project.links.website && !project.links.github && !project.links.demo && (
            <span className="text-xs text-text-muted italic">{t.projects.privateProject}</span>
          )}
        </div>
      </div>
    </article>
  );
}
