import "server-only";
import { copy, get, list, put } from "@vercel/blob";
import type { CvFormData, CvRequestRecord, StoredFile, UploadKind } from "./cv-schema";

/*
 * Layout in the private Blob store (portfolio-blob):
 *   cv-requests/<id>/request.json      the record (form data, status, outputs)
 *   cv-requests/<id>/uploads/<file>    files attached in the form
 *   cv-requests/<id>/output/<file>     PDF/DOCX produced by the cv-builder skill
 * The skill (.claude/skills/cv-builder) reads and updates the same layout.
 */

export const ROOT = "cv-requests/";
const ACCESS = "private" as const;

export const recordPath = (id: string) => `${ROOT}${id}/request.json`;

const ID_RE = /^\d{8}-\d{4}-[a-z0-9]{6}$/;
export const isValidId = (id: string) => ID_RE.test(id);

export function newId(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  const stamp = `${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}-${p(now.getUTCHours())}${p(now.getUTCMinutes())}`;
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 6);
  return `${stamp}-${rand}`;
}

export function safeFilename(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
  return cleaned.slice(-100) || "file";
}

async function readJson<T>(pathname: string): Promise<T | null> {
  const res = await get(pathname, { access: ACCESS, useCache: false });
  if (!res || res.statusCode !== 200) return null;
  return (await new Response(res.stream).json()) as T;
}

async function writeRecord(record: CvRequestRecord): Promise<void> {
  await put(recordPath(record.id), JSON.stringify(record, null, 2), {
    access: ACCESS,
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function getRecord(id: string): Promise<CvRequestRecord | null> {
  if (!isValidId(id)) return null;
  return readJson<CvRequestRecord>(recordPath(id));
}

export async function listRecords(): Promise<CvRequestRecord[]> {
  const paths: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: ROOT, cursor, limit: 1000 });
    for (const b of page.blobs) if (b.pathname.endsWith("/request.json")) paths.push(b.pathname);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const records = await Promise.all(paths.map((p) => readJson<CvRequestRecord>(p)));
  return records
    .filter((r): r is CvRequestRecord => r !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface IncomingUpload {
  kind: UploadKind;
  file: File;
}

export async function createRecord(input: {
  data: CvFormData;
  uploads: IncomingUpload[];
  duplicatedFrom?: CvRequestRecord;
  reuseUploads?: UploadKind[];
}): Promise<{ record: CvRequestRecord; files: { kind: UploadKind; stored: StoredFile; bytes: Buffer }[] }> {
  const id = newId();
  const now = new Date().toISOString();
  const uploads: CvRequestRecord["uploads"] = {};
  const files: { kind: UploadKind; stored: StoredFile; bytes: Buffer }[] = [];

  for (const { kind, file } of input.uploads) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${kind}-${safeFilename(file.name)}`;
    const pathname = `${ROOT}${id}/uploads/${filename}`;
    await put(pathname, bytes, { access: ACCESS, contentType: file.type, addRandomSuffix: false });
    const stored: StoredFile = { pathname, filename, contentType: file.type, size: bytes.length };
    uploads[kind] = stored;
    files.push({ kind, stored, bytes });
  }

  // Duplicates can carry over the original's attachments (unless replaced above).
  const source = input.duplicatedFrom;
  for (const kind of input.reuseUploads ?? []) {
    const original = source?.uploads[kind];
    if (!original || uploads[kind]) continue;
    const pathname = `${ROOT}${id}/uploads/${original.filename}`;
    await copy(original.pathname, pathname, {
      access: ACCESS,
      contentType: original.contentType,
      addRandomSuffix: false,
    });
    uploads[kind] = { ...original, pathname };
  }

  const record: CvRequestRecord = {
    id,
    version: 1,
    createdAt: now,
    updatedAt: now,
    status: "pending",
    label: input.data.setup.label,
    ...(source ? { duplicatedFrom: source.id } : {}),
    emailSent: false,
    data: { ...input.data, hasExistingCv: Boolean(uploads.existingCv) },
    uploads,
    outputs: [],
  };
  await writeRecord(record);
  return { record, files };
}

export async function markEmailSent(record: CvRequestRecord): Promise<void> {
  await writeRecord({ ...record, emailSent: true, updatedAt: new Date().toISOString() });
}

/** Every file a record references; downloads are only allowed for these. */
export function recordFiles(record: CvRequestRecord): StoredFile[] {
  return [...Object.values(record.uploads).filter((f): f is StoredFile => Boolean(f)), ...record.outputs];
}

export async function openFile(pathname: string) {
  const res = await get(pathname, { access: ACCESS });
  return res && res.statusCode === 200 ? res : null;
}
