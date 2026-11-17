import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE, verifyPassword } from "@/lib/admin/session";
import { clearFailures, FAILURE_DELAY_MS, isLocked, recordFailure } from "@/lib/admin/rate-limit";

const clientKey = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const key = clientKey(req);
  if (isLocked(key)) {
    return NextResponse.json({ error: "locked" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!(await verifyPassword(password))) {
    recordFailure(key);
    await new Promise((r) => setTimeout(r, FAILURE_DELAY_MS));
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  clearFailures(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions());
  return res;
}
