// Shared helpers for the cv-builder scripts. Run every script from the repo root.
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export const ROOT = "cv-requests/";
export const WORK_DIR = resolve(".cv-work");
export const ID_RE = /^\d{8}-\d{4}-[a-z0-9]{6}$/;

export function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    if (existsSync(f)) {
      try {
        process.loadEnvFile(f);
      } catch {
        /* malformed file: fall back to process env */
      }
    }
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    fail("BLOB_READ_WRITE_TOKEN is not set. Run from the repo root with .env.local present (vercel env pull).");
  }
}

export function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

export function requireId(id) {
  if (!id || !ID_RE.test(id)) fail(`Invalid request id "${id ?? ""}". Expected e.g. 20261117-2050-e77961.`);
  return id;
}

export async function readJsonBlob(get, pathname) {
  const res = await get(pathname, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) return null;
  return JSON.parse(await new Response(res.stream).text());
}
