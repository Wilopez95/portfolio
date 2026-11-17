import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/*
 * The proxy already blocks unauthenticated requests, but every page and route
 * checks again here so a proxy misconfiguration can never expose CV data.
 */

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** For server components: redirects to the login page when not signed in. */
export async function requireAdminPage(nextPath: string): Promise<void> {
  if (!(await isAdmin())) redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
}

/** For route handlers: returns a 401 response when not signed in, otherwise null. */
export async function adminGuard(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
