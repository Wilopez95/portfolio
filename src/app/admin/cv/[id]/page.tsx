import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { getRecord } from "@/lib/admin/cv-store";
import { Detail } from "./Detail";

export default async function CvDetailPage({ params }: PageProps<"/admin/cv/[id]">) {
  const { id } = await params;
  await requireAdminPage(`/admin/cv/${id}`);
  const record = await getRecord(id);
  if (!record) notFound();
  return <Detail record={record} />;
}
