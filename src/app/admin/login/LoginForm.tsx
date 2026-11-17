"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminT } from "../_lib/i18n";
import { PrimaryButton } from "../_components/ui";

export function LoginForm({ next }: { next: string }) {
  const { t } = useAdminT();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace(next);
        router.refresh();
        return;
      }
      const { error: code } = await res.json().catch(() => ({ error: "" }));
      setError(
        code === "invalid" ? t.login.invalid
        : code === "locked" ? t.login.locked
        : code === "not_configured" ? t.login.notConfigured
        : t.login.error,
      );
    } catch {
      setError(t.login.error);
    }
    setPassword("");
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto px-6 pt-16">
      <h1 className="text-2xl font-bold text-text-primary tracking-tight mb-2">{t.login.title}</h1>
      <p className="text-sm text-text-secondary mb-8">{t.login.subtitle}</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <label htmlFor="admin-password" className="sr-only">{t.login.password}</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.login.password}
          className="w-full px-4 py-3 rounded-lg text-sm bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted"
        />
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <PrimaryButton type="submit" disabled={loading || !password} className="w-full">
          {loading ? t.login.checking : t.login.submit}
        </PrimaryButton>
      </form>
    </div>
  );
}
