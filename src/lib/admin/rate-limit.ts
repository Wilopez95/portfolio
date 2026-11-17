/*
 * Best-effort login throttle. State lives in memory, so on Vercel each function
 * instance keeps its own counter; combined with the fixed delay on failures it
 * still makes online brute force impractical against a strong password.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

const failures = new Map<string, { count: number; firstAt: number }>();

export function isLocked(key: string, now = Date.now()): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (now - entry.firstAt > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordFailure(key: string, now = Date.now()): void {
  const entry = failures.get(key);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    failures.set(key, { count: 1, firstAt: now });
  } else {
    entry.count += 1;
  }
}

export function clearFailures(key: string): void {
  failures.delete(key);
}

export const FAILURE_DELAY_MS = 800;
