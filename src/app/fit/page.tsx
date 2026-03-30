"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AnnaChatWidget from "@/components/AnnaChatWidget";

// ── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  // 1. Contact
  fullName: string; company: string; email: string;
  phone: string; website: string; instagram: string;
  // 2. Business
  businessDescription: string; currentOffer: string;
  avgTicket: string; targetClient: string; location: string;
  // 3. Situation
  mainChallenge: string; triedBefore: string;
  notWorking: string; runningAds: string; hasWebsite: string;
  // 4. Goals
  goals90Days: string; serviceInterest: string;
  budget: string; timeline: string;
  // 5. Brand
  brandFeeling: string; visualReferences: string;
  tonePreferences: string; inspirationLinks: string;
  // 6. Final
  notes: string; consent: boolean;
}

const INITIAL: FormData = {
  fullName: "", company: "", email: "", phone: "", website: "", instagram: "",
  businessDescription: "", currentOffer: "", avgTicket: "", targetClient: "", location: "",
  mainChallenge: "", triedBefore: "", notWorking: "", runningAds: "", hasWebsite: "",
  goals90Days: "", serviceInterest: "", budget: "", timeline: "",
  brandFeeling: "", visualReferences: "", tonePreferences: "", inspirationLinks: "",
  notes: "", consent: false,
};

// ── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "contact", index: 1, label: "Contacto",
    title: "¿Con quién hablamos?",
    subtitle: "Información básica para identificar tu caso.",
  },
  {
    id: "business", index: 2, label: "Negocio",
    title: "Tu negocio, en detalle.",
    subtitle: "Necesitamos entender qué construiste antes de opinar.",
  },
  {
    id: "situation", index: 3, label: "Situación",
    title: "Dónde estás ahora.",
    subtitle: "Honestidad total. No juzgamos el punto de partida.",
  },
  {
    id: "goals", index: 4, label: "Objetivos",
    title: "A dónde quieres llegar.",
    subtitle: "Define el resultado que considerarías un éxito.",
  },
  {
    id: "brand", index: 5, label: "Marca",
    title: "La identidad de tu marca.",
    subtitle: "Dirección visual y tonal para trabajar con precisión.",
  },
  {
    id: "final", index: 6, label: "Cierre",
    title: "Últimos detalles.",
    subtitle: "Cualquier información adicional que quieras incluir.",
  },
];

const SERVICE_OPTIONS = [
  "Ecosistema digital completo",
  "Diseño web premium",
  "Automatización con IA",
  "Arquitectura de conversión",
  "Estrategia y narrativa de marca",
  "Implementación y escalamiento",
  "No estoy seguro aún",
];

const BUDGET_OPTIONS = [
  "< $5,000 USD",
  "$5,000 – $15,000 USD",
  "$15,000 – $50,000 USD",
  "$50,000 – $150,000 USD",
  "$150,000+ USD",
  "Por definir",
];

const TIMELINE_OPTIONS = [
  "Inmediato (este mes)",
  "1 – 3 meses",
  "3 – 6 meses",
  "6 – 12 meses",
  "Explorando opciones",
];

const TONE_OPTIONS = [
  "Institucional / Corporativo",
  "Premium / Lujo",
  "Técnico / Preciso",
  "Humano / Cercano",
  "Innovador / Disruptivo",
  "Minimalista / Austero",
];

// ── Field component ──────────────────────────────────────────────────────────
function Field({
  label, required, hint, children,
}: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <span className="text-[11px] font-semibold tracking-[0.32em] uppercase"
          style={{ color: "rgba(180,210,255,0.55)" }}>
          {label}
        </span>
        {required && (
          <span className="text-[10px]" style={{ color: "rgba(212,175,55,0.6)" }}>*</span>
        )}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] font-light" style={{ color: "rgba(180,210,255,0.28)" }}>{hint}</p>
      )}
    </div>
  );
}

// ── Input styles ─────────────────────────────────────────────────────────────
const inputCls = "w-full text-[14px] font-light focus:outline-none transition-all duration-200 py-3 px-0";
const inputStyle: React.CSSProperties = {
  background: "transparent",
  borderBottom: "1px solid rgba(180,210,255,0.12)",
  color: "rgba(230,240,255,0.88)",
  caretColor: "rgba(212,175,55,0.9)",
};
const inputFocusStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(212,175,55,0.55)",
};

function TextInput({ value, onChange, placeholder = "—", type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      className={inputCls}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}), opacity: value ? 1 : 0.6 }}
    />
  );
}

function TextArea({ value, onChange, placeholder = "—", rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      className={inputCls + " resize-none"}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}) }}
    />
  );
}

function SelectInput({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={inputCls + " appearance-none cursor-pointer"}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}), color: value ? "rgba(230,240,255,0.88)" : "rgba(180,210,255,0.28)" }}
    >
      <option value="" style={{ background: "#0D1B2E" }}>Seleccionar —</option>
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "#0D1B2E" }}>{o}</option>
      ))}
    </select>
  );
}

function RadioGroup({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { label: string; val: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {options.map((o) => (
        <button key={o.val} type="button" onClick={() => onChange(o.val)}
          className="px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-200"
          style={{
            border: `1px solid ${value === o.val ? "rgba(212,175,55,0.65)" : "rgba(180,210,255,0.12)"}`,
            color: value === o.val ? "rgba(212,175,55,0.9)" : "rgba(180,210,255,0.42)",
            background: value === o.val ? "rgba(212,175,55,0.06)" : "transparent",
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Section content ──────────────────────────────────────────────────────────
function SectionContact({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Field label="Nombre completo" required>
        <TextInput value={data.fullName} onChange={(v) => set("fullName", v)} />
      </Field>
      <Field label="Empresa / Proyecto" required>
        <TextInput value={data.company} onChange={(v) => set("company", v)} />
      </Field>
      <Field label="Email" required>
        <TextInput value={data.email} onChange={(v) => set("email", v)} type="email" />
      </Field>
      <Field label="Teléfono / WhatsApp" hint="Incluye código de país">
        <TextInput value={data.phone} onChange={(v) => set("phone", v)} placeholder="+1 555 000 0000" />
      </Field>
      <Field label="Sitio web" hint="URL actual si tienes uno">
        <TextInput value={data.website} onChange={(v) => set("website", v)} placeholder="https://" />
      </Field>
      <Field label="Instagram" hint="Perfil del negocio">
        <TextInput value={data.instagram} onChange={(v) => set("instagram", v)} placeholder="@usuario" />
      </Field>
    </div>
  );
}

function SectionBusiness({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-8">
      <Field label="¿A qué se dedica tu negocio?" required>
        <TextArea value={data.businessDescription} onChange={(v) => set("businessDescription", v)}
          placeholder="Describe tu actividad principal, sector y modelo de negocio." rows={3} />
      </Field>
      <Field label="¿Qué vendes actualmente?" required>
        <TextArea value={data.currentOffer} onChange={(v) => set("currentOffer", v)}
          placeholder="Productos, servicios, programas, SaaS, etc." rows={2} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="Ticket promedio" hint="Valor aproximado por venta o contrato">
          <TextInput value={data.avgTicket} onChange={(v) => set("avgTicket", v)} placeholder="Ej: $3,000 USD" />
        </Field>
        <Field label="Cliente objetivo" hint="A quién le vendes o quieres venderle">
          <TextInput value={data.targetClient} onChange={(v) => set("targetClient", v)} placeholder="Perfil, industria, tamaño…" />
        </Field>
      </div>
      <Field label="Ciudad / País">
        <TextInput value={data.location} onChange={(v) => set("location", v)} placeholder="Ciudad, País" />
      </Field>
    </div>
  );
}

function SectionSituation({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-8">
      <Field label="Principal desafío actual" required>
        <TextArea value={data.mainChallenge} onChange={(v) => set("mainChallenge", v)}
          placeholder="¿Qué problema específico te trajo aquí? Sé directo." rows={3} />
      </Field>
      <Field label="¿Qué has intentado?">
        <TextArea value={data.triedBefore} onChange={(v) => set("triedBefore", v)}
          placeholder="Agencias, herramientas, estrategias previas, inversiones…" rows={3} />
      </Field>
      <Field label="¿Qué no está funcionando?">
        <TextArea value={data.notWorking} onChange={(v) => set("notWorking", v)}
          placeholder="Sé específico. Esta información es clave para el diagnóstico." rows={2} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="¿Estás corriendo anuncios?">
          <RadioGroup value={data.runningAds} onChange={(v) => set("runningAds", v)}
            options={[
              { label: "Sí, activamente", val: "yes-active" },
              { label: "Pausados", val: "paused" },
              { label: "No", val: "no" },
            ]} />
        </Field>
        <Field label="¿Tienes sitio web?">
          <RadioGroup value={data.hasWebsite} onChange={(v) => set("hasWebsite", v)}
            options={[
              { label: "Sí", val: "yes" },
              { label: "En construcción", val: "building" },
              { label: "No", val: "no" },
            ]} />
        </Field>
      </div>
    </div>
  );
}

function SectionGoals({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-8">
      <Field label="¿Qué quieres lograr en los próximos 90 días?" required>
        <TextArea value={data.goals90Days} onChange={(v) => set("goals90Days", v)}
          placeholder="Define el resultado específico que considerarías un éxito." rows={3} />
      </Field>
      <Field label="Servicio de interés" required>
        <SelectInput value={data.serviceInterest} onChange={(v) => set("serviceInterest", v)} options={SERVICE_OPTIONS} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="Presupuesto estimado" required>
          <SelectInput value={data.budget} onChange={(v) => set("budget", v)} options={BUDGET_OPTIONS} />
        </Field>
        <Field label="Timeline deseado" required>
          <SelectInput value={data.timeline} onChange={(v) => set("timeline", v)} options={TIMELINE_OPTIONS} />
        </Field>
      </div>
    </div>
  );
}

function SectionBrand({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-8">
      <Field label="Sensación de marca deseada"
        hint="¿Cómo quieres que se sienta alguien al ver tu marca por primera vez?">
        <TextArea value={data.brandFeeling} onChange={(v) => set("brandFeeling", v)}
          placeholder="Confianza, autoridad, modernidad, exclusividad, cercanía…" rows={2} />
      </Field>
      <Field label="Preferencias de tono">
        <div className="space-y-2">
          <RadioGroup value={data.tonePreferences} onChange={(v) => set("tonePreferences", v)}
            options={TONE_OPTIONS.map((t) => ({ label: t, val: t }))} />
          <TextInput value={data.tonePreferences.startsWith("Otro:") ? data.tonePreferences.slice(5) : ""}
            onChange={(v) => v ? set("tonePreferences", `Otro: ${v}`) : undefined}
            placeholder="O describe el tuyo…" />
        </div>
      </Field>
      <Field label="Referencias visuales" hint="Marcas, sitios o estilos que admiras">
        <TextArea value={data.visualReferences} onChange={(v) => set("visualReferences", v)}
          placeholder="Apple, Notion, Stripe, Rolex, The Row… lo que resuene." rows={2} />
      </Field>
      <Field label="Competidores o inspiración" hint="Links, nombres o perfiles de referencia">
        <TextArea value={data.inspirationLinks} onChange={(v) => set("inspirationLinks", v)}
          placeholder="URLs, @handles, nombres de empresas…" rows={2} />
      </Field>
    </div>
  );
}

function SectionFinal({ data, set, setConsent }: {
  data: FormData; set: (k: keyof FormData, v: string) => void;
  setConsent: (v: boolean) => void;
}) {
  return (
    <div className="space-y-8">
      <Field label="Notas adicionales" hint="Cualquier contexto que no hayas podido incluir arriba">
        <TextArea value={data.notes} onChange={(v) => set("notes", v)}
          placeholder="Añade cualquier detalle relevante…" rows={4} />
      </Field>
      {/* Consent */}
      <div className="pt-2">
        <button type="button" onClick={() => setConsent(!data.consent)}
          className="flex items-start gap-4 text-left w-full group">
          <div className="w-5 h-5 flex-shrink-0 mt-[2px] transition-all duration-200 flex items-center justify-center"
            style={{
              border: `1px solid ${data.consent ? "rgba(212,175,55,0.7)" : "rgba(180,210,255,0.2)"}`,
              background: data.consent ? "rgba(212,175,55,0.12)" : "transparent",
            }}>
            {data.consent && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="rgba(212,175,55,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <p className="text-[13px] font-light leading-[1.7]" style={{ color: "rgba(180,210,255,0.5)" }}>
            Acepto que iKingdom almacene y procese esta información para evaluar
            mi solicitud. No compartiré datos con terceros sin consentimiento.{" "}
            <Link href="/privacy-policy" target="_blank"
              className="underline underline-offset-2 transition-colors duration-200"
              style={{ color: "rgba(212,175,55,0.55)" }}>
              Política de privacidad
            </Link>
            .
          </p>
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FitIntake() {
  const [data,    setData]    = useState<FormData>(INITIAL);
  const [step,    setStep]    = useState(0);
  const [dir,     setDir]     = useState(1); // 1=forward -1=back
  const [status,  setStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg,  setErrMsg]  = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  function set(key: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goNext() {
    setDir(1);
    setStep((s) => Math.min(s + 1, SECTIONS.length - 1));
    scrollTop();
  }

  function goBack() {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
    scrollTop();
  }

  function validateStep(): boolean {
    const s = step;
    if (s === 0) return !!data.fullName.trim() && !!data.email.trim() && !!data.company.trim();
    if (s === 1) return !!data.businessDescription.trim() && !!data.currentOffer.trim();
    if (s === 2) return !!data.mainChallenge.trim();
    if (s === 3) return !!data.goals90Days.trim() && !!data.serviceInterest && !!data.budget && !!data.timeline;
    if (s === 5) return data.consent;
    return true;
  }

  async function handleSubmit() {
    if (!validateStep()) { setErrMsg("Completa los campos obligatorios antes de continuar."); return; }
    setErrMsg("");
    setStatus("loading");

    try {
      const res = await fetch("/api/fit-intake", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      scrollTop();
    } catch {
      setStatus("error");
      setErrMsg("Error al enviar. Por favor intenta de nuevo.");
      setStatus("idle");
    }
  }

  const isLast  = step === SECTIONS.length - 1;
  const section = SECTIONS[step];
  const valid   = validateStep();

  // ── Transition variants ──────────────────────────────────────────────────
  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -32 : 32 }),
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 py-24"
        style={{ background: "#080F1A", fontFamily: "'Space Grotesk','Inter',system-ui,sans-serif" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.08, 0.82, 0.17, 1] }}
          className="max-w-[560px] w-full text-center space-y-8">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 flex items-center justify-center"
            style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.04)" }}>
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
              <path d="M2 10l7 7L22 2" stroke="rgba(212,175,55,0.85)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.4em] uppercase"
              style={{ color: "rgba(212,175,55,0.4)" }}>
              SOLICITUD RECIBIDA
            </p>
            <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]"
              style={{ color: "rgba(230,240,255,0.92)" }}>
              Tu diagnóstico<br />está en proceso.
            </h1>
            <p className="text-[15px] font-light leading-[1.8]"
              style={{ color: "rgba(180,210,255,0.5)" }}>
              Revisamos cada solicitud manualmente antes de responder.
              Te contactamos dentro de las próximas 48 horas con nuestra
              evaluación inicial.
            </p>
          </div>
          <div className="h-px w-full" style={{ background: "rgba(212,175,55,0.12)" }} />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/"
              className="text-[11px] tracking-[0.28em] uppercase font-semibold transition-colors duration-300"
              style={{ color: "rgba(212,175,55,0.55)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(212,175,55,1)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(212,175,55,0.55)")}>
              ← Volver al inicio
            </Link>
            <a href="https://wa.me/19565095558" target="_blank" rel="noopener noreferrer"
              className="text-[11px] tracking-[0.28em] uppercase font-semibold transition-colors duration-300"
              style={{ color: "rgba(180,210,255,0.35)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(180,210,255,0.7)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(180,210,255,0.35)")}>
              WhatsApp directo →
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen"
      style={{ background: "#080F1A", fontFamily: "'Space Grotesk','Inter',system-ui,sans-serif", color: "rgba(230,240,255,0.88)" }}>

      {/* Subtle grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(100,150,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(100,150,255,0.015) 1px,transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b"
        style={{ borderColor: "rgba(100,150,255,0.08)" }}>
        <Link href="/">
          <img src="/logo.png" alt="iKingdom" className="h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(212,175,55,0.8)", boxShadow: "0 0 6px rgba(212,175,55,0.5)" }} />
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(180,210,255,0.35)" }}>
            Solicitud Estratégica
          </span>
        </div>
      </nav>

      <div ref={topRef} className="relative z-10 max-w-[820px] mx-auto px-8 py-16 md:py-20">

        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] tracking-[0.32em] uppercase" style={{ color: "rgba(180,210,255,0.35)" }}>
              Paso {step + 1} de {SECTIONS.length}
            </p>
            <p className="text-[10px] tracking-[0.22em] uppercase" style={{ color: "rgba(212,175,55,0.45)" }}>
              {section.label}
            </p>
          </div>
          {/* Steps */}
          <div className="flex gap-1.5">
            {SECTIONS.map((s, i) => (
              <div key={s.id} className="flex-1 h-[2px] transition-all duration-500"
                style={{ background: i <= step ? "rgba(212,175,55,0.65)" : "rgba(100,150,255,0.12)" }} />
            ))}
          </div>
        </div>

        {/* Section header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.38em] uppercase mb-4"
            style={{ color: "rgba(212,175,55,0.4)" }}>
            {String(section.index).padStart(2, "0")} — {section.label.toUpperCase()}
          </p>
          <h1 className="font-semibold leading-[1.08] mb-3 tracking-[-0.02em]"
            style={{ fontSize: "clamp(26px, 3.5vw, 40px)", color: "rgba(230,240,255,0.92)" }}>
            {section.title}
          </h1>
          <p className="text-[15px] font-light" style={{ color: "rgba(180,210,255,0.45)" }}>
            {section.subtitle}
          </p>
        </div>

        {/* Divider */}
        <div className="mb-10 h-px" style={{ background: "rgba(100,150,255,0.08)" }} />

        {/* Section content with animation */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: [0.08, 0.82, 0.17, 1] }}>
            {step === 0 && <SectionContact data={data} set={set} />}
            {step === 1 && <SectionBusiness data={data} set={set} />}
            {step === 2 && <SectionSituation data={data} set={set} />}
            {step === 3 && <SectionGoals data={data} set={set} />}
            {step === 4 && <SectionBrand data={data} set={set} />}
            {step === 5 && (
              <SectionFinal data={data} set={set}
                setConsent={(v) => setData((prev) => ({ ...prev, consent: v }))} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        {errMsg && (
          <p className="mt-6 text-[12px] font-light" style={{ color: "rgba(220,80,80,0.75)" }}>
            {errMsg}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between">
          <button type="button" onClick={goBack} disabled={step === 0}
            className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] uppercase transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
            style={{ color: "rgba(180,210,255,0.38)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(180,210,255,0.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(180,210,255,0.38)")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4.5 7 9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Anterior
          </button>

          {isLast ? (
            <button type="button" onClick={handleSubmit}
              disabled={!valid || status === "loading"}
              className="flex items-center gap-3 px-7 py-3.5 text-[11px] font-semibold tracking-[0.3em] uppercase transition-all duration-300 disabled:opacity-40"
              style={{ border: "1px solid rgba(212,175,55,0.5)", color: "rgba(212,175,55,0.9)", background: "rgba(212,175,55,0.04)" }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "rgba(212,175,55,0.1)"; el.style.borderColor = "rgba(212,175,55,0.8)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "rgba(212,175,55,0.04)"; el.style.borderColor = "rgba(212,175,55,0.5)"; }}>
              {status === "loading" ? (
                <><span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />ENVIANDO</>
              ) : (
                <>ENVIAR SOLICITUD <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg></>
              )}
            </button>
          ) : (
            <button type="button" onClick={() => { if (!valid) { setErrMsg("Completa los campos obligatorios antes de continuar."); return; } setErrMsg(""); goNext(); }}
              className="flex items-center gap-3 px-7 py-3.5 text-[11px] font-semibold tracking-[0.3em] uppercase transition-all duration-300"
              style={{ border: "1px solid rgba(212,175,55,0.38)", color: "rgba(212,175,55,0.82)", background: "transparent" }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "rgba(212,175,55,0.07)"; el.style.borderColor = "rgba(212,175,55,0.65)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "transparent"; el.style.borderColor = "rgba(212,175,55,0.38)"; }}>
              CONTINUAR
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Step dots */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {SECTIONS.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? "20px" : "6px",
                height: "6px",
                background: i === step ? "rgba(212,175,55,0.7)" : i < step ? "rgba(212,175,55,0.3)" : "rgba(100,150,255,0.15)",
                borderRadius: i === step ? "3px" : "50%",
              }} />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t px-8 py-5 flex items-center justify-between"
        style={{ borderColor: "rgba(100,150,255,0.07)" }}>
        <p className="text-[10px] tracking-[0.12em]" style={{ color: "rgba(180,210,255,0.2)" }}>
          © 2026 iKingdom
        </p>
        <div className="flex gap-5">
          <Link href="/privacy-policy" className="text-[10px] tracking-[0.18em] uppercase"
            style={{ color: "rgba(180,210,255,0.2)" }}>Privacidad</Link>
          <Link href="/terms-of-service" className="text-[10px] tracking-[0.18em] uppercase"
            style={{ color: "rgba(180,210,255,0.2)" }}>Términos</Link>
        </div>
      </div>
    </div>
  );
}
