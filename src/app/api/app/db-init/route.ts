import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { sql } from "@/lib/db";

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

// POST /api/app/db-init  →  create tables
export async function POST(req: NextRequest) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source               VARCHAR(50)  NOT NULL,
        company_id           VARCHAR(50)  NOT NULL DEFAULT 'ikingdom',

        name                 VARCHAR(200),
        email                VARCHAR(200) NOT NULL,
        company              VARCHAR(200),
        phone                VARCHAR(50),
        website              VARCHAR(500),
        instagram            VARCHAR(200),

        business_description TEXT,
        current_offer        TEXT,
        avg_ticket           VARCHAR(100),
        target_client        TEXT,
        location             VARCHAR(200),

        main_challenge       TEXT,
        tried_before         TEXT,
        not_working          TEXT,
        running_ads          BOOLEAN,
        has_website          BOOLEAN,

        goals_90_days        TEXT,
        service_interest     VARCHAR(200),
        budget               VARCHAR(200),
        timeline             VARCHAR(200),

        brand_feeling        TEXT,
        visual_references    TEXT,
        tone_preferences     TEXT,
        inspiration_links    TEXT,

        needs                TEXT,
        revenue              VARCHAR(200),
        notes                TEXT,
        consent              BOOLEAN NOT NULL DEFAULT FALSE,

        utm_source           VARCHAR(200),
        utm_medium           VARCHAR(200),
        utm_campaign         VARCHAR(200),
        utm_term             VARCHAR(200),
        utm_content          VARCHAR(200),
        gclid                VARCHAR(500),
        fbclid               VARCHAR(500),

        score                INTEGER      NOT NULL DEFAULT 0,
        qualified            BOOLEAN      NOT NULL DEFAULT FALSE,
        status               VARCHAR(50)  NOT NULL DEFAULT 'new',

        ip_hash              VARCHAR(64),
        raw_payload          JSONB,

        created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS leads_company_id_idx ON leads(company_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS leads_qualified_idx ON leads(qualified)
    `;

    console.log("[iKingdom/db-init] Tables initialized");
    return NextResponse.json({ success: true, message: "Tabla leads creada / ya existía" });
  } catch (err) {
    console.error("[iKingdom/db-init] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
