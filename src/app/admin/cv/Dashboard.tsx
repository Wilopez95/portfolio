"use client";

import Link from "next/link";
import type { OutputFile } from "@/lib/admin/cv-schema";
import { useAdminT } from "../_lib/i18n";
import { AdminHeader } from "../_components/AdminHeader";
import { StatusBadge } from "../_components/ui";
import { fileUrl, outputLabel } from "./_lib/files";

export interface CvListItem {
  id: string;
  label: string;
  status: "pending" | "ready";
  createdAt: string;
  fullName: string;
  role: string;
  cvLanguage: string;
  format: string;
  coverLetter: boolean;
  outputs: OutputFile[];
}

export function Dashboard({ items, error }: { items: CvListItem[]; error?: "storage" | "load" }) {
  const { t, lang } = useAdminT();
  const d = t.dashboard;
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-CR" : "en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="max-w-5xl mx-auto px-6">
      <AdminHeader
        title={d.title}
        subtitle={d.subtitle}
        action={
          <Link
            href="/admin/cv/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-text-primary text-bg-primary font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            + {d.newCv}
          </Link>
        }
      />

      {error && (
        <p role="alert" className="mb-6 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
          {error === "storage" ? d.storageMissing : d.loadError}
        </p>
      )}

      {items.length === 0 && !error ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-text-muted">{d.empty}</div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-border bg-bg-card p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <Link href={`/admin/cv/${item.id}`} className="font-semibold text-text-primary hover:underline underline-offset-4 truncate">
                      {item.label}
                    </Link>
                    <StatusBadge status={item.status} label={item.status === "ready" ? d.ready : d.pending} />
                  </div>
                  <p className="text-sm text-text-secondary">
                    {[item.fullName, item.role].filter(Boolean).join(" · ") || "—"}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {d.created} {fmt.format(new Date(item.createdAt))} · {item.cvLanguage.toUpperCase()} · {item.format.toUpperCase()}
                    {item.coverLetter && ` · ${t.detail.cover_letter}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end shrink-0">
                  <Link href={`/admin/cv/${item.id}`} className="px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors">
                    {d.view}
                  </Link>
                  <Link href={`/admin/cv/new?from=${item.id}`} className="px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors">
                    {d.duplicate}
                  </Link>
                </div>
              </div>

              {item.status === "ready" && item.outputs.length > 0 ? (
                <div className="mt-4 pt-4 border-t border-border-subtle flex flex-wrap gap-2">
                  {item.outputs.map((o) => (
                    <a
                      key={o.pathname}
                      href={fileUrl(item.id, o.pathname)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-surface text-xs font-medium text-text-primary hover:opacity-80"
                    >
                      ↓ {outputLabel(o, t)}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-border-subtle text-xs text-text-muted">
                  {d.howToGenerate} <code className="font-mono text-text-secondary">/cv-builder {item.id}</code>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
