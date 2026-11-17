import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen pt-24 pb-20">{children}</div>;
}
