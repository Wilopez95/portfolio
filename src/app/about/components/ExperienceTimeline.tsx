"use client";

import { useLang } from "@/lib/LanguageContext";

type Experience = {
  id: string;
  company: string;
  role: string;
  period: { start: string; end: string | null };
  type: string;
  current: boolean;
  description: string;
  highlights: string[];
  stack: string[];
};

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  const { lang, t } = useLang();

  function formatPeriod(start: string, end: string | null): string {
    const locale = lang === "es" ? "es-CR" : "en-US";
    const fmt = (d: string) => {
      const [year, month] = d.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString(locale, { month: "short", year: "numeric" });
    };
    return `${fmt(start)} — ${end ? fmt(end) : t.timeline.present}`;
  }

  return (
    <ol className="relative space-y-10">
      {experience.map((exp, i) => (
        <li key={exp.id} className="relative pl-8">
          {/* Timeline line */}
          {i < experience.length - 1 && (
            <div className="absolute left-[7px] top-5 bottom-[-2.5rem] w-px bg-border" />
          )}

          {/* Dot */}
          <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
            exp.current
              ? "bg-text-primary border-text-primary"
              : "bg-bg-primary border-border"
          }`} />

          {/* Content */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-text-primary">
                {exp.company}
              </h3>
              {exp.current && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                  {t.timeline.current}
                </span>
              )}
              <span className="text-xs text-text-muted capitalize px-2 py-0.5 rounded bg-bg-surface border border-border">
                {exp.type}
              </span>
            </div>

            <p className="text-sm text-text-secondary font-medium">{exp.role}</p>
            <p className="text-xs text-text-muted">{formatPeriod(exp.period.start, exp.period.end)}</p>

            <p className="text-sm text-text-secondary leading-relaxed">{exp.description}</p>

            {exp.highlights.length > 0 && (
              <ul className="space-y-1 pt-1">
                {exp.highlights.map((h) => (
                  <li key={h} className="text-sm text-text-secondary flex gap-2">
                    <span className="text-text-muted shrink-0 mt-0.5">↳</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-1.5 pt-1">
              {exp.stack.slice(0, 6).map((tech) => (
                <span key={tech} className="px-2 py-0.5 rounded-full text-xs text-text-muted border border-border bg-bg-surface">
                  {tech}
                </span>
              ))}
              {exp.stack.length > 6 && (
                <span className="px-2 py-0.5 rounded-full text-xs text-text-muted border border-border bg-bg-surface">
                  +{exp.stack.length - 6} {t.timeline.more}
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
