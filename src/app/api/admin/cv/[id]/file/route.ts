import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin/auth";
import { getRecord, openFile, recordFiles } from "@/lib/admin/cv-store";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/admin/cv/[id]/file">) {
  const denied = await adminGuard();
  if (denied) return denied;

  const { id } = await ctx.params;
  const pathname = req.nextUrl.searchParams.get("p") ?? "";
  const inline = req.nextUrl.searchParams.get("inline") === "1";

  const record = await getRecord(id);
  const file = record && recordFiles(record).find((f) => f.pathname === pathname);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const blob = await openFile(file.pathname);
  if (!blob) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const disposition = inline ? "inline" : "attachment";
  return new NextResponse(blob.stream, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `${disposition}; filename="${file.filename.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
