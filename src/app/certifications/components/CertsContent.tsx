"use client";

import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { CertGroups } from "./CertGroup";

type Cert = {
  id: string; title: string; institution: string; year: number;
  type: string; category: string; credentialId: string | null;
  credentialUrl: string | null; featured: boolean; hours?: number;
};

export function CertsContent({ certs }: { certs: Cert[] }) {
  const { t } = useLang();
  const [showAll, setShowAll] = useState(false);
  const featuredCerts = certs.filter((c) => c.featured);
  const total = certs.length;

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
              {featuredCerts.length} {t.certifications.featured} · {total} {t.certifications.total}
            </span>
          </p>
        </div>

        <CertGroups certs={showAll ? certs : featuredCerts} />

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-bg-surface text-text-secondary border border-border hover:border-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            {showAll ? t.certifications.showFeatured : `${t.certifications.viewAll} (${total})`}
          </button>
        </div>
      </div>
    </div>
  );
}
