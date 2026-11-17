import { requireAdminPage } from "@/lib/admin/auth";
import { listRecords } from "@/lib/admin/cv-store";
import type { CvRequestRecord } from "@/lib/admin/cv-schema";
import { Dashboard, type CvListItem } from "./Dashboard";

const toItem = (r: CvRequestRecord): CvListItem => ({
  id: r.id,
  label: r.label,
  status: r.status,
  createdAt: r.createdAt,
  fullName: r.data.contact.fullName,
  role: r.data.target.role,
  cvLanguage: r.data.setup.cvLanguage,
  format: r.data.setup.format,
  coverLetter: r.data.review.coverLetter,
  outputs: r.outputs,
});

export default async function CvDashboardPage() {
  await requireAdminPage("/admin/cv");

  if (!process.env.BLOB_READ_WRITE_TOKEN) return <Dashboard items={[]} error="storage" />;
  let items: CvListItem[] = [];
  let failed = false;
  try {
    items = (await listRecords()).map(toItem);
  } catch (err) {
    console.error("[CV dashboard]", err);
    failed = true;
  }
  return <Dashboard items={items} error={failed ? "load" : undefined} />;
}
