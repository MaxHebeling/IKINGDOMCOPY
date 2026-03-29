// Auth is handled by Supabase Auth via the browser client (supabase.auth.signInWithPassword).
// This route only handles server-side sign-out to clear all Supabase session cookies.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE /api/app/auth → sign out (clears Supabase session cookies)
export async function DELETE() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}

// GET/POST are handled client-side via @supabase/ssr browser client
export async function GET() {
  return NextResponse.json({ message: "Use Supabase client for auth" }, { status: 410 });
}
export async function POST() {
  return NextResponse.json({ message: "Use Supabase client for auth" }, { status: 410 });
}
