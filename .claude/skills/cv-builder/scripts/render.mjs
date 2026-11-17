#!/usr/bin/env node
// Renders a CV or cover letter JSON (see references/document-json.md) to PDF + DOCX.
//
// Usage: node .claude/skills/cv-builder/scripts/render.mjs <doc.json> [<doc2.json> ...]
// Each <name>.json produces <name>.pdf and <name>.docx next to it, then prints
// the PDF page count so the caller can check the length target.
//
// PDF: headless Google Chrome (text-based, selectable, ATS-parseable).
// DOCX: the `docx` package, real headings + bullet lists, no tables/text boxes.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  Tab,
  TabStopType,
  TextRun,
} from "docx";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const FONT = "Arial";
const DEFAULT_ACCENT = "#1F3A5F";

/* ── helpers ─────────────────────────────────────────────── */

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** **bold** inline markup → <strong>. Only markup supported, on purpose. */
const inlineHtml = (s = "") => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

function inlineRuns(s = "", base = {}) {
  const runs = [];
  const parts = String(s).split(/(\*\*.+?\*\*)/g).filter(Boolean);
  for (const p of parts) {
    const bold = p.startsWith("**") && p.endsWith("**");
    runs.push(new TextRun({ ...base, text: bold ? p.slice(2, -2) : p, bold: bold || base.bold }));
  }
  return runs;
}

const hex = (c) => c.replace("#", "").toUpperCase();

function validate(doc, file) {
  const problems = [];
  if (!["cv", "cover_letter"].includes(doc.kind)) problems.push(`kind must be "cv" or "cover_letter"`);
  if (!["es", "en"].includes(doc.lang)) problems.push(`lang must be "es" or "en"`);
  if (!["ats", "visual"].includes(doc.format)) problems.push(`format must be "ats" or "visual"`);
  if (!doc.name) problems.push("name is required");
  if (doc.kind === "cv" && !Array.isArray(doc.sections)) problems.push("sections[] is required for a CV");
  if (doc.kind === "cover_letter" && !Array.isArray(doc.paragraphs)) problems.push("paragraphs[] is required for a cover letter");
  if (doc.format === "ats" && doc.photo) problems.push("ATS format must not include a photo");
  if (problems.length) {
    console.error(`ERROR in ${file}:\n - ${problems.join("\n - ")}`);
    process.exit(1);
  }
}

function photoData(doc, baseDir) {
  if (!doc.photo || doc.format !== "visual") return null;
  const p = resolve(baseDir, doc.photo);
  if (!existsSync(p)) {
    console.warn(`WARN: photo not found at ${p}; rendering without it.`);
    return null;
  }
  const ext = extname(p).toLowerCase();
  const type = ext === ".png" ? "png" : ext === ".jpg" || ext === ".jpeg" ? "jpg" : null;
  if (!type) {
    console.warn(`WARN: photo must be JPG or PNG (got ${ext}); rendering without it.`);
    return null;
  }
  return { path: p, type, bytes: readFileSync(p) };
}

/* ── HTML (→ PDF) ────────────────────────────────────────── */

function htmlDoc(doc, photo) {
  const visual = doc.format === "visual";
  const accent = visual ? doc.accent || DEFAULT_ACCENT : "#111111";
  const size = doc.paper === "a4" ? "A4" : "Letter";
  const dense = doc.density === "compact";
  const base = dense ? 10 : 10.5;

  const css = `
    @page { size: ${size}; margin: ${dense ? "0.5in 0.6in" : "0.6in 0.7in"}; }
    * { box-sizing: border-box; }
    body { font-family: ${FONT}, Helvetica, sans-serif; font-size: ${base}pt; line-height: 1.35; color: #1a1a1a; margin: 0; }
    h1 { font-size: ${visual ? 24 : 20}pt; margin: 0; color: ${visual ? accent : "#111"}; letter-spacing: 0.2px; }
    .headline { font-size: ${base + 1.5}pt; margin-top: 2px; color: #333; font-weight: bold; }
    .contact { margin-top: 4px; color: #333; }
    .personal { margin-top: 2px; color: #555; font-size: ${base - 0.5}pt; }
    header { display: flex; gap: 18px; align-items: center; ${visual ? `border-bottom: 3px solid ${accent}; padding-bottom: 10px;` : "border-bottom: 1px solid #999; padding-bottom: 6px;"} margin-bottom: 8px; }
    header img { width: 92px; height: 92px; object-fit: cover; border-radius: 50%; flex: none; }
    h2 { font-size: ${base + 1}pt; text-transform: uppercase; letter-spacing: 0.8px; margin: ${dense ? 9 : 12}px 0 4px; padding-bottom: 2px;
         color: ${visual ? accent : "#111"}; border-bottom: ${visual ? `1.5px solid ${accent}` : "1px solid #bbb"}; break-after: avoid; }
    p { margin: 0 0 4px; }
    .entry { margin: 0 0 ${dense ? 5 : 7}px; break-inside: avoid; }
    .row { display: flex; justify-content: space-between; gap: 12px; }
    .title { font-weight: bold; }
    .dates { white-space: nowrap; color: #333; }
    .org { color: #333; }
    ul { margin: 2px 0 0; padding-left: 16px; }
    li { margin: 0 0 2px; }
    .group { margin: 0 0 3px; }
    .group b { font-weight: bold; }
    a { color: inherit; text-decoration: none; }
    .letter p { margin: 0 0 10px; text-align: left; }
    .letter .meta { margin: 14px 0; }
  `;

  const header = `
    <header>
      ${photo ? `<img src="${pathToFileURL(photo.path)}" alt="">` : ""}
      <div>
        <h1>${esc(doc.name)}</h1>
        ${doc.headline ? `<div class="headline">${esc(doc.headline)}</div>` : ""}
        ${doc.contact?.length ? `<div class="contact">${doc.contact.map(esc).join(" &nbsp;|&nbsp; ")}</div>` : ""}
        ${doc.personal?.length ? `<div class="personal">${doc.personal.map(([k, v]) => `${esc(k)}: ${esc(v)}`).join(" &nbsp;|&nbsp; ")}</div>` : ""}
      </div>
    </header>`;

  let body = "";
  if (doc.kind === "cv") {
    for (const s of doc.sections) {
      body += `<section><h2>${esc(s.title)}</h2>`;
      if (s.type === "text") body += (Array.isArray(s.text) ? s.text : [s.text]).map((t) => `<p>${inlineHtml(t)}</p>`).join("");
      if (s.type === "list") body += `<ul>${s.items.map((i) => `<li>${inlineHtml(i)}</li>`).join("")}</ul>`;
      if (s.type === "groups")
        body += s.groups.map((g) => `<p class="group"><b>${esc(g.label)}:</b> ${g.items.map(esc).join(", ")}</p>`).join("");
      if (s.type === "entries")
        body += s.items
          .map(
            (e) => `
          <div class="entry">
            <div class="row"><span class="title">${esc(e.title)}</span><span class="dates">${esc(e.dates ?? "")}</span></div>
            ${e.org || e.location ? `<div class="org">${esc([e.org, e.location].filter(Boolean).join(" · "))}</div>` : ""}
            ${e.text ? `<p>${inlineHtml(e.text)}</p>` : ""}
            ${e.bullets?.length ? `<ul>${e.bullets.map((b) => `<li>${inlineHtml(b)}</li>`).join("")}</ul>` : ""}
          </div>`,
          )
          .join("");
      body += `</section>`;
    }
  } else {
    body = `<div class="letter">
      <div class="meta">${esc(doc.date ?? "")}</div>
      ${doc.recipient?.length ? `<div class="meta">${doc.recipient.map(esc).join("<br>")}</div>` : ""}
      <p>${esc(doc.greeting ?? "")}</p>
      ${doc.paragraphs.map((p) => `<p>${inlineHtml(p)}</p>`).join("")}
      <p>${esc(doc.closing ?? "")}</p>
      <p><strong>${esc(doc.signature ?? doc.name)}</strong></p>
    </div>`;
  }

  return `<!doctype html><html lang="${doc.lang}"><head><meta charset="utf-8"><title>${esc(doc.name)}</title><style>${css}</style></head><body>${header}${body}</body></html>`;
}

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    console.error("ERROR: Google Chrome not found. Set CHROME_PATH to a Chrome/Chromium binary.");
    process.exit(1);
  }
  return found;
}

function renderPdf(html, outPdf) {
  const tmp = mkdtempSync(join(tmpdir(), "cv-render-"));
  try {
    const htmlPath = join(tmp, "doc.html");
    writeFileSync(htmlPath, html);
    execFileSync(
      findChrome(),
      [
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--allow-file-access-from-files",
        `--user-data-dir=${join(tmp, "profile")}`,
        `--print-to-pdf=${outPdf}`,
        pathToFileURL(htmlPath).href,
      ],
      { stdio: "ignore", timeout: 60_000 },
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  const pdf = readFileSync(outPdf).toString("latin1");
  return (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length;
}

/* ── DOCX ────────────────────────────────────────────────── */

function buildDocx(doc, photo) {
  const visual = doc.format === "visual";
  const accent = hex(visual ? doc.accent || DEFAULT_ACCENT : "#111111");
  const dense = doc.density === "compact";
  const size = (dense ? 10 : 10.5) * 2; // half-points
  const children = [];

  if (photo) {
    children.push(
      new Paragraph({
        children: [new ImageRun({ type: photo.type, data: photo.bytes, transformation: { width: 96, height: 96 } })],
        spacing: { after: 80 },
      }),
    );
  }

  // Name + contact live in the document body (not the page header) so ATS parsers read them.
  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: doc.name, bold: true, size: (visual ? 24 : 20) * 2, color: accent, font: FONT })],
      spacing: { after: 40 },
    }),
  );
  if (doc.headline)
    children.push(new Paragraph({ children: [new TextRun({ text: doc.headline, bold: true, size: size + 3, font: FONT })] }));
  if (doc.contact?.length)
    children.push(new Paragraph({ children: [new TextRun({ text: doc.contact.join("  |  "), size, font: FONT })] }));
  if (doc.personal?.length)
    children.push(
      new Paragraph({
        children: [new TextRun({ text: doc.personal.map(([k, v]) => `${k}: ${v}`).join("  |  "), size: size - 1, color: "555555", font: FONT })],
      }),
    );
  children.push(
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: visual ? 18 : 6, color: visual ? accent : "999999", space: 4 } },
      spacing: { after: 120 },
    }),
  );

  const run = (text, extra = {}) => inlineRuns(text, { size, font: FONT, ...extra });
  const bullet = (text) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: run(text), spacing: { after: 30 } });
  const pageWidth = doc.paper === "a4" ? 11906 : 12240;
  const margin = dense ? 720 : 1008; // twips: 0.5in / 0.7in
  const RIGHT_TAB = pageWidth - margin * 2;

  if (doc.kind === "cv") {
    for (const s of doc.sections) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          keepNext: true,
          spacing: { before: dense ? 160 : 220, after: 60 },
          border: { bottom: { style: BorderStyle.SINGLE, size: visual ? 8 : 4, color: visual ? accent : "BBBBBB", space: 2 } },
          children: [new TextRun({ text: s.title.toUpperCase(), bold: true, size: size + 2, color: accent, font: FONT })],
        }),
      );
      if (s.type === "text")
        for (const t of Array.isArray(s.text) ? s.text : [s.text]) children.push(new Paragraph({ children: run(t), spacing: { after: 60 } }));
      if (s.type === "list") for (const i of s.items) children.push(bullet(i));
      if (s.type === "groups")
        for (const g of s.groups)
          children.push(
            new Paragraph({ children: [new TextRun({ text: `${g.label}: `, bold: true, size, font: FONT }), ...run(g.items.join(", "))], spacing: { after: 40 } }),
          );
      if (s.type === "entries")
        for (const e of s.items) {
          children.push(
            new Paragraph({
              keepNext: true,
              tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
              children: [
                new TextRun({ text: e.title, bold: true, size, font: FONT }),
                ...(e.dates ? [new TextRun({ children: [new Tab(), e.dates], size, font: FONT })] : []),
              ],
              spacing: { before: 80 },
            }),
          );
          if (e.org || e.location)
            children.push(new Paragraph({ keepNext: true, children: run([e.org, e.location].filter(Boolean).join(" · "), { color: "333333" }) }));
          if (e.text) children.push(new Paragraph({ children: run(e.text), spacing: { after: 40 } }));
          for (const b of e.bullets ?? []) children.push(bullet(b));
        }
    }
  } else {
    const para = (text, extra = {}) => new Paragraph({ children: run(text, extra), spacing: { after: 200 } });
    if (doc.date) children.push(para(doc.date));
    if (doc.recipient?.length)
      children.push(new Paragraph({ children: doc.recipient.flatMap((r, i) => [...(i ? [new TextRun({ break: 1 })] : []), ...run(r)]), spacing: { after: 200 } }));
    if (doc.greeting) children.push(para(doc.greeting));
    for (const p of doc.paragraphs) children.push(para(p));
    if (doc.closing) children.push(para(doc.closing));
    children.push(para(doc.signature ?? doc.name, { bold: true }));
  }

  const isA4 = doc.paper === "a4";
  return new Document({
    creator: doc.name,
    title: doc.kind === "cv" ? `CV ${doc.name}` : `${doc.lang === "es" ? "Carta de presentación" : "Cover letter"} ${doc.name}`,
    styles: { default: { document: { run: { font: FONT, size } } } },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 300, hanging: 220 } } } }],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: isA4 ? { width: 11906, height: 16838 } : { width: 12240, height: 15840 },
            margin: { top: margin, bottom: margin, left: margin, right: margin },
          },
        },
        children,
      },
    ],
  });
}

/* ── main ────────────────────────────────────────────────── */

const inputs = process.argv.slice(2);
if (!inputs.length) {
  console.error("Usage: render.mjs <doc.json> [<doc2.json> ...]");
  process.exit(1);
}

for (const input of inputs) {
  const file = resolve(input);
  const doc = JSON.parse(readFileSync(file, "utf8"));
  validate(doc, file);
  const photo = photoData(doc, dirname(file));
  const stem = join(dirname(file), basename(file, ".json"));

  const pages = renderPdf(htmlDoc(doc, photo), `${stem}.pdf`);
  writeFileSync(`${stem}.docx`, await Packer.toBuffer(buildDocx(doc, photo)));
  console.log(`OK ${basename(stem)}: pdf=${pages} page(s) → ${stem}.pdf, ${stem}.docx`);
}
