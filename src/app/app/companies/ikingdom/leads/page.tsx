"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { LeadRow } from "@/lib/db";
import { getLeadInsight } from "@/lib/ikingdom/lead-assistant";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUSES = ["", "new", "contacted", "qualified", "disqualified", "closed"] as const;
const SOURCES  = ["", "contact", "fit-intake", "submit-lead", "external"] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new:          { bg: "rgba(212,175,55,0.12)", text: "#D4AF37" },
  contacted:    { bg: "rgba(100,160,255,0.12)", text: "#64A0FF" },
  qualified:    { bg: "rgba(80,200,120,0.15)",  text: "#50C878" },
  disqualified: { bg: "rgba(255,80,80,0.12)",   text: "#FF5050" },
  closed:       { bg: "rgba(255,255,255,0.06)",  text: "rgba(255,255,255,0.4)" },
};

const PRIORITY_COLORS: Record<string, string> = {
  hot:  "#FF6B35",
  warm: "#D4AF37",
  cold: "rgba(255,255,255,0.3)",
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface Pagination { page: number; limit: number; total: number; pages: number; }

// ── Component ─────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const router = useRouter();

  const [leads,      setLeads]      = useState<LeadRow[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [page,         setPage]         = useState(1);

  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [patchLoading, setPatchLoading] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (filterStatus) params.set("status", filterStatus);
      if (filterSource) params.set("source", filterSource);
      const res = await fetch(`/api/app/leads?${params}`);
      if (res.status === 401) { router.push("/app/login"); return; }
      if (!res.ok) throw new Error("Error al cargar leads");
      const data = await res.json();
      setLeads(data.leads ?? []);
      setPagination(data.pagination ?? null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterSource, router]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function updateStatus(id: string, status: string) {
    setPatchLoading(id);
    try {
      const res = await fetch(`/api/app/leads/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
    } finally {
      setPatchLoading(null);
    }
  }

  async function initDb() {
    const res = await fetch("/api/app/db-init", { method: "POST" });
    const data = await res.json();
    alert(data.message ?? data.error ?? "Listo");
    if (res.ok) fetchLeads();
  }

  async function logout() {
    await fetch("/api/app/auth", { method: "DELETE" });
    router.push("/app/login");
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "#020202", fontFamily: "'Space Grotesk', monospace", color: "#D4AF37" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.45em", color: "rgba(212,175,55,0.4)", textTransform: "uppercase" }}>
            iKingdom · Sales Intake
          </p>
          <h1 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Leads {pagination && <span style={{ fontSize: 13, color: "rgba(212,175,55,0.4)", fontWeight: 400 }}>({pagination.total})</span>}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={initDb} style={btnGhost}>Init DB</button>
          <button onClick={logout} style={btnGhost}>Salir</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: "16px 32px", borderBottom: "1px solid rgba(212,175,55,0.06)", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} style={selectStyle}>
          <option value="">Todos los estados</option>
          {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterSource} onChange={(e) => { setFilterSource(e.target.value); setPage(1); }} style={selectStyle}>
          <option value="">Todas las fuentes</option>
          {SOURCES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => fetchLeads()} style={btnGhost}>↻ Refrescar</button>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 32px" }}>
        {loading && <p style={{ color: "rgba(212,175,55,0.4)", fontSize: 13 }}>Cargando…</p>}
        {error   && <p style={{ color: "#ff6b6b", fontSize: 13 }}>{error}</p>}

        {!loading && !error && leads.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "rgba(212,175,55,0.3)", fontSize: 13 }}>No hay leads. Inicializa la DB primero con el botón "Init DB".</p>
          </div>
        )}

        {!loading && leads.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
                  {["Nombre", "Empresa", "Email", "Fuente", "Servicio", "Budget", "Score", "Estado", "Fecha", ""].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", fontWeight: 400, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const insight   = getLeadInsight(lead);
                  const isOpen    = expanded === lead.id;
                  const sc        = STATUS_COLORS[lead.status] ?? STATUS_COLORS.new;
                  const pColor    = PRIORITY_COLORS[insight.priority];

                  return (
                    <>
                      <tr
                        key={lead.id}
                        onClick={() => setExpanded(isOpen ? null : lead.id)}
                        style={{ borderBottom: "1px solid rgba(212,175,55,0.06)", cursor: "pointer", background: isOpen ? "rgba(212,175,55,0.03)" : "transparent" }}
                      >
                        <td style={td}>{lead.name ?? "—"}</td>
                        <td style={td}>{lead.company ?? "—"}</td>
                        <td style={{ ...td, color: "rgba(212,175,55,0.6)", fontSize: 11 }}>{lead.email}</td>
                        <td style={td}><span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.5)" }}>{lead.source}</span></td>
                        <td style={{ ...td, fontSize: 11 }}>{lead.service_interest ?? "—"}</td>
                        <td style={{ ...td, fontSize: 11 }}>{lead.budget ?? "—"}</td>
                        <td style={td}>
                          <span style={{ color: pColor, fontWeight: 600, fontSize: 13 }}>{lead.score}</span>
                          <span style={{ fontSize: 9, color: pColor, marginLeft: 4, opacity: 0.7 }}>{insight.priorityLabel}</span>
                        </td>
                        <td style={td}>
                          <span style={{ padding: "3px 8px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", background: sc.bg, color: sc.text }}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={{ ...td, fontSize: 11, color: "rgba(212,175,55,0.4)", whiteSpace: "nowrap" }}>
                          {new Date(lead.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                        </td>
                        <td style={td}>
                          <span style={{ fontSize: 16, color: "rgba(212,175,55,0.3)" }}>{isOpen ? "▲" : "▼"}</span>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr key={`${lead.id}-detail`}>
                          <td colSpan={10} style={{ padding: "20px 12px 24px", background: "rgba(212,175,55,0.02)", borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
                            <LeadDetail lead={lead} insight={insight} onUpdate={updateStatus} patchLoading={patchLoading} />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={btnGhost}>← Anterior</button>
            <span style={{ padding: "6px 12px", fontSize: 12, color: "rgba(212,175,55,0.5)" }}>
              {page} / {pagination.pages}
            </span>
            <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} style={btnGhost}>Siguiente →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Lead Detail Panel ─────────────────────────────────────────────────────────

function LeadDetail({
  lead, insight, onUpdate, patchLoading,
}: {
  lead: LeadRow;
  insight: ReturnType<typeof getLeadInsight>;
  onUpdate: (id: string, status: string) => void;
  patchLoading: string | null;
}) {
  const pColor = PRIORITY_COLORS[insight.priority];
  const STATUSES_OPTIONS = ["new", "contacted", "qualified", "disqualified", "closed"];

  function field(label: string, value: unknown) {
    if (!value) return null;
    return (
      <div key={label} style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)" }}>{label}</span>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: "#D4AF37", fontWeight: 300 }}>{String(value)}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, maxWidth: 900 }}>
      {/* Col 1: Contact & Business */}
      <div>
        <SectionLabel>Contacto</SectionLabel>
        {field("Email", lead.email)}
        {field("Teléfono", lead.phone)}
        {field("Website", lead.website)}
        {field("Instagram", lead.instagram)}
        {field("Ubicación", lead.location)}
        <SectionLabel>Negocio</SectionLabel>
        {field("Descripción", lead.business_description)}
        {field("Oferta actual", lead.current_offer)}
        {field("Ticket prom.", lead.avg_ticket)}
        {field("Cliente ideal", lead.target_client)}
      </div>

      {/* Col 2: Objectives & Brand */}
      <div>
        <SectionLabel>Objetivos</SectionLabel>
        {field("Meta 90 días", lead.goals_90_days)}
        {field("Reto principal", lead.main_challenge)}
        {field("Lo intentado", lead.tried_before)}
        {field("Qué no funciona", lead.not_working)}
        {field("Revenue", lead.revenue)}
        {field("Necesidad", lead.needs)}
        <SectionLabel>Marca</SectionLabel>
        {field("Sensación visual", lead.brand_feeling)}
        {field("Tono preferido", lead.tone_preferences)}
        {field("Referencias", lead.visual_references)}
      </div>

      {/* Col 3: Actions & Attribution */}
      <div>
        <SectionLabel>Prioridad</SectionLabel>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: pColor }}>{lead.score}</span>
          <span style={{ fontSize: 10, color: pColor, marginLeft: 6, letterSpacing: "0.2em" }}>/ 100 · {insight.priorityLabel}</span>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(212,175,55,0.6)" }}>{insight.summary}</p>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#D4AF37", borderLeft: "2px solid rgba(212,175,55,0.3)", paddingLeft: 8 }}>
            {insight.nextAction}
          </p>
        </div>

        <SectionLabel>Estado</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {STATUSES_OPTIONS.map((s) => {
            const sc = STATUS_COLORS[s] ?? STATUS_COLORS.new;
            const active = lead.status === s;
            return (
              <button
                key={s}
                disabled={patchLoading === lead.id}
                onClick={(e) => { e.stopPropagation(); onUpdate(lead.id, s); }}
                style={{
                  padding: "4px 10px",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: active ? sc.bg : "transparent",
                  color: active ? sc.text : "rgba(212,175,55,0.3)",
                  border: `1px solid ${active ? sc.text : "rgba(212,175,55,0.15)"}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  opacity: patchLoading === lead.id ? 0.5 : 1,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        <SectionLabel>Atribución</SectionLabel>
        {field("utm_source",   lead.utm_source)}
        {field("utm_medium",   lead.utm_medium)}
        {field("utm_campaign", lead.utm_campaign)}
        {field("gclid",        lead.gclid)}
        {field("fbclid",       lead.fbclid)}

        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: 9, color: "rgba(212,175,55,0.25)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {lead.source} · {new Date(lead.created_at).toLocaleString("es-MX")}
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "12px 0 6px", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(212,175,55,0.3)" }}>
      {children}
    </p>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const td: React.CSSProperties = {
  padding: "12px",
  color: "#D4AF37",
  verticalAlign: "middle",
};

const btnGhost: React.CSSProperties = {
  padding: "7px 14px",
  background: "transparent",
  border: "1px solid rgba(212,175,55,0.2)",
  color: "rgba(212,175,55,0.6)",
  fontSize: 11,
  letterSpacing: "0.1em",
  cursor: "pointer",
  fontFamily: "inherit",
};

const selectStyle: React.CSSProperties = {
  padding: "7px 12px",
  background: "rgba(212,175,55,0.04)",
  border: "1px solid rgba(212,175,55,0.15)",
  color: "#D4AF37",
  fontSize: 12,
  fontFamily: "inherit",
  cursor: "pointer",
};
