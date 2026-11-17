"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminT } from "../_lib/i18n";

export function AdminHeader({ title, subtitle, back, action }: {
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
  action?: React.ReactNode;
}) {
  const { t } = useAdminT();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6 text-sm">
        {back ? (
          <Link href={back.href} className="text-text-muted hover:text-text-primary transition-colors">
            ← {back.label}
          </Link>
        ) : (
          <span className="text-xs font-semibold text-text-muted tracking-widest uppercase">{t.dashboard.eyebrow}</span>
        )}
        <button onClick={logout} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
          {t.common.logout}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">{title}</h1>
          {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
