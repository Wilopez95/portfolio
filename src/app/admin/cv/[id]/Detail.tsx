"use client";

import Link from "next/link";
import type { CvRequestRecord, StoredFile } from "@/lib/admin/cv-schema";
import { useAdminT } from "../../_lib/i18n";
import { AdminHeader } from "../../_components/AdminHeader";
import { StatusBadge, formatBytes } from "../../_components/ui";
import { fileUrl, outputLabel } from "../_lib/files";
import { buildAnswerSections } from "../_lib/answers";

export function Detail({ record }: { record: CvRequestRecord }) {
  const { t, lang } = useAdminT();
  const d = t.detail;
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-CR" : "en-US", { dateStyle: "medium", timeStyle: "short" });
  const uploads = Object.entries(record.uploads).filter((e): e is [string, StoredFile] => Boolean(e[1]));
  const sections = buildAnswerSections(record.data, t);

  return (
    <div className="max-w-4xl mx-auto px-6">
      <AdminHeader
        title={record.label}
        subtitle={`${t.dashboard.created} ${fmt.format(new Date(record.createdAt))} · ${record.id}`}
        back={{ href: "/admin/cv", label: d.back }}
        action={
          <Link
            href={`/admin/cv/new?from=${record.id}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
          >
            {t.dashboard.duplicate}
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <section className="rounded-xl border border-border bg-bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-text-muted tracking-widest uppercase">{d.files}</h2>
            <StatusBadge status={record.status} label={record.status === "ready" ? t.dashboard.ready : t.dashboard.pending} />
          </div>
          {record.outputs.length ? (
            <ul className="space-y-2">
              {record.outputs.map((o) => (
                <li key={o.pathname}>
                  <a href={fileUrl(record.id, o.pathname)} className="text-sm text-text-primary hover:underline underline-offset-4">
                    ↓ {outputLabel(o, t)}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">
              {d.noOutputs} {t.dashboard.howToGenerate}{" "}
              <code className="font-mono text-text-secondary">/cv-builder {record.id}</code>
            </p>
          )}
          {record.generatorNotes && (
            <div className="pt-3 border-t border-border-subtle">
              <p className="text-xs font-semibold text-text-muted mb-1">{d.generatorNotes}</p>
              <p className="text-sm text-text-secondary whitespace-pre-line">{record.generatorNotes}</p>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-bg-card p-5 space-y-3">
          <h2 className="text-xs font-semibold text-text-muted tracking-widest uppercase">{d.uploads}</h2>
          {uploads.length ? (
            <ul className="space-y-2">
              {uploads.map(([kind, f]) => (
                <li key={kind} className="text-sm">
                  <a href={fileUrl(record.id, f.pathname, true)} target="_blank" rel="noreferrer" className="text-text-primary hover:underline underline-offset-4">
                    {f.filename}
                  </a>{" "}
                  <span className="text-text-muted">· {formatBytes(f.size)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">{t.summary.none}</p>
          )}
          <dl className="pt-3 border-t border-border-subtle text-xs text-text-muted space-y-1">
            <div>{d.emailSent}: {record.emailSent ? t.common.yes : t.common.no}</div>
            {record.duplicatedFrom && (
              <div>
                {d.duplicatedFrom}:{" "}
                <Link href={`/admin/cv/${record.duplicatedFrom}`} className="underline underline-offset-2">{record.duplicatedFrom}</Link>
              </div>
            )}
          </dl>
        </section>
      </div>

      <h2 className="text-xl font-bold text-text-primary mb-4">{d.answers}</h2>
      <div className="space-y-4">
        {sections.map((s) => (
          <section key={s.title} className="rounded-xl border border-border bg-bg-card p-5">
            <h3 className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-4">{s.title}</h3>
            {s.groups.map((g, gi) => (
              <dl key={gi} className={`grid sm:grid-cols-[220px_1fr] gap-x-6 gap-y-2 ${gi > 0 ? "mt-4 pt-4 border-t border-border-subtle" : ""}`}>
                {g.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-sm text-text-muted">{k}</dt>
                    <dd className="text-sm text-text-primary whitespace-pre-line break-words">{v}</dd>
                  </div>
                ))}
              </dl>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
