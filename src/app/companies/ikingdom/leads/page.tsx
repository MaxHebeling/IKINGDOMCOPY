"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/leads/helpers";
import { getLeadInsight } from "@/lib/ikingdom/lead-assistant";

// ── Columns ───────────────────────────────────────────────────────────────────

const COLUMNS = [
  { id: "new_lead",     label: "Nuevo",      accent: "#D4AF37" },
  { id: "contacted",    label: "Contactado", accent: "#64A0FF" },
  { id: "qualified",    label: "Calificado", accent: "#50C878" },
  { id: "disqualified", label: "Descartado", accent: "#FF5050" },
  { id: "closed",       label: "Cerrado",    accent: "rgba(255,255,255,0.25)" },
] as const;

type ColId = (typeof COLUMNS)[number]["id"];

const PRIORITY_COLOR = { hot: "#FF6B35", warm: "#D4AF37", cold: "rgba(255,255,255,0.2)" } as const;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LeadsKanban() {
  const router = useRouter();

  const [leads,       setLeads]       = useState<Lead[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [selected,    setSelected]    = useState<Lead | null>(null);
  const [patchLoading, setPatchLoading] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/app/leads?limit=200");
      if (res.status === 401) { router.push("/login"); return; }
      if (res.status === 403) { setError("Sin acceso — tu cuenta no tiene rol de staff en este sistema."); return; }
      if (!res.ok) throw new Error("Error al cargar leads");
      const data = await res.json();
      setLeads(data.leads ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function moveCard(id: string, status: string) {
    setPatchLoading(id);
    try {
      const res = await fetch(`/api/app/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
      if (selected?.id === id) setSelected(data.lead);
    } finally {
      setPatchLoading(null);
    }
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const grouped = COLUMNS.reduce<Record<ColId, Lead[]>>(
    (acc, col) => { acc[col.id] = leads.filter((l) => l.status === col.id); return acc; },
    {} as Record<ColId, Lead[]>
  );

  const hotCount  = leads.filter((l) => getLeadInsight(l).priority === "hot").length;
  const warmCount = leads.filter((l) => getLeadInsight(l).priority === "warm").length;

  return (
    <div style={{ minHeight: "100vh", height: "100vh", display: "flex", flexDirection: "column", background: "#080808", fontFamily: "'Space Grotesk', monospace", color: "#D4AF37", overflow: "hidden" }}>

      {/* ── Top bar ── */}
      <header style={{ flexShrink: 0, borderBottom: "1px solid rgba(212,175,55,0.08)", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#040404" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 9, letterSpacing: "0.45em", color: "rgba(212,175,55,0.3)", textTransform: "uppercase" }}>iKingdom</span>
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>Pipeline</span>
          </div>
          <div style={{ display: "flex", gap: 20, borderLeft: "1px solid rgba(212,175,55,0.08)", paddingLeft: 24 }}>
            <StatPill label="Total"  value={leads.length} color="rgba(212,175,55,0.5)" />
            <StatPill label="HOT"    value={hotCount}      color="#FF6B35" />
            <StatPill label="WARM"   value={warmCount}     color="#D4AF37" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={fetchLeads} style={btnGhost}>↻</button>
          <button onClick={logout}     style={btnGhost}>Salir</button>
        </div>
      </header>

      {/* ── States ── */}
      {loading && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 12, letterSpacing: "0.3em", color: "rgba(212,175,55,0.3)", textTransform: "uppercase" }}>Cargando pipeline…</span>
        </div>
      )}
      {error && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 13, color: "#ff6b6b" }}>{error}</span>
        </div>
      )}

      {/* ── Board ── */}
      {!loading && !error && (
        <div style={{ flex: 1, display: "flex", overflowX: "auto", overflowY: "hidden", padding: "20px 20px 0", gap: 12, alignItems: "flex-start" }}>
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              col={col}
              leads={grouped[col.id] ?? []}
              selected={selected}
              patchLoading={patchLoading}
              onSelect={setSelected}
            />
          ))}
        </div>
      )}

      {/* ── Detail panel ── */}
      {selected && (
        <DetailPanel
          lead={selected}
          patchLoading={patchLoading}
          onClose={() => setSelected(null)}
          onMove={moveCard}
        />
      )}
    </div>
  );
}

// ── Column ────────────────────────────────────────────────────────────────────

function Column({
  col, leads, selected, patchLoading, onSelect,
}: {
  col: (typeof COLUMNS)[number];
  leads: Lead[];
  selected: Lead | null;
  patchLoading: string | null;
  onSelect: (lead: Lead) => void;
}) {
  return (
    <div style={{ flexShrink: 0, width: 240, display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 96px)" }}>
      {/* Column header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingLeft: 4, paddingRight: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: col.accent, display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: col.accent, fontWeight: 500 }}>{col.label}</span>
        </div>
        <span style={{ fontSize: 11, color: "rgba(212,175,55,0.3)", fontWeight: 400 }}>{leads.length}</span>
      </div>

      {/* Cards list */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 20 }}>
        {leads.length === 0 && (
          <div style={{ border: "1px dashed rgba(212,175,55,0.06)", borderRadius: 6, padding: "24px 0", textAlign: "center" }}>
            <span style={{ fontSize: 10, color: "rgba(212,175,55,0.15)", letterSpacing: "0.2em", textTransform: "uppercase" }}>vacío</span>
          </div>
        )}
        {leads.map((lead) => (
          <Card
            key={lead.id}
            lead={lead}
            isSelected={selected?.id === lead.id}
            isLoading={patchLoading === lead.id}
            onClick={() => onSelect(lead)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function Card({ lead, isSelected, isLoading, onClick }: {
  lead: Lead;
  isSelected: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  const insight = getLeadInsight(lead);
  const pColor  = PRIORITY_COLOR[insight.priority];

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isSelected ? "rgba(212,175,55,0.25)" : "rgba(212,175,55,0.07)"}`,
        borderRadius: 8,
        padding: "12px 14px",
        cursor: "pointer",
        opacity: isLoading ? 0.5 : 1,
        transition: "background 0.15s, border-color 0.15s",
        position: "relative",
      }}
    >
      {/* Priority stripe */}
      <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 2, borderRadius: "0 2px 2px 0", background: pColor }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#D4AF37", lineHeight: 1.3, flex: 1, marginRight: 8 }}>
          {lead.full_name}
        </span>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: pColor, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
          {insight.priorityLabel}
        </span>
      </div>

      {lead.company_name && (
        <p style={{ margin: "0 0 6px", fontSize: 11, color: "rgba(212,175,55,0.45)", lineHeight: 1.3 }}>
          {lead.company_name}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <span style={{ fontSize: 10, color: "rgba(212,175,55,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {lead.source}
        </span>
        {lead.budget_range && (
          <span style={{ fontSize: 10, color: "rgba(212,175,55,0.4)" }}>
            {lead.budget_range}
          </span>
        )}
      </div>

      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(212,175,55,0.05)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, color: "rgba(212,175,55,0.2)", letterSpacing: "0.05em" }}>
          {lead.lead_code}
        </span>
        <span style={{ fontSize: 9, color: "rgba(212,175,55,0.2)" }}>
          {new Date(lead.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
        </span>
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function DetailPanel({ lead, patchLoading, onClose, onMove }: {
  lead: Lead;
  patchLoading: string | null;
  onClose: () => void;
  onMove: (id: string, status: string) => void;
}) {
  const insight = getLeadInsight(lead);
  const pColor  = PRIORITY_COLOR[insight.priority];
  const isLoading = patchLoading === lead.id;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />

      {/* Panel */}
      <aside style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 400,
        background: "#0c0c0c", borderLeft: "1px solid rgba(212,175,55,0.1)",
        zIndex: 50, display: "flex", flexDirection: "column", overflowY: "auto",
      }}>
        {/* Panel header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(212,175,55,0.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, marginRight: 12 }}>
              <p style={{ margin: "0 0 4px", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.3)" }}>
                {lead.lead_code} · {lead.source}
              </p>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#D4AF37", lineHeight: 1.2 }}>
                {lead.full_name}
              </h2>
              {lead.company_name && (
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(212,175,55,0.5)" }}>{lead.company_name}</p>
              )}
            </div>
            <button onClick={onClose} style={{ ...btnGhost, padding: "6px 10px", fontSize: 14, flexShrink: 0 }}>✕</button>
          </div>

          {/* Score */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: pColor, lineHeight: 1 }}>{insight.score}</span>
              <span style={{ fontSize: 10, color: pColor, letterSpacing: "0.15em", opacity: 0.8 }}>/ 100</span>
            </div>
            <span style={{ padding: "3px 10px", border: `1px solid ${pColor}`, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: pColor }}>
              {insight.priorityLabel}
            </span>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "rgba(212,175,55,0.5)", lineHeight: 1.5 }}>
            {insight.nextAction}
          </p>
        </div>

        {/* Move to column */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(212,175,55,0.06)", flexShrink: 0 }}>
          <p style={{ margin: "0 0 10px", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.3)" }}>Mover a</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {COLUMNS.map((col) => {
              const active = lead.status === col.id;
              return (
                <button
                  key={col.id}
                  disabled={isLoading || active}
                  onClick={() => onMove(lead.id, col.id)}
                  style={{
                    padding: "5px 12px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                    background: active ? `${col.accent}18` : "transparent",
                    color: active ? col.accent : "rgba(212,175,55,0.3)",
                    border: `1px solid ${active ? col.accent : "rgba(212,175,55,0.12)"}`,
                    cursor: active ? "default" : "pointer", fontFamily: "inherit",
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  {col.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail fields */}
        <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <Section label="Contacto">
            <Field label="Email"     value={lead.email} />
            <Field label="WhatsApp"  value={lead.whatsapp} />
            <Field label="Website"   value={lead.website_url} />
            <Field label="Ciudad"    value={lead.city} />
            <Field label="País"      value={lead.country} />
          </Section>

          <Section label="Proyecto">
            <Field label="Servicio"     value={lead.main_service} />
            <Field label="Budget"       value={lead.budget_range} />
            <Field label="Timeline"     value={lead.timeline} />
            <Field label="Tipo"         value={lead.project_type} />
            <Field label="Descripción"  value={lead.project_description} />
            <Field label="Objetivo"     value={lead.main_goal} />
            <Field label="Resultado esp." value={lead.expected_result} />
          </Section>

          <Section label="Marca">
            <Field label="Estilo visual"   value={lead.visual_style} />
            <Field label="Referencias"     value={lead.reference_websites} />
            <Field label="Cliente ideal"   value={lead.ideal_client} />
            <Field label="Notas"           value={lead.additional_notes} />
          </Section>

          <p style={{ margin: 0, fontSize: 9, color: "rgba(212,175,55,0.15)", letterSpacing: "0.1em" }}>
            {new Date(lead.created_at).toLocaleString("es-MX")}
          </p>
        </div>
      </aside>
    </>
  );
}

// ── Small components ──────────────────────────────────────────────────────────

function StatPill({ label, value, color = "#D4AF37" }: { label: string; value: number; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
      <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,55,0.3)" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color, lineHeight: 1 }}>{value}</span>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.25)" }}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: unknown }) {
  if (!value) return null;
  return (
    <div>
      <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(212,175,55,0.3)" }}>{label} </span>
      <span style={{ fontSize: 12, color: "rgba(212,175,55,0.75)", fontWeight: 300 }}>{String(value)}</span>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const btnGhost: React.CSSProperties = {
  padding: "6px 14px", background: "transparent", border: "1px solid rgba(212,175,55,0.15)",
  color: "rgba(212,175,55,0.5)", fontSize: 11, letterSpacing: "0.1em", cursor: "pointer",
  fontFamily: "inherit",
};
