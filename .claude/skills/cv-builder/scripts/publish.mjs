#!/usr/bin/env node
// Uploads generated files to Blob and marks the request as ready.
//
// Usage:
//   node .claude/skills/cv-builder/scripts/publish.mjs <id> [--notes <notes.md>] [--clean]
//
// Picks up from .cv-work/<id>/out/ every file named
//   cv_<es|en>_<ats|visual>.<pdf|docx>
//   cover_letter_<es|en>_<ats|visual>.<pdf|docx>
// --notes: short markdown shown in the dashboard ("Notas del generador").
// --clean: delete .cv-work/<id>/ afterwards (it contains personal data).
import { get, put } from "@vercel/blob";
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { ROOT, WORK_DIR, fail, loadEnv, readJsonBlob, requireId } from "./_shared.mjs";

loadEnv();
const args = process.argv.slice(2);
const id = requireId(args[0]);
const notesIdx = args.indexOf("--notes");
const notesFile = notesIdx > -1 ? args[notesIdx + 1] : null;
const clean = args.includes("--clean");

const dir = join(WORK_DIR, id);
const outDir = join(dir, "out");
if (!existsSync(outDir)) fail(`${outDir} does not exist. Run pull.mjs ${id} first.`);

const recordPath = `${ROOT}${id}/request.json`;
const record = await readJsonBlob(get, recordPath);
if (!record) fail(`Request ${id} not found in Blob.`);

const NAME_RE = /^(cv|cover_letter)_(es|en)_(ats|visual)\.(pdf|docx)$/;
const files = readdirSync(outDir).filter((f) => NAME_RE.test(f)).sort();
if (!files.length) fail(`No publishable files in ${outDir} (expected e.g. cv_es_ats.pdf).`);

const slug =
  (record.data?.contact?.fullName || record.label || "CV")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "CV";

const CONTENT_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const outputs = [];
for (const f of files) {
  const [, kind, lang, format, ext] = f.match(NAME_RE);
  const label =
    kind === "cv" ? `CV-${lang.toUpperCase()}` : lang === "es" ? "Carta-Presentacion" : "Cover-Letter";
  const filename = `${slug}_${label}${format === "visual" ? "_Visual" : ""}.${ext}`;
  const pathname = `${ROOT}${id}/output/${filename}`;
  const bytes = readFileSync(join(outDir, f));
  await put(pathname, bytes, {
    access: "private",
    contentType: CONTENT_TYPES[ext],
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  outputs.push({ pathname, filename, contentType: CONTENT_TYPES[ext], size: statSync(join(outDir, f)).size, kind, lang, format, ext });
  console.log(`uploaded ${filename}`);
}

const now = new Date().toISOString();
const updated = {
  ...record,
  status: "ready",
  outputs,
  generatedAt: now,
  updatedAt: now,
  ...(notesFile ? { generatorNotes: readFileSync(notesFile, "utf8").trim().slice(0, 4000) } : {}),
};
await put(recordPath, JSON.stringify(updated, null, 2), {
  access: "private",
  contentType: "application/json",
  addRandomSuffix: false,
  allowOverwrite: true,
});
console.log(`Request ${id} marked as ready with ${outputs.length} file(s).`);

if (clean) {
  rmSync(dir, { recursive: true, force: true });
  console.log(`Removed ${dir}`);
}
