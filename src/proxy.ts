import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

/*
 * Gate for the hidden admin area. Pages and routes re-check the session
 * themselves (src/lib/admin/auth.ts); this layer redirects early and marks
 * every admin response as non-indexable.
 */

const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login"]);

function noIndex(res: NextResponse): NextResponse {
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) return noIndex(NextResponse.next());

  const ok = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (ok) return noIndex(NextResponse.next());

  if (pathname.startsWith("/api/")) {
    return noIndex(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const login = new URL("/admin/login", req.url);
  login.searchParams.set("next", pathname + search);
  return noIndex(NextResponse.redirect(login));
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
