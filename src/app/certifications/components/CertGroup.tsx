import { CertCard } from "./CertCard";

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

const GROUP_LABELS: Record<string, string> = {
  education:    "Education",
  security:     "Security",
  architecture: "Architecture",
  frontend:     "Frontend",
  backend:      "Backend",
  fullstack:    "Fullstack",
  methodology:  "Methodology",
  networking:   "Networking",
  devops:       "DevOps",
  language:     "Languages",
};

// Priority order for groups
const GROUP_ORDER = [
  "education", "security", "architecture",
  "frontend", "backend", "fullstack",
  "methodology", "devops", "networking", "language",
];

export function CertGroups({ certs }: { certs: Cert[] }) {
  const grouped = certs.reduce<Record<string, Cert[]>>((acc, cert) => {
    const key = cert.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(cert);
    return acc;
  }, {});

  const sortedGroups = Object.keys(grouped).sort(
    (a, b) => (GROUP_ORDER.indexOf(a) ?? 99) - (GROUP_ORDER.indexOf(b) ?? 99)
  );

  return (
    <div className="space-y-12">
      {sortedGroups.map((category) => (
        <section key={category}>
          <h2 className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-4">
            {GROUP_LABELS[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {grouped[category]
              .sort((a, b) => b.year - a.year)
              .map((cert) => (
                <CertCard key={cert.id} cert={cert} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
