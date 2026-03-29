import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/staff";
import { getAdminClient, updateLead } from "@/lib/leads/helpers";
import type { Lead } from "@/lib/leads/helpers";

const VALID_STATUSES = ["new_lead", "contacted", "qualified", "disqualified", "closed"] as const;

// GET /api/app/leads/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try { await requireStaff(); }
  catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { id } = await params;
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("brand", "ikingdom")
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ lead: data as Lead });
}

// PATCH /api/app/leads/[id]  { status? }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try { await requireStaff(); }
  catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { id } = await params;

  let body: { status?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  if (body.status && !VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const lead = await updateLead(id, { status: body.status });
    return NextResponse.json({ lead });
  } catch (err) {
    console.error("[iKingdom/leads/id] PATCH error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
