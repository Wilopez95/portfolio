import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin/auth";
import { cvFormSchema, UPLOAD_LIMITS, type UploadKind } from "@/lib/admin/cv-schema";
import { createRecord, getRecord, markEmailSent, type IncomingUpload } from "@/lib/admin/cv-store";
import { sendCvRequestEmail } from "@/lib/admin/cv-email";

const UPLOAD_KINDS: UploadKind[] = ["existingCv", "jobPosting", "photo"];

export async function POST(req: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Files
  const uploads: IncomingUpload[] = [];
  let total = 0;
  for (const kind of UPLOAD_KINDS) {
    const value = form.get(kind);
    if (!(value instanceof File) || value.size === 0) continue;
    if (!(UPLOAD_LIMITS.types[kind] as string[]).includes(value.type)) {
      return NextResponse.json({ error: "invalid_file_type", field: kind }, { status: 400 });
    }
    total += value.size;
    uploads.push({ kind, file: value });
  }
  if (total > UPLOAD_LIMITS.totalBytes) {
    return NextResponse.json({ error: "files_too_large" }, { status: 413 });
  }

  // Duplicate source
  const duplicateOf = String(form.get("duplicateOf") ?? "");
  const source = duplicateOf ? await getRecord(duplicateOf) : null;
  if (duplicateOf && !source) {
    return NextResponse.json({ error: "duplicate_source_not_found" }, { status: 400 });
  }
  const reuseUploads = form
    .getAll("reuse")
    .map(String)
    .filter((k): k is UploadKind => (UPLOAD_KINDS as string[]).includes(k));

  // Data
  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("data") ?? ""));
  } catch {
    return NextResponse.json({ error: "invalid_data" }, { status: 400 });
  }
  const willHaveCv =
    uploads.some((u) => u.kind === "existingCv") ||
    (reuseUploads.includes("existingCv") && Boolean(source?.uploads.existingCv));
  if (raw && typeof raw === "object") (raw as { hasExistingCv?: boolean }).hasExistingCv = willHaveCv;

  const parsed = cvFormSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
      { status: 400 },
    );
  }

  try {
    const { record, files } = await createRecord({
      data: parsed.data,
      uploads,
      duplicatedFrom: source ?? undefined,
      reuseUploads,
    });

    const adminUrl = new URL(`/admin/cv/${record.id}`, req.nextUrl.origin).toString();
    const emailSent = await sendCvRequestEmail(record, files, adminUrl);
    if (emailSent) await markEmailSent(record);

    return NextResponse.json({ ok: true, id: record.id, emailSent });
  } catch (err) {
    console.error("[CV Request]", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
