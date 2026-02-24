import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Redirect www to non-www (single hop)
  if (hostname.startsWith("www.")) {
    url.host = hostname.replace("www.", "");
    url.protocol = "https";
    return NextResponse.redirect(url, 301);
  }

  // Redirect HTTP to HTTPS
  const proto = request.headers.get("x-forwarded-proto");
  if (proto === "http") {
    url.protocol = "https";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes that don't need redirects
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
