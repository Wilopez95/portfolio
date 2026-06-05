type Cert = {
  id: string;
  title: string;
  institution: string;
  year: number;
  type: string;
  category: string;
  credentialId: string | null;
  credentialUrl: string | null;
  hours?: number;
};

const TYPE_LABEL: Record<string, string> = {
  degree:        "Degree",
  certification: "Certification",
  course:        "Course",
  participation: "Participation",
};

const CATEGORY_ICON: Record<string, string> = {
  education:    "🎓",
  security:     "🔐",
  architecture: "🏗️",
  frontend:     "⚛️",
  backend:      "⚙️",
  fullstack:    "🔧",
  methodology:  "📋",
  networking:   "🌐",
  devops:       "🐳",
  language:     "💬",
  "soft-skills":"🤝",
};

export function CertCard({ cert }: { cert: Cert }) {
  const icon = CATEGORY_ICON[cert.category] ?? "📄";
  const typeLabel = TYPE_LABEL[cert.type] ?? cert.type;

  return (
    <article className="flex gap-4 p-5 rounded-xl border border-border bg-bg-card hover:border-text-muted transition-colors group">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-bg-surface border border-border flex items-center justify-center shrink-0 text-lg">
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-primary leading-snug">
            {cert.title}
          </h3>
          <span className="shrink-0 text-xs text-text-muted bg-bg-surface border border-border px-2 py-0.5 rounded">
            {cert.year}
          </span>
        </div>

        <p className="text-xs text-text-secondary">{cert.institution}</p>

        <div className="flex items-center gap-3 mt-1 overflow-hidden">
          <span className="text-xs text-text-muted shrink-0">{typeLabel}</span>
          {cert.hours && (
            <span className="text-xs text-text-muted shrink-0">{cert.hours}h</span>
          )}
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-text-primary underline underline-offset-2 transition-colors shrink-0"
            >
              View credential →
            </a>
          )}
          {cert.credentialId && !cert.credentialUrl && (
            <span className="text-xs text-text-muted font-mono truncate min-w-0">
              #{cert.credentialId}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
