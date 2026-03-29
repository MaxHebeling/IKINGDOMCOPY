import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/staff";
import { getAdminClient } from "@/lib/leads/helpers";
import type { Lead } from "@/lib/leads/helpers";

// GET /api/app/leads?status=new_lead&source=fit-intake&page=1&limit=50
export async function GET(req: NextRequest) {
  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp     = req.nextUrl.searchParams;
  const status = sp.get("status") ?? "";
  const source = sp.get("source") ?? "";
  const page   = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const limit  = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "50", 10)));
  const from   = (page - 1) * limit;
  const to     = from + limit - 1;

  const supabase = getAdminClient();

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("brand", "ikingdom")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);

  const { data, count, error } = await query;

  if (error) {
    console.error("[iKingdom/leads] GET error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({
    leads: (data ?? []) as Lead[],
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
