import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { sql } from "@/lib/db";
import type { LeadRow } from "@/lib/db";

const COOKIE = "app_token";
const VALID_STATUSES = ["new", "contacted", "qualified", "disqualified", "closed"] as const;

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(s);
}

async function requireAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return false;
  try { await jwtVerify(token, secret()); return true; }
  catch { return false; }
}

// GET /api/app/leads/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { rows } = await sql<LeadRow>`
      SELECT * FROM leads WHERE id = ${id} LIMIT 1
    `;
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ lead: rows[0] });
  } catch (err) {
    console.error("[iKingdom/leads/id] GET error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/app/leads/[id]  { status?, notes?, score?, qualified? }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { status?: string; notes?: string; score?: number; qualified?: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  if (body.status && !VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  try {
    // Only update provided fields
    const updates: string[] = ["updated_at = NOW()"];
    if (body.status    !== undefined) updates.push(`status = '${body.status.replace(/'/g, "''")}'`);
    if (body.notes     !== undefined) updates.push(`notes = '${body.notes.slice(0, 5000).replace(/'/g, "''")}'`);
    if (body.score     !== undefined) updates.push(`score = ${Math.min(100, Math.max(0, Number(body.score)))}`);
    if (body.qualified !== undefined) updates.push(`qualified = ${body.qualified ? "TRUE" : "FALSE"}`);

    // Use parameterized approach for safety
    const { rows } = await sql<LeadRow>`
      UPDATE leads
      SET
        status    = COALESCE(${body.status ?? null}, status),
        notes     = COALESCE(${body.notes != null ? body.notes.slice(0, 5000) : null}, notes),
        score     = COALESCE(${body.score != null ? Math.min(100, Math.max(0, Number(body.score))) : null}, score),
        qualified = COALESCE(${body.qualified ?? null}, qualified),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.log("[iKingdom/leads/id] PATCH", { id, updates: Object.keys(body) });
    return NextResponse.json({ lead: rows[0] });
  } catch (err) {
    console.error("[iKingdom/leads/id] PATCH error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
