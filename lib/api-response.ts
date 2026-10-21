import { NextResponse } from "next/server";

// A force-dynamic route handler still answers with Next's default
// `public, max-age=0, must-revalidate`, which permits a shared proxy to keep
// a copy of the body. Routes that answer with buyer data (email, Stripe
// session ids) send this instead so nothing in the middle stores it.
export const NO_STORE_CACHE_CONTROL = "private, no-store, max-age=0";

// Headers go through the Headers constructor so a caller passing a Headers
// instance or an entry array keeps its values instead of losing them to an
// object spread. An explicit Cache-Control from the caller still wins.
export const jsonNoStore = (body: unknown, init?: ResponseInit): NextResponse => {
  const headers = new Headers(init?.headers);
  if (!headers.has("Cache-Control")) headers.set("Cache-Control", NO_STORE_CACHE_CONTROL);
  return NextResponse.json(body, { ...init, headers });
};
