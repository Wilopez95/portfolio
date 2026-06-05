"use client";

import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const { t } = useLang();
  const f = t.form;
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send");

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setError(f.errorMsg);
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3 py-8">
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="text-text-primary font-semibold">{f.successTitle}</p>
        <p className="text-text-secondary text-sm">{f.successSubtitle}</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-text-muted hover:text-text-primary underline underline-offset-4 transition-colors mt-2"
        >
          {f.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label={f.name} name="name" type="text" value={form.name} onChange={handleChange} placeholder="Wilson López" required />
        <Field label={f.email} name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-text-secondary">
          {f.message}
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder={f.messagePlaceholder}
          required
          rows={6}
          className="w-full px-4 py-3 rounded-lg text-sm bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted resize-none transition-colors"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 px-7 py-4 rounded-lg bg-text-primary text-bg-primary font-semibold text-sm hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === "loading" ? (
          <><Spinner /> {f.sending}</>
        ) : (
          f.send
        )}
      </button>
    </form>
  );
}

function Field({ label, name, type, value, onChange, placeholder, required }: {
  label: string; name: string; type: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-text-secondary">{label}</label>
      <input
        id={name} name={name} type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full px-4 py-3 rounded-lg text-sm bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
      />
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
