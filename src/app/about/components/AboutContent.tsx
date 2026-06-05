"use client";

import { useLang } from "@/lib/LanguageContext";
import { Bio } from "./Bio";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { TechStack } from "./TechStack";

type Experience = {
  id: string; company: string; role: string;
  period: { start: string; end: string | null };
  type: string; current: boolean; description: string;
  highlights: string[]; stack: string[];
};

type SkillCategory = { label: string; items: { name: string; level: string; years: number }[] };

export function AboutContent({
  experience,
  skills,
}: {
  experience: Experience[];
  skills: Record<string, SkillCategory>;
}) {
  const { t } = useLang();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-3">
            {t.about.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
            Wilson López
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — Bio + Stack */}
          <div className="space-y-14">
            <section>
              <h2 className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-6">
                {t.about.background}
              </h2>
              <Bio />
            </section>

            <section>
              <h2 className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-6">
                {t.about.techStack}
              </h2>
              <TechStack skills={skills} />
            </section>
          </div>

          {/* Right — Experience */}
          <div>
            <h2 className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-6">
              {t.about.experience}
            </h2>
            <ExperienceTimeline experience={experience} />
          </div>

        </div>
      </div>
    </div>
  );
}
