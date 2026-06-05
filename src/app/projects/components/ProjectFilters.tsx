"use client";

interface ProjectFiltersProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export function ProjectFilters({ categories, active, onChange }: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            active === cat
              ? "bg-text-primary text-bg-primary"
              : "bg-bg-surface text-text-secondary border border-border hover:border-text-muted hover:text-text-primary"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
