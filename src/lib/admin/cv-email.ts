import "server-only";
import type { CvRequestRecord, StoredFile, UploadKind } from "./cv-schema";

/*
 * Notification sent when a CV request is submitted. Uses Resend, like the
 * contact form. The body carries a readable summary plus the full JSON so the
 * cv-builder skill can work from the email alone if Blob is unreachable.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function summaryLines(r: CvRequestRecord): [string, string][] {
  const d = r.data;
  const lines: [string, string][] = [
    ["ID", r.id],
    ["Etiqueta", r.label],
    ["Idioma del CV", d.setup.cvLanguage],
    ["Mercado", d.setup.market],
    ["Formato", d.setup.format],
    ["Extensión", d.setup.length],
    ["Carta de presentación", d.review.coverLetter ? "Sí" : "No"],
    ["CV existente adjunto", r.uploads.existingCv ? "Sí" : "No"],
    ["Nombre", d.contact.fullName || "—"],
    ["Cargo objetivo", d.target.role || "—"],
    ["Trabajos", d.experience.none ? "Sin experiencia formal" : String(d.experience.jobs.length)],
  ];
  if (r.duplicatedFrom) lines.push(["Duplicado de", r.duplicatedFrom]);
  if (d.review.internalNotes) lines.push(["Notas internas", d.review.internalNotes]);
  return lines;
}

export async function sendCvRequestEmail(
  record: CvRequestRecord,
  attachments: { kind: UploadKind; stored: StoredFile; bytes: Buffer }[],
  adminUrl: string,
): Promise<boolean> {
  const subject = `[CV] Nueva solicitud: ${record.label} (${record.id})`;
  const command = `/cv-builder ${record.id}`;
  const json = JSON.stringify(record, null, 2);
  const lines = summaryLines(record);

  const text = [
    `Nueva solicitud de CV.`,
    ``,
    ...lines.map(([k, v]) => `${k}: ${v}`),
    ``,
    `Para generarlo, en Claude Code dentro del repo del portafolio: ${command}`,
    `Ver en el dashboard: ${adminUrl}`,
    ``,
    `--- DATOS COMPLETOS (JSON) ---`,
    json,
  ].join("\n");

  if (!process.env.RESEND_API_KEY) {
    console.log("[CV Request] RESEND_API_KEY not set — email not sent.\n" + text);
    return false;
  }

  const html = `
    <h2 style="margin:0 0 12px">Nueva solicitud de CV</h2>
    <table cellpadding="4" style="border-collapse:collapse;font-size:14px">
      ${lines.map(([k, v]) => `<tr><td style="color:#666;padding-right:12px">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join("")}
    </table>
    <p style="margin-top:16px">Para generarlo, en Claude Code dentro del repo del portafolio:</p>
    <pre style="background:#f4f4f4;padding:8px 12px;border-radius:6px">${esc(command)}</pre>
    <p><a href="${esc(adminUrl)}">Ver en el dashboard</a></p>
    <details><summary>Datos completos (JSON)</summary>
      <pre style="font-size:12px;white-space:pre-wrap">${esc(json)}</pre>
    </details>`;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Portfolio CV <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL ?? "wilopez95@gmail.com",
      subject,
      text,
      html,
      attachments: attachments.map((a) => ({ filename: a.stored.filename, content: a.bytes })),
    });
    if (error) {
      console.error("[CV Request email]", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[CV Request email]", err);
    return false;
  }
}
