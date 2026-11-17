"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cvFormSchema, UPLOAD_LIMITS, type CvFormDraft, type UploadKind } from "@/lib/admin/cv-schema";
import { useAdminT } from "../../_lib/i18n";
import { AdminHeader } from "../../_components/AdminHeader";
import { PrimaryButton, SecondaryButton } from "../../_components/ui";
import { STEPS, stepForPath } from "./steps";

export interface DuplicateSource {
  id: string;
  label: string;
  /** Upload kind → original filename. */
  reusable: Partial<Record<UploadKind, string>>;
}

type Result = { id: string; emailSent: boolean };

const draftKey = (from?: string) => `cv-form-draft:${from ?? "new"}`;

function readDraft(key: string): CvFormDraft | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as CvFormDraft) : null;
  } catch {
    return null;
  }
}

function writeDraft(key: string, data: CvFormDraft | null) {
  try {
    if (data) localStorage.setItem(key, JSON.stringify(data));
    else localStorage.removeItem(key);
  } catch {
    /* storage unavailable (private mode): drafts are a convenience only */
  }
}

/** Downscales photos/screenshots so uploads stay under the 4 MB request limit. */
async function shrinkImage(file: File, maxSide = 1800, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 600 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function CvForm({ initial, duplicate }: { initial: CvFormDraft; duplicate?: DuplicateSource }) {
  const { t } = useAdminT();
  const key = draftKey(duplicate?.id);
  const [data, setData] = useState<CvFormDraft>(initial);
  const [hasDraft, setHasDraft] = useState(false);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<Partial<Record<UploadKind, File | null>>>({});
  const [reuse, setReuse] = useState(true);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const loaded = useRef(false);
  const dirty = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  const reusable = useMemo(() => duplicate?.reusable ?? {}, [duplicate]);
  const hasExistingCv = Boolean(files.existingCv) || (reuse && Boolean(reusable.existingCv));
  const view: CvFormDraft = { ...data, hasExistingCv };

  // Restore a draft once, then autosave.
  useEffect(() => {
    const draft = readDraft(key);
    if (draft) {
      setData({ ...initial, ...draft });
      setHasDraft(true);
    }
    loaded.current = true;
  }, [key, initial]);

  useEffect(() => {
    if (!loaded.current || !dirty.current || result) return;
    const id = setTimeout(() => {
      writeDraft(key, data);
      setHasDraft(true);
    }, 500);
    return () => clearTimeout(id);
  }, [data, key, result]);

  const set = (fn: (d: CvFormDraft) => void) => {
    dirty.current = true;
    setData((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  };

  const setFile = (kind: UploadKind, f: File | null) => setFiles((prev) => ({ ...prev, [kind]: f }));

  function issues(): string[] {
    const parsed = cvFormSchema.safeParse(view);
    return parsed.success ? [] : parsed.error.issues.map((i) => i.path.join("."));
  }

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  function goNext() {
    const own = issues().filter((p) => stepForPath(p) === step);
    setErrors(new Set(own));
    if (own.length) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    scrollTop();
  }

  function goTo(target: number) {
    if (target < step) {
      setErrors(new Set());
      setStep(target);
      scrollTop();
    }
  }

  function discardDraft() {
    writeDraft(key, null);
    dirty.current = false;
    setHasDraft(false);
    setData(initial);
    setFiles({});
    setStep(0);
    setErrors(new Set());
  }

  async function submit() {
    setSubmitError("");
    const all = issues();
    if (all.length) {
      setErrors(new Set(all));
      setStep(Math.min(...all.map(stepForPath)));
      setSubmitError(t.form.fixErrors);
      scrollTop();
      return;
    }

    setSubmitting(true);
    try {
      const body = new FormData();
      let total = 0;
      for (const kind of Object.keys(files) as UploadKind[]) {
        const f = files[kind];
        if (!f) continue;
        const ready = await shrinkImage(f);
        total += ready.size;
        body.append(kind, ready, ready.name);
      }
      if (total > UPLOAD_LIMITS.totalBytes) {
        setSubmitError(t.form.errors.files_too_large);
        setSubmitting(false);
        return;
      }
      body.append("data", JSON.stringify(view));
      if (duplicate) {
        body.append("duplicateOf", duplicate.id);
        if (reuse) for (const kind of Object.keys(reusable)) body.append("reuse", kind);
      }

      const res = await fetch("/api/admin/cv", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = json.error as keyof typeof t.form.errors | undefined;
        setSubmitError((code && t.form.errors[code]) || t.form.errors.generic);
        if (code === "validation" && Array.isArray(json.issues)) {
          const paths = json.issues.map((i: { path: string }) => i.path);
          setErrors(new Set(paths));
          if (paths.length) setStep(Math.min(...paths.map(stepForPath)));
        }
        setSubmitting(false);
        return;
      }
      writeDraft(key, null);
      setResult({ id: json.id, emailSent: json.emailSent });
    } catch {
      setSubmitError(t.form.errors.generic);
    }
    setSubmitting(false);
  }

  const title = duplicate ? `${t.form.duplicateTitle}` : t.form.title;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-6">
        <AdminHeader title={t.form.successTitle} back={{ href: "/admin/cv", label: t.detail.back }} />
        <div className="rounded-xl border border-border bg-bg-card p-6 space-y-4">
          <p className="text-text-secondary">{result.emailSent ? t.form.successEmail : t.form.successNoEmail}</p>
          <p className="text-sm text-text-secondary">{t.form.successNext}</p>
          <pre className="rounded-lg bg-bg-surface px-4 py-3 text-sm font-mono text-text-primary overflow-x-auto">
            /cv-builder {result.id}
          </pre>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/admin/cv" className="inline-flex items-center px-6 py-3 rounded-lg bg-text-primary text-bg-primary font-semibold text-sm hover:opacity-80">
              {t.form.toDashboard}
            </Link>
            <Link href={`/admin/cv/${result.id}`} className="inline-flex items-center px-5 py-3 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary">
              {t.dashboard.view}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const Step = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="max-w-3xl mx-auto px-6" ref={topRef}>
      <AdminHeader
        title={title}
        subtitle={duplicate ? duplicate.label : undefined}
        back={{ href: "/admin/cv", label: t.detail.back }}
      />

      {/* Progress */}
      <nav aria-label={t.form.step} className="mb-8">
        <p className="text-xs text-text-muted mb-2">
          {t.form.step} {step + 1} {t.form.of} {STEPS.length} · <span className="text-text-primary font-medium">{t.form.steps[step]}</span>
        </p>
        <ol className="flex gap-1">
          {t.form.steps.map((name, i) => (
            <li key={name} className="flex-1">
              <button
                type="button"
                title={name}
                aria-label={name}
                aria-current={i === step ? "step" : undefined}
                disabled={i >= step}
                onClick={() => goTo(i)}
                className={`block h-1.5 w-full rounded-full transition-colors ${
                  i <= step ? "bg-text-primary" : "bg-border"
                } ${i < step ? "cursor-pointer hover:opacity-70" : "cursor-default"}`}
              />
            </li>
          ))}
        </ol>
        {hasDraft && (
          <p className="text-xs text-text-muted mt-3">
            {t.form.draftSaved} ·{" "}
            <button type="button" onClick={discardDraft} className="underline underline-offset-2 hover:text-text-primary cursor-pointer">
              {t.form.discardDraft}
            </button>
          </p>
        )}
      </nav>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isLast) submit();
          else goNext();
        }}
        noValidate
      >
        <Step
          data={view}
          set={set}
          t={t}
          err={(p) => errors.has(p)}
          files={files}
          setFile={setFile}
          reusable={reusable}
          reuse={reuse}
          setReuse={setReuse}
        />

        {(errors.size > 0 || submitError) && (
          <p role="alert" className="mt-6 text-sm text-red-500">{submitError || t.form.fixErrors}</p>
        )}

        <div className="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-border">
          <SecondaryButton type="button" disabled={step === 0} onClick={() => goTo(step - 1)}>
            ← {t.common.back}
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={submitting}>
            {isLast ? (submitting ? t.form.submitting : t.form.submit) : `${t.common.next} →`}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
