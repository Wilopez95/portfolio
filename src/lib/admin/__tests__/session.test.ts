/** @jest-environment node */
import { createSessionToken, SESSION_TTL_MS, verifyPassword, verifySessionToken } from "../session";

describe("admin session", () => {
  const original = process.env.ADMIN_PASSWORD;
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "s3cret%*pw";
  });
  afterAll(() => {
    process.env.ADMIN_PASSWORD = original;
  });

  it("verifies the password", async () => {
    expect(await verifyPassword("s3cret%*pw")).toBe(true);
    expect(await verifyPassword("s3cret%*pW")).toBe(false);
    expect(await verifyPassword("")).toBe(false);
  });

  it("accepts a fresh token and rejects an expired one", async () => {
    const now = Date.now();
    const token = await createSessionToken(now);
    expect(await verifySessionToken(token, now + 1000)).toBe(true);
    expect(await verifySessionToken(token, now + SESSION_TTL_MS + 1)).toBe(false);
  });

  it("rejects tampered tokens", async () => {
    const token = await createSessionToken();
    const [exp, sig] = token.split(".");
    expect(await verifySessionToken(`${Number(exp) + 999999}.${sig}`)).toBe(false);
    expect(await verifySessionToken(`${exp}.${sig.slice(0, -2)}00`)).toBe(false);
    expect(await verifySessionToken("garbage")).toBe(false);
    expect(await verifySessionToken(undefined)).toBe(false);
  });

  it("invalidates sessions when the password changes", async () => {
    const token = await createSessionToken();
    process.env.ADMIN_PASSWORD = "another";
    expect(await verifySessionToken(token)).toBe(false);
  });

  it("rejects everything when no password is configured", async () => {
    const token = await createSessionToken();
    delete process.env.ADMIN_PASSWORD;
    expect(await verifyPassword("")).toBe(false);
    expect(await verifySessionToken(token)).toBe(false);
  });
});
