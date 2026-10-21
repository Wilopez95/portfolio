"use client";

import { useLang } from "@/lib/LanguageContext";
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

// Priority order for groups
const GROUP_ORDER = [
  "education", "security", "architecture", "ai",
  "frontend", "backend", "fullstack",
  "methodology", "devops", "networking", "language", "soft-skills",
];

const rank = (category: string) => {
  const i = GROUP_ORDER.indexOf(category);
  return i === -1 ? GROUP_ORDER.length : i;
};

export function CertGroups({ certs }: { certs: Cert[] }) {
  const { t } = useLang();

  const grouped = certs.reduce<Record<string, Cert[]>>((acc, cert) => {
    const key = cert.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(cert);
    return acc;
  }, {});

  const sortedGroups = Object.keys(grouped).sort((a, b) => rank(a) - rank(b));

  return (
    <div className="space-y-12">
      {sortedGroups.map((category) => (
        <section key={category}>
          <h2 className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-4">
            {t.certifications.groups[category] ?? category}
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
