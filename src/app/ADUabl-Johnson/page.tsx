"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/* ─── Design tokens ─── */
const APPLE = {
  font: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
  bg: "#FFFFFF",
  surface: "#F5F5F7",
  ink: "#1D1D1F",
  secondary: "#6E6E73",
  divider: "#D2D2D7",
  blue: "#0071E3",
  blueHover: "#0077ED",
  gold: "#B08D57",
};

/* ─── Primitives ─── */

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-4%" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionHeader({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ marginBottom: "28px", paddingBottom: "20px", borderBottom: `1px solid ${APPLE.divider}` }}>
      <p style={{ fontSize: "11px", fontWeight: 600, color: APPLE.gold, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
        {n}
      </p>
      <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, color: APPLE.ink, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        {label}
      </h2>
    </div>
  );
}

const baseInput: React.CSSProperties = {
  width: "100%", background: APPLE.surface, border: "1.5px solid transparent",
  borderRadius: "10px", padding: "13px 16px", fontSize: "15px", color: APPLE.ink,
  fontFamily: APPLE.font, fontWeight: 400, outline: "none",
  transition: "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
  appearance: "none", WebkitAppearance: "none",
};

function Input({ type = "text", value, onChange, placeholder = "" }: { type?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [f, setF] = useState(false);
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ ...baseInput, borderColor: f ? APPLE.blue : "transparent", background: f ? "#fff" : APPLE.surface, boxShadow: f ? `0 0 0 3px ${APPLE.blue}22` : "none" }} />
  );
}

function SelectInput({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ ...baseInput, borderColor: f ? APPLE.blue : "transparent", background: f ? "#fff" : APPLE.surface, boxShadow: f ? `0 0 0 3px ${APPLE.blue}22` : "none", paddingRight: "40px" }}>
        {children}
      </select>
      <svg style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="7" viewBox="0 0 12 7" fill="none">
        <path d="M1 1L6 6L11 1" stroke={APPLE.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function TextArea({ rows = 3, value, onChange, placeholder = "" }: { rows?: number; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [f, setF] = useState(false);
  return (
    <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ ...baseInput, borderColor: f ? APPLE.blue : "transparent", background: f ? "#fff" : APPLE.surface, boxShadow: f ? `0 0 0 3px ${APPLE.blue}22` : "none", resize: "none", lineHeight: "1.6" }} />
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: APPLE.ink, marginBottom: "7px", letterSpacing: "-0.01em" }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: "12px", color: APPLE.secondary, marginTop: "5px", lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

/* ─── Page ─── */

export default function AduablBriefPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    // 01 — Online Presence
    websiteUrl: "",
    websitePlatform: "",
    socialProfiles: "",
    googleBusiness: "",
    // 02 — Current Systems & Tools
    los: "",
    crm: "",
    emailPlatform: "",
    emailMarketing: "",
    schedulingTool: "",
    eSignature: "",
    leadSources: "",
    // 03 — Volume & Operations
    monthlyLeads: "",
    closingRate: "",
    teamSize: "",
    marketingSpend: "",
    biggestBottleneck: "",
    timeWaste: "",
    // 04 — Investment
    buildBudget: "",
    monthlyBudget: "",
    extra: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const card: React.CSSProperties = {
    background: "#fff", borderRadius: "20px", padding: "clamp(24px, 4vw, 40px)",
    boxShadow: "0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)", marginBottom: "14px",
  };
  const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" };
  const gap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "20px" };

  if (submitted) {
    return (
      <div style={{ background: APPLE.surface, minHeight: "100vh", fontFamily: APPLE.font, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ background: "#fff", borderRadius: "24px", padding: "clamp(40px, 6vw, 64px)", maxWidth: "520px", width: "100%", textAlign: "center", boxShadow: "0 4px 40px rgba(0,0,0,0.08)" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#EBF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12L10 17L19 7" stroke={APPLE.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: APPLE.ink, letterSpacing: "-0.02em", marginBottom: "12px" }}>Brief received.</h2>
          <p style={{ fontSize: "15px", color: APPLE.secondary, lineHeight: 1.7, marginBottom: "32px" }}>
            Thank you, Will. Our team will review your brief and follow up at <strong style={{ color: APPLE.ink }}>will@aduabl.com</strong> within one business day.
          </p>
          <p style={{ fontSize: "13px", color: APPLE.secondary, opacity: 0.7 }}>Questions? Reach us at executive@ikingdom.org</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: APPLE.surface, minHeight: "100vh", fontFamily: APPLE.font, color: APPLE.ink }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${APPLE.divider}`, padding: "0 28px", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image src="/logo-horizontal.png" alt="iKingdom" width={160} height={40}
            style={{ height: "26px", width: "auto", objectFit: "contain" }} priority />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: APPLE.secondary, fontWeight: 500 }}>Confidential · ADUabl.com</span>
          <Link href="/" style={{ background: APPLE.surface, borderRadius: "8px", padding: "6px 14px", fontSize: "13px", fontWeight: 500, color: APPLE.secondary, textDecoration: "none" }}>
            ← Back
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: "100px", paddingBottom: "40px", paddingLeft: "24px", paddingRight: "24px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <Image src="/logo-icon.png" alt="iKingdom" width={64} height={64}
              style={{ height: "48px", width: "auto", objectFit: "contain", opacity: 0.9 }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#FDF6EC", borderRadius: "980px", padding: "5px 16px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: APPLE.gold, letterSpacing: "0.02em" }}>
                Client Briefing — ADUabl.com
              </span>
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 700, color: APPLE.ink, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "16px" }}>
            Tell us about your operation.
          </h1>
          <p style={{ fontSize: "16px", color: APPLE.secondary, lineHeight: 1.7, maxWidth: "500px", margin: "0 auto 10px", fontWeight: 400 }}>
            The following information allows us to build a system that fits your exact workflow — not a generic template. The more context you give us, the more precisely we can scope and price your build.
          </p>
          <p style={{ fontSize: "13px", color: APPLE.secondary, opacity: 0.55 }}>Strictly confidential. All information is held in confidence.</p>
        </motion.div>
      </section>

      {/* ── Form ── */}
      <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ maxWidth: "780px", margin: "0 auto", padding: "0 16px 100px" }}>

        {/* 01 — Online Presence */}
        <Reveal>
          <div style={card}>
            <SectionHeader n="01 — Online Presence" label="Where do people find you today?" />
            <div style={gap}>
              <Field label="Primary Website URL">
                <Input type="url" value={form.websiteUrl} onChange={v => set("websiteUrl", v)} placeholder="https://aduabl.com" />
              </Field>
              <Field label="Website Platform / CMS" hint="WordPress, Elementor, Wix, custom, etc.">
                <Input value={form.websitePlatform} onChange={v => set("websitePlatform", v)} placeholder="e.g. WordPress + Elementor" />
              </Field>
              <Field label="Active Social Media Profiles" hint="List all platforms where you have a presence, even if inactive.">
                <TextArea rows={3} value={form.socialProfiles} onChange={v => set("socialProfiles", v)}
                  placeholder="e.g. Instagram (@aduabl) — occasional posts&#10;LinkedIn — not active&#10;Facebook — claimed but unused" />
              </Field>
              <Field label="Google Business Profile" hint="Claimed and verified? Approximate review count and star rating.">
                <Input value={form.googleBusiness} onChange={v => set("googleBusiness", v)} placeholder="e.g. Claimed, ~12 reviews, 4.8 stars" />
              </Field>
            </div>
          </div>
        </Reveal>

        {/* 02 — Current Systems & Tools */}
        <Reveal delay={0.04}>
          <div style={card}>
            <SectionHeader n="02 — Current Systems & Tools" label="What's running your business right now?" />
            <div style={gap}>
              <div style={grid2}>
                <Field label="Loan Origination Software (LOS)" hint="What do you use to process and submit applications?">
                  <Input value={form.los} onChange={v => set("los", v)} placeholder="e.g. Encompass, Calyx, none" />
                </Field>
                <Field label="CRM / Lead Management" hint="How do you track and manage leads?">
                  <Input value={form.crm} onChange={v => set("crm", v)} placeholder="e.g. HubSpot, spreadsheet, none" />
                </Field>
              </div>
              <div style={grid2}>
                <Field label="Email Platform" hint="Gmail, Outlook, etc.">
                  <Input value={form.emailPlatform} onChange={v => set("emailPlatform", v)} placeholder="e.g. Gmail" />
                </Field>
                <Field label="Email Marketing / Nurture" hint="Mailchimp, ActiveCampaign, none, etc.">
                  <Input value={form.emailMarketing} onChange={v => set("emailMarketing", v)} placeholder="e.g. None currently" />
                </Field>
              </div>
              <div style={grid2}>
                <Field label="Appointment Scheduling Tool">
                  <Input value={form.schedulingTool} onChange={v => set("schedulingTool", v)} placeholder="e.g. Calendly, phone only" />
                </Field>
                <Field label="E-Signature Platform">
                  <Input value={form.eSignature} onChange={v => set("eSignature", v)} placeholder="e.g. DocuSign, none" />
                </Field>
              </div>
              <Field label="How do leads currently find you?" hint="Be specific — referrals, Google, social, paid ads, etc. Estimate percentage from each.">
                <TextArea rows={4} value={form.leadSources} onChange={v => set("leadSources", v)}
                  placeholder="e.g. Referrals from realtors — ~60%&#10;Google organic — ~25%&#10;Social media — ~10%&#10;Paid ads — ~5%" />
              </Field>
            </div>
          </div>
        </Reveal>

        {/* 03 — Volume & Operations */}
        <Reveal delay={0.06}>
          <div style={card}>
            <SectionHeader n="03 — Volume & Operations" label="How does your business actually run?" />
            <div style={gap}>
              <div style={grid2}>
                <Field label="Monthly Lead Volume (approx.)">
                  <Input value={form.monthlyLeads} onChange={v => set("monthlyLeads", v)} placeholder="e.g. 15–20 leads/month" />
                </Field>
                <Field label="Monthly Closing Rate">
                  <Input value={form.closingRate} onChange={v => set("closingRate", v)} placeholder="e.g. ~30%" />
                </Field>
              </div>
              <div style={grid2}>
                <Field label="Current Team Size">
                  <Input value={form.teamSize} onChange={v => set("teamSize", v)} placeholder="e.g. Just me, or 1 assistant" />
                </Field>
                <Field label="Monthly Marketing Spend">
                  <Input value={form.marketingSpend} onChange={v => set("marketingSpend", v)} placeholder="e.g. $500/mo on Google Ads" />
                </Field>
              </div>
              <Field label="Biggest operational bottleneck right now">
                <Input value={form.biggestBottleneck} onChange={v => set("biggestBottleneck", v)}
                  placeholder="e.g. Following up with leads manually, disclosure paperwork" />
              </Field>
              <Field label="Where does time disappear?" hint="What is the most painful or repetitive part of your day?">
                <TextArea rows={4} value={form.timeWaste} onChange={v => set("timeWaste", v)}
                  placeholder="e.g. I spend 2–3 hours/day answering the same questions from borrowers who aren't even pre-qualified yet. Every disclosure has to be prepared and sent manually." />
              </Field>
            </div>
          </div>
        </Reveal>

        {/* 04 — Investment */}
        <Reveal delay={0.08}>
          <div style={card}>
            <SectionHeader n="04 — Investment" label="What are you prepared to invest?" />
            <div style={gap}>
              <Field label="Upfront Build Investment" hint="What are you prepared to invest to build this system?">
                <SelectInput value={form.buildBudget} onChange={v => set("buildBudget", v)}>
                  <option value="">Select a range</option>
                  <option value="under5k">Under $5k</option>
                  <option value="5k-10k">$5k – $10k</option>
                  <option value="10k-20k">$10k – $20k</option>
                  <option value="20k-35k">$20k – $35k</option>
                  <option value="35k-50k">$35k – $50k</option>
                  <option value="50k+">$50k+</option>
                </SelectInput>
              </Field>
              <Field label="Monthly Operating Budget" hint="Ongoing maintenance, licensing, and optimization.">
                <SelectInput value={form.monthlyBudget} onChange={v => set("monthlyBudget", v)}>
                  <option value="">Select a range</option>
                  <option value="under500">Under $500</option>
                  <option value="500-1k">$500 – $1k</option>
                  <option value="1k-2.5k">$1k – $2.5k</option>
                  <option value="2.5k-5k">$2.5k – $5k</option>
                  <option value="5k+">$5k+</option>
                </SelectInput>
              </Field>
              <Field label="Anything else we should know?" hint="Lender relationships, compliance considerations, technology constraints, personal goals.">
                <TextArea rows={5} value={form.extra} onChange={v => set("extra", v)}
                  placeholder="e.g. I work exclusively with a few preferred lenders and need the system to route borrowers accordingly. I'm also mindful of RESPA compliance in automated communications." />
              </Field>
            </div>
          </div>
        </Reveal>

        {/* ── Submit ── */}
        <Reveal delay={0.1}>
          <div style={{ textAlign: "center", paddingTop: "8px" }}>
            <button type="submit" style={{
              background: APPLE.ink, color: "#fff", border: "none", borderRadius: "980px",
              padding: "15px 44px", fontSize: "15px", fontWeight: 600, fontFamily: APPLE.font,
              cursor: "pointer", letterSpacing: "-0.01em",
              transition: "background 0.2s ease, transform 0.15s ease",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#333")}
              onMouseLeave={e => (e.currentTarget.style.background = APPLE.ink)}
            >
              Submit Brief
            </button>
            <p style={{ fontSize: "12px", color: APPLE.secondary, marginTop: "14px", opacity: 0.6 }}>
              Complete the briefing above and return to <strong style={{ opacity: 1 }}>executive@ikingdom.org</strong>
            </p>
          </div>
        </Reveal>

      </form>
    </div>
  );
}
