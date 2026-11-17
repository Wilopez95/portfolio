import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { getRecord } from "@/lib/admin/cv-store";
import { emptyCvForm, type CvFormDraft, type UploadKind } from "@/lib/admin/cv-schema";
import { CvForm, type DuplicateSource } from "./CvForm";

export default async function NewCvPage({ searchParams }: PageProps<"/admin/cv/new">) {
  const { from } = await searchParams;
  const fromId = typeof from === "string" ? from : undefined;
  await requireAdminPage(fromId ? `/admin/cv/new?from=${encodeURIComponent(fromId)}` : "/admin/cv/new");

  if (!fromId) return <CvForm initial={emptyCvForm()} />;

  const source = await getRecord(fromId);
  if (!source) notFound();

  // Start from a copy of the original answers; consent must be given again.
  const initial: CvFormDraft = {
    ...emptyCvForm(),
    ...structuredClone(source.data),
    setup: { ...source.data.setup, label: `${source.data.setup.label} (copia)`.slice(0, 120) },
    review: { ...source.data.review, consent: false },
  };
  const reusable: DuplicateSource["reusable"] = {};
  for (const [kind, file] of Object.entries(source.uploads)) {
    if (file) reusable[kind as UploadKind] = file.filename;
  }

  return <CvForm initial={initial} duplicate={{ id: source.id, label: source.label, reusable }} />;
}
