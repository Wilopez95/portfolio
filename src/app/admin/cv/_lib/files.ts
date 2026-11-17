import type { OutputFile } from "@/lib/admin/cv-schema";
import type { AdminDict } from "../../_lib/i18n";

export const fileUrl = (id: string, pathname: string, inline = false) =>
  `/api/admin/cv/${id}/file?p=${encodeURIComponent(pathname)}${inline ? "&inline=1" : ""}`;

export const outputLabel = (o: OutputFile, t: AdminDict) =>
  `${t.detail[o.kind]} ${o.lang.toUpperCase()} · ${o.format.toUpperCase()} · ${o.ext.toUpperCase()}`;
