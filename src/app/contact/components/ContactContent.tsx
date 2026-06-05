"use client";

import { useLang } from "@/lib/LanguageContext";
import { ContactForm } from "./ContactForm";
import { ContactLinks } from "./ContactLinks";

export function ContactContent() {
  const { t } = useLang();
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-16 max-w-xl">
          <p className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-3">
            {t.contact.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            {t.contact.title}
          </h1>
          <p className="text-text-secondary leading-relaxed">{t.contact.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <ContactForm />
          </div>
          <div className="space-y-8">
            <ContactLinks />
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-text-muted leading-relaxed">
                {t.contact.location}{" "}
                <span className="text-text-secondary">Costa Rica</span>{" "}
                {t.contact.locationMid}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
