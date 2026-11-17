#!/usr/bin/env node
// Usage:
//   node .claude/skills/cv-builder/scripts/pull.mjs            → list requests (pending first)
//   node .claude/skills/cv-builder/scripts/pull.mjs <id>       → download request + uploads to .cv-work/<id>/
import { get, list } from "@vercel/blob";
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { ROOT, WORK_DIR, loadEnv, readJsonBlob, requireId, fail } from "./_shared.mjs";

loadEnv();
const id = process.argv[2];

if (!id) {
  const paths = [];
  let cursor;
  do {
    const page = await list({ prefix: ROOT, cursor, limit: 1000 });
    for (const b of page.blobs) if (b.pathname.endsWith("/request.json")) paths.push(b.pathname);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const records = (await Promise.all(paths.map((p) => readJsonBlob(get, p)))).filter(Boolean);
  records.sort((a, b) => (a.status === b.status ? b.createdAt.localeCompare(a.createdAt) : a.status === "pending" ? -1 : 1));
  if (!records.length) console.log("No CV requests found.");
  for (const r of records) {
    console.log(`${r.status.padEnd(8)} ${r.id}  ${r.createdAt.slice(0, 16).replace("T", " ")}  ${r.label}`);
  }
  process.exit(0);
}

requireId(id);
const record = await readJsonBlob(get, `${ROOT}${id}/request.json`);
if (!record) fail(`Request ${id} not found in Blob.`);

const dir = join(WORK_DIR, id);
mkdirSync(join(dir, "uploads"), { recursive: true });
mkdirSync(join(dir, "out"), { recursive: true });
writeFileSync(join(dir, "request.json"), JSON.stringify(record, null, 2));

const downloaded = [];
for (const [kind, file] of Object.entries(record.uploads ?? {})) {
  if (!file) continue;
  const res = await get(file.pathname, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) {
    console.warn(`WARN: could not download ${file.pathname}`);
    continue;
  }
  const target = join(dir, "uploads", file.filename);
  writeFileSync(target, Buffer.from(await new Response(res.stream).arrayBuffer()));
  downloaded.push({ kind, path: target, contentType: file.contentType });

  // DOCX can't be read directly: extract plain text next to it.
  if (file.contentType.includes("wordprocessingml")) {
    try {
      const xml = execFileSync("unzip", ["-p", target, "word/document.xml"], { maxBuffer: 20e6 }).toString("utf8");
      const text = xml
        .replace(/<w:tab\/>/g, "\t")
        .replace(/<\/w:p>/g, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      writeFileSync(`${target}.txt`, text);
      downloaded.push({ kind: `${kind} (text)`, path: `${target}.txt`, contentType: "text/plain" });
    } catch {
      console.warn(`WARN: could not extract text from ${target}`);
    }
  }
}

console.log(`Request: ${join(dir, "request.json")}`);
console.log(`Status:  ${record.status}${record.outputs?.length ? ` (${record.outputs.length} outputs already published)` : ""}`);
console.log(`Output dir for generated files: ${join(dir, "out")}`);
for (const d of downloaded) console.log(`Upload [${d.kind}] ${d.contentType}: ${d.path}`);
