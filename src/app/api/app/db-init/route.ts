// Retired — tables live in the canonical Supabase project (hebeling-imperium-hub).
// Schema is managed via Supabase migrations, not via ad-hoc init routes.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Retired. Tables are managed in the canonical Supabase project via migrations." },
    { status: 410 }
  );
}
