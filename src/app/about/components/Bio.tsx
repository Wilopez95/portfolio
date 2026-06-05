"use client";

import { useLang } from "@/lib/LanguageContext";

export function Bio() {
  const { t } = useLang();
  const b = t.bio;

  return (
    <div className="space-y-5 text-text-secondary leading-relaxed">
      <p>{b.p1}</p>
      <p>{b.p2}</p>
      <p>
        {b.p3Pre}{" "}
        <span className="text-text-primary font-medium">Imprivata</span>
        {b.p3Post}
      </p>
      <p>
        {b.p4.split("AI engineering").map((part, i) =>
          i === 0 ? (
            <span key={i}>
              {part}
              <span className="text-text-primary font-medium">AI engineering</span>
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>

      {/* Quick facts */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        {[
          { label: b.factLocation, value: b.factLocationVal },
          { label: b.factAvailability, value: b.factAvailabilityVal },
          { label: b.factLanguages, value: b.factLanguagesVal },
          { label: b.factDegree, value: b.factDegreeVal },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm text-text-primary font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
