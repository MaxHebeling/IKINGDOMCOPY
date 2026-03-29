import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE    = "app_token";
const LOGIN_URL = "/app/login";

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /app/* routes (except /app/login itself)
  if (!pathname.startsWith("/app") || pathname.startsWith(LOGIN_URL)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;
  const key   = secret();

  if (!token || !key) {
    return NextResponse.redirect(new URL(LOGIN_URL, req.url));
  }

  try {
    await jwtVerify(token, key);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(LOGIN_URL, req.url));
  }
}

export const config = {
  matcher: ["/app/:path*"],
};
