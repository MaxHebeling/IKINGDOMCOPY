import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "app_token";

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(s);
}

// POST /api/app/auth  →  login
export async function POST(req: NextRequest) {
  let body: { password?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  const APP_PASSWORD = process.env.APP_PASSWORD;
  if (!APP_PASSWORD) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  }

  if (body.password !== APP_PASSWORD) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:     "/",
    maxAge:   60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

// DELETE /api/app/auth  →  logout
export async function DELETE() {
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set(COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}

// GET /api/app/auth  →  verify (used by client to check session)
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });
  try {
    await jwtVerify(token, secret());
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
