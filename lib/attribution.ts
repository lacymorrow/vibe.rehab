// Roast attribution: `?src=roast-<slug>` is captured once, persisted for the
// session (and a 30-day cookie), and sent with the checkout request.
const STORAGE_KEY = "vr_src";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const SRC_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function sanitizeSrc(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase();
  return SRC_PATTERN.test(v) ? v : null;
}

function readCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${STORAGE_KEY}=([^;]*)`));
  return match ? sanitizeSrc(decodeURIComponent(match[1])) : null;
}

export function setSrc(value: unknown): string | null {
  if (typeof window === "undefined") return null;
  const src = sanitizeSrc(value);
  if (!src) return null;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, src);
  } catch {}
  document.cookie = `${STORAGE_KEY}=${encodeURIComponent(src)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax; Secure`;
  return src;
}

export function captureSrc(): string | null {
  if (typeof window === "undefined") return null;
  const fromUrl = setSrc(new URLSearchParams(window.location.search).get("src"));
  return fromUrl ?? getSrc();
}

export function getSrc(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sanitizeSrc(window.sessionStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
  } catch {}
  return readCookie();
}
