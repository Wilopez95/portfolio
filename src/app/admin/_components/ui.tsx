"use client";

import { useId, useState } from "react";

const inputCls =
  "w-full px-4 py-2.5 rounded-lg text-sm bg-bg-surface border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors";

export function Field({
  label,
  hint,
  required,
  error,
  children,
  id,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden>*</span>}
      </label>
      {children}
      {hint && <p className={`text-xs leading-relaxed ${error ? "text-red-500" : "text-text-muted"}`}>{hint}</p>}
    </div>
  );
}

type Base = { label: string; hint?: string; required?: boolean; error?: boolean };

export function TextInput({
  label,
  hint,
  required,
  error,
  value,
  onChange,
  type = "text",
  placeholder,
  ...rest
}: Base & {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} required={required} error={error} id={id}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error || undefined}
        className={`${inputCls} ${error ? "border-red-500" : "border-border"}`}
        {...rest}
      />
    </Field>
  );
}

export function TextArea({
  label,
  hint,
  required,
  error,
  value,
  onChange,
  rows = 4,
}: Base & { value: string; onChange: (v: string) => void; rows?: number }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} required={required} error={error} id={id}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error || undefined}
        className={`${inputCls} resize-y ${error ? "border-red-500" : "border-border"}`}
      />
    </Field>
  );
}

export function Select<V extends string>({
  label,
  hint,
  required,
  error,
  value,
  onChange,
  options,
  placeholder,
}: Base & {
  value: V;
  onChange: (v: V) => void;
  options: { value: V; label: string }[];
  placeholder?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} required={required} error={error} id={id}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as V)}
        aria-invalid={error || undefined}
        className={`${inputCls} cursor-pointer ${error ? "border-red-500" : "border-border"}`}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Single choice shown as pill buttons. */
export function Choice<V extends string>({
  label,
  hint,
  required,
  value,
  onChange,
  options,
}: Base & { value: V; onChange: (v: V) => void; options: { value: V; label: string; hint?: string }[] }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-text-secondary mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden>*</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`text-left px-4 py-2 rounded-lg border text-sm transition-colors cursor-pointer ${
                active
                  ? "border-text-primary bg-text-primary text-bg-primary"
                  : "border-border bg-bg-surface text-text-secondary hover:border-text-muted"
              }`}
            >
              <span className="font-medium">{o.label}</span>
              {o.hint && (
                <span className={`block text-xs mt-0.5 ${active ? "opacity-80" : "text-text-muted"}`}>{o.hint}</span>
              )}
            </button>
          );
        })}
      </div>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </fieldset>
  );
}

/** Multiple choice shown as toggle chips. */
export function MultiChoice<V extends string>({
  label,
  hint,
  value,
  onChange,
  options,
  max,
}: Base & { value: V[]; onChange: (v: V[]) => void; options: { value: V; label: string }[]; max?: number }) {
  const toggle = (v: V) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else if (!max || value.length < max) onChange([...value, v]);
  };
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-text-secondary mb-2">
        {label}
        {max && <span className="text-text-muted font-normal"> ({value.length}/{max})</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value.includes(o.value);
          const disabled = !active && max !== undefined && value.length >= max;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              disabled={disabled}
              onClick={() => toggle(o.value)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                active
                  ? "border-text-primary bg-text-primary text-bg-primary"
                  : "border-border bg-bg-surface text-text-secondary hover:border-text-muted"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </fieldset>
  );
}

/** Month + year selects; works in every browser (Safari has no <input type="month">). */
export function MonthYear({
  label,
  required,
  error,
  value,
  onChange,
  locale,
  placeholders,
}: Base & {
  value: string;
  onChange: (v: string) => void;
  locale: string;
  placeholders: { month: string; year: string };
}) {
  const id = useId();
  const [y0, m0] = value ? value.split("-") : ["", ""];
  const [month, setMonth] = useState(m0 ?? "");
  const [year, setYear] = useState(y0 ?? "");
  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2000, i, 1)),
  );
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: thisYear - 1959 }, (_, i) => String(thisYear - i));
  const emit = (m: string, y: string) => onChange(m && y ? `${y}-${m}` : "");
  const cls = `${inputCls} cursor-pointer ${error ? "border-red-500" : "border-border"}`;
  return (
    <Field label={label} required={required} error={error} id={id}>
      <div className="grid grid-cols-[1fr_110px] gap-2">
        <select id={id} value={month} aria-invalid={error || undefined} className={cls}
          onChange={(e) => { setMonth(e.target.value); emit(e.target.value, year); }}>
          <option value="">{placeholders.month}</option>
          {months.map((name, i) => (
            <option key={i} value={String(i + 1).padStart(2, "0")}>{name}</option>
          ))}
        </select>
        <select value={year} aria-invalid={error || undefined} aria-label={placeholders.year} className={cls}
          onChange={(e) => { setYear(e.target.value); emit(month, e.target.value); }}>
          <option value="">{placeholders.year}</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </Field>
  );
}

export function Checkbox({
  label,
  hint,
  checked,
  onChange,
  error,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-invalid={error || undefined}
        className="mt-0.5 h-4 w-4 accent-current cursor-pointer"
      />
      <label htmlFor={id} className={`text-sm cursor-pointer ${error ? "text-red-500" : "text-text-secondary"}`}>
        {label}
        {hint && <span className="block text-xs text-text-muted mt-0.5">{hint}</span>}
      </label>
    </div>
  );
}

/** Free-text tags: type and press Enter (or comma). */
export function TagInput({
  label,
  hint,
  value,
  onChange,
}: Base & { value: string[]; onChange: (v: string[]) => void }) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const commit = () => {
    const parts = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));
    if (parts.length) onChange([...value, ...parts].slice(0, 40));
    setDraft("");
  };
  return (
    <Field label={label} hint={hint} id={id}>
      <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-border bg-bg-surface">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-card border border-border text-xs text-text-primary">
            {tag}
            <button
              type="button"
              aria-label={`× ${tag}`}
              onClick={() => onChange(value.filter((v) => v !== tag))}
              className="text-text-muted hover:text-text-primary cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={commit}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-text-primary focus:outline-none px-1 py-1"
        />
      </div>
    </Field>
  );
}

export function FileInput({
  label,
  hint,
  accept,
  file,
  onChange,
  removeLabel,
}: Base & { accept: string; file: File | null; onChange: (f: File | null) => void; removeLabel: string }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} id={id}>
      {file ? (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border border-border bg-bg-surface text-sm">
          <span className="truncate text-text-primary">
            {file.name} <span className="text-text-muted">· {formatBytes(file.size)}</span>
          </span>
          <button type="button" onClick={() => onChange(null)} className="text-text-muted hover:text-red-500 text-xs cursor-pointer">
            {removeLabel}
          </button>
        </div>
      ) : (
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-bg-surface file:text-text-primary file:font-medium file:cursor-pointer cursor-pointer border border-dashed border-border rounded-lg p-2"
        />
      )}
    </Field>
  );
}

export function Card({ title, onRemove, removeLabel, children }: {
  title: string;
  onRemove?: () => void;
  removeLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-text-muted tracking-widest uppercase">{title}</p>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-xs text-text-muted hover:text-red-500 cursor-pointer">
            {removeLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function AddButton({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-xl border border-dashed border-border text-sm text-text-secondary hover:border-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      + {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-text-primary text-bg-primary font-semibold text-sm hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border text-text-secondary font-medium text-sm hover:text-text-primary hover:border-text-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status, label }: { status: "pending" | "ready"; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        status === "ready" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${status === "ready" ? "bg-green-500" : "bg-amber-500"}`} />
      {label}
    </span>
  );
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
