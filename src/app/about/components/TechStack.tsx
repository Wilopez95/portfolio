const LEVEL_DOT: Record<string, number> = {
  expert: 4,
  advanced: 3,
  intermediate: 2,
  beginner: 1,
  learning: 1,
};

const LEVEL_COLOR: Record<string, string> = {
  expert:       "bg-text-primary",
  advanced:     "bg-text-secondary",
  intermediate: "bg-border",
  beginner:     "bg-border",
  learning:     "bg-blue-400/60",
};

type SkillItem = { name: string; level: string; years: number };
type SkillCategory = { label: string; items: SkillItem[] };

// Only show the most relevant categories for a dev portfolio
const SHOW_CATEGORIES = ["frontend", "backend", "cloud", "databases", "ai"];

export function TechStack({ skills }: { skills: Record<string, SkillCategory> }) {
  const categories = SHOW_CATEGORIES.filter((k) => skills[k]);

  return (
    <div className="space-y-8">
      {categories.map((key) => {
        const { label, items } = skills[key];
        return (
          <div key={key}>
            <h3 className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-3">
              {label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface border border-border"
                >
                  <span className="text-sm text-text-primary font-medium">
                    {item.name}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          i < LEVEL_DOT[item.level]
                            ? LEVEL_COLOR[item.level]
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-text-muted pt-2">
        ●●●● Expert &nbsp;·&nbsp; ●●●○ Advanced &nbsp;·&nbsp; ●●○○ Intermediate &nbsp;·&nbsp; <span className="text-blue-400/80">●</span> Learning
      </p>
    </div>
  );
}
