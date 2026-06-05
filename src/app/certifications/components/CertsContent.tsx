"use client";

import { useLang } from "@/lib/LanguageContext";
import { CertGroups } from "./CertGroup";

type Cert = {
  id: string; title: string; institution: string; year: number;
  type: string; category: string; credentialId: string | null;
  credentialUrl: string | null; showOnPortfolio: boolean; hours?: number;
};

export function CertsContent({ certs }: { certs: Cert[] }) {
  const { t } = useLang();
  const total = certs.length;
  const featured = certs.filter((c) => c.showOnPortfolio).length;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-3">
            {t.certifications.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            {t.certifications.title}
          </h1>
          <p className="text-text-secondary max-w-xl leading-relaxed">
            {t.certifications.desc}{" "}
            <span className="text-text-muted">
              {featured} {t.certifications.featured} · {total} {t.certifications.total}
            </span>
          </p>
        </div>
        <CertGroups certs={certs} />
      </div>
    </div>
  );
}
