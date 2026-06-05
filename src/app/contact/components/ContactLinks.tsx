const LINKS = [
  {
    label: "Email",
    value: "wilopez95@gmail.com",
    href: "mailto:wilopez95@gmail.com",
    icon: EmailIcon,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/wilopez95",
    href: "https://linkedin.com/in/wilopez95",
    icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    value: "github.com/Wilopez95",
    href: "https://github.com/Wilopez95",
    icon: GitHubIcon,
  },
];

export function ContactLinks() {
  return (
    <div className="space-y-4">
      {LINKS.map(({ label, value, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="flex items-center gap-4 p-4 rounded-xl border border-border bg-bg-card hover:border-text-muted transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-bg-surface border border-border flex items-center justify-center shrink-0 text-text-muted group-hover:text-text-primary transition-colors">
            <Icon />
          </div>
          <div>
            <p className="text-xs text-text-muted mb-0.5">{label}</p>
            <p className="text-sm font-medium text-text-primary">{value}</p>
          </div>
          <svg className="ml-auto text-text-muted group-hover:text-text-primary transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      ))}
    </div>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S9 17.44 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
