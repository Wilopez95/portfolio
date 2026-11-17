/*
 * Stateless admin session: the cookie holds `<expiresAtMs>.<hmac>`.
 * The HMAC key is derived from ADMIN_PASSWORD, so changing the password
 * invalidates every existing session. Uses Web Crypto only, so it runs in
 * both the proxy and route handlers.
 */

export const SESSION_COOKIE = "cv_admin";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const encoder = new TextEncoder();

function getPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length > 0 ? pw : null;
}

async function hmacKey(password: string): Promise<CryptoKey> {
  const material = await crypto.subtle.digest("SHA-256", encoder.encode(`cv-admin-session:${password}`));
  return crypto.subtle.importKey("raw", material, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[0-9a-f]+$/.test(hex) || hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/** Constant-time password check (compares HMACs of both values). */
export async function verifyPassword(candidate: string): Promise<boolean> {
  const pw = getPassword();
  if (!pw || typeof candidate !== "string") return false;
  const key = await hmacKey(pw);
  const expected = await crypto.subtle.sign("HMAC", key, encoder.encode(`pw:${pw}`));
  return crypto.subtle.verify("HMAC", key, expected, encoder.encode(`pw:${candidate}`));
}

export async function createSessionToken(now = Date.now()): Promise<string> {
  const pw = getPassword();
  if (!pw) throw new Error("ADMIN_PASSWORD is not set");
  const exp = String(now + SESSION_TTL_MS);
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(pw), encoder.encode(exp));
  return `${exp}.${toHex(sig)}`;
}

export async function verifySessionToken(token: string | undefined | null, now = Date.now()): Promise<boolean> {
  const pw = getPassword();
  if (!pw || !token) return false;
  const [exp, sigHex, ...rest] = token.split(".");
  if (rest.length > 0 || !exp || !sigHex || !/^\d+$/.test(exp)) return false;
  if (Number(exp) <= now) return false;
  const sig = fromHex(sigHex);
  if (!sig) return false;
  return crypto.subtle.verify("HMAC", await hmacKey(pw), sig, encoder.encode(exp));
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}
