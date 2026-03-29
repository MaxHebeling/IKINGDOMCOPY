import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { sql } from "@/lib/db";
import type { LeadRow } from "@/lib/db";

const COOKIE = "app_token";

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

// GET /api/app/leads?status=new&source=fit-intake&page=1&limit=50
export async function GET(req: NextRequest) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp      = req.nextUrl.searchParams;
  const status  = sp.get("status")  ?? "";
  const source  = sp.get("source")  ?? "";
  const company = sp.get("company") ?? "ikingdom";
  const page    = Math.max(1, parseInt(sp.get("page")  ?? "1", 10));
  const limit   = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "50", 10)));
  const offset  = (page - 1) * limit;

  try {
    // Build dynamic query — safe because all user values go through parameterized sql``
    let rows: LeadRow[];
    let total: number;

    if (status && source) {
      const r = await sql<LeadRow>`
        SELECT * FROM leads
        WHERE company_id = ${company}
          AND status = ${status}
          AND source = ${source}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const c = await sql<{ count: string }>`
        SELECT COUNT(*)::text AS count FROM leads
        WHERE company_id = ${company}
          AND status = ${status}
          AND source = ${source}
      `;
      rows  = r.rows;
      total = parseInt(c.rows[0].count, 10);
    } else if (status) {
      const r = await sql<LeadRow>`
        SELECT * FROM leads
        WHERE company_id = ${company} AND status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const c = await sql<{ count: string }>`
        SELECT COUNT(*)::text AS count FROM leads
        WHERE company_id = ${company} AND status = ${status}
      `;
      rows  = r.rows;
      total = parseInt(c.rows[0].count, 10);
    } else if (source) {
      const r = await sql<LeadRow>`
        SELECT * FROM leads
        WHERE company_id = ${company} AND source = ${source}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const c = await sql<{ count: string }>`
        SELECT COUNT(*)::text AS count FROM leads
        WHERE company_id = ${company} AND source = ${source}
      `;
      rows  = r.rows;
      total = parseInt(c.rows[0].count, 10);
    } else {
      const r = await sql<LeadRow>`
        SELECT * FROM leads
        WHERE company_id = ${company}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const c = await sql<{ count: string }>`
        SELECT COUNT(*)::text AS count FROM leads
        WHERE company_id = ${company}
      `;
      rows  = r.rows;
      total = parseInt(c.rows[0].count, 10);
    }

    return NextResponse.json({
      leads: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[iKingdom/leads] GET error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
