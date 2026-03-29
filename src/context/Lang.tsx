"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "en" | "es";

const T: Record<string, { en: string; es: string }> = {
  // Nav
  "nav.capabilities": { en: "Solutions", es: "Soluciones" },
  "nav.proof": { en: "Proof", es: "Resultados" },
  "nav.process": { en: "Process", es: "Proceso" },
  "nav.engagement": { en: "Fit", es: "Fit" },
  "nav.contact": { en: "Contact", es: "Contacto" },

  // Hero
  "hero.eyebrow": { en: "Premium Growth Architecture", es: "Arquitectura de crecimiento de alto nivel" },
  "hero.headline": {
    en: "Growth architecture for companies that don't play average.",
    es: "Arquitectura de crecimiento para empresas que no juegan a ser promedio.",
  },
  "hero.sub": {
    en: "Systems that convert traffic into real clients, predictably.",
    es: "Sistemas que convierten tráfico en clientes reales, de forma predecible.",
  },
  "hero.cta": { en: "Request strategic diagnosis", es: "Solicitar diagnóstico estratégico" },
  "hero.cta2": { en: "See how it works", es: "Ver cómo funciona" },
  "hero.fine": {
    en: "Limited applications. We only work with companies ready to scale.",
    es: "Aplicación limitada. Solo trabajamos con empresas listas para escalar.",
  },
  "hero.trust": {
    en: "Most companies have a digital presence. Few have a system that sells.",
    es: "La mayoría tiene presencia digital. Pocos tienen un sistema que vende.",
  },

  // Stats
  "stat.1.value": { en: "12+", es: "12+" },
  "stat.1.label": { en: "Enterprise Ecosystems Deployed", es: "Ecosistemas Enterprise Desplegados" },
  "stat.2.value": { en: "3.2x", es: "3.2x" },
  "stat.2.label": { en: "Avg. Client Revenue Lift (Yr 1)", es: "Incremento Promedio de Revenue (Año 1)" },
  "stat.3.value": { en: "98%", es: "98%" },
  "stat.3.label": { en: "Client Retention Rate", es: "Tasa de Retención de Clientes" },

  // Capabilities
  "cap.label": { en: "Solutions", es: "Soluciones" },
  "cap.heading": { en: "We design premium digital platforms.", es: "Diseñamos plataformas digitales premium." },
  "cap.sub": {
    en: "We build digital platforms that position your brand, generate trust, and convert visitors into high-value clients.",
    es: "Plataformas digitales que trabajan tu marca y convierten visitantes en clientes de alto valor.",
  },
  "cap.1.metric": { en: "3–5x", es: "3–5x" },
  "cap.1.metricLabel": { en: "pipeline velocity", es: "velocidad de pipeline" },
  "cap.1.title": { en: "Revenue System Architecture", es: "Arquitectura de Sistemas de Revenue" },
  "cap.1.desc": {
    en: "We build the end-to-end system that finds, qualifies, and closes your highest-value customers — from first touchpoint to signed contract. AI-driven targeting, automated nurture sequences, and predictive lead scoring replace manual sales ops.",
    es: "Construimos el sistema end-to-end que encuentra, califica y cierra tus clientes de mayor valor — del primer contacto al contrato firmado. Targeting con IA, secuencias de nurture automatizadas y lead scoring predictivo reemplazan las ventas manuales.",
  },
  "cap.2.metric": { en: "60%", es: "60%" },
  "cap.2.metricLabel": { en: "operational cost reduction", es: "reducción de costos operativos" },
  "cap.2.title": { en: "Intelligent Operations Infrastructure", es: "Infraestructura de Operaciones Inteligentes" },
  "cap.2.desc": {
    en: "Custom AI layers that automate reporting, resource allocation, and decision workflows across your organization. Your teams stop managing spreadsheets and start managing strategy.",
    es: "Capas de IA personalizadas que automatizan reportes, asignación de recursos y flujos de decisión en toda tu organización. Tus equipos dejan de gestionar hojas de cálculo y empiezan a gestionar estrategia.",
  },
  "cap.3.metric": { en: "< 12 wk", es: "< 12 sem" },
  "cap.3.metricLabel": { en: "to production deployment", es: "a despliegue en producción" },
  "cap.3.title": { en: "Enterprise Platform Engineering", es: "Ingeniería de Plataformas Enterprise" },
  "cap.3.desc": {
    en: "Full-stack digital platforms — customer-facing interfaces, internal dashboards, and API ecosystems — engineered with AI embedded at every layer. Designed for scale from day one.",
    es: "Plataformas digitales full-stack — interfaces para clientes, dashboards internos y ecosistemas API — con IA integrada en cada capa. Diseñadas para escalar desde el día uno.",
  },

  // Proof
  "proof.label": { en: "Proof", es: "Resultados" },
  "proof.heading": { en: "Outcomes, not promises.", es: "Resultados, no promesas." },
  "proof.fine": {
    en: "Client details anonymized. Full case studies available under NDA during consultation.",
    es: "Datos de clientes anonimizados. Casos completos disponibles bajo NDA durante consulta.",
  },
  "proof.1.industry": { en: "Healthcare SaaS", es: "SaaS de Salud" },
  "proof.1.headline": { en: "From manual sales to 40+ qualified leads per month", es: "De ventas manuales a 40+ leads calificados por mes" },
  "proof.1.m1.value": { en: "+340%", es: "+340%" },
  "proof.1.m1.label": { en: "Lead conversion rate", es: "Tasa de conversión de leads" },
  "proof.1.m2.value": { en: "< 2 mo", es: "< 2 meses" },
  "proof.1.m2.label": { en: "Time to ROI", es: "Tiempo a ROI" },
  "proof.1.scope": {
    en: "Full revenue system: AI-powered chat, automated qualification funnel, and CRM integration for a mid-market healthcare platform.",
    es: "Sistema de revenue completo: chat con IA, embudo de calificación automatizado e integración CRM para plataforma de salud mid-market.",
  },
  "proof.2.industry": { en: "Financial Services", es: "Servicios Financieros" },
  "proof.2.headline": { en: "Investor portal that became the primary acquisition channel", es: "Portal de inversores que se convirtió en el canal principal de adquisición" },
  "proof.2.m1.value": { en: "$12M", es: "$12M" },
  "proof.2.m1.label": { en: "AUM influenced by platform", es: "AUM influenciado por plataforma" },
  "proof.2.m2.value": { en: "94", es: "94" },
  "proof.2.m2.label": { en: "NPS score", es: "Puntuación NPS" },
  "proof.2.scope": {
    en: "Enterprise platform with real-time analytics dashboard, automated onboarding, and compliance-grade KYC integration.",
    es: "Plataforma enterprise con dashboard de analítica en tiempo real, onboarding automatizado e integración KYC de grado compliance.",
  },
  "proof.3.industry": { en: "E-Commerce / DTC", es: "E-Commerce / DTC" },
  "proof.3.headline": { en: "AI recommendations that tripled average order value", es: "Recomendaciones con IA que triplicaron el ticket promedio" },
  "proof.3.m1.value": { en: "+62%", es: "+62%" },
  "proof.3.m1.label": { en: "Avg. ticket increase", es: "Incremento de ticket promedio" },
  "proof.3.m2.value": { en: "78%", es: "78%" },
  "proof.3.m2.label": { en: "Customer retention rate", es: "Tasa de retención" },
  "proof.3.scope": {
    en: "Intelligent commerce engine: ML-driven product recommendations, predictive inventory, and automated lifecycle marketing.",
    es: "Motor de comercio inteligente: recomendaciones ML, inventario predictivo y marketing de ciclo de vida automatizado.",
  },

  // Process
  "proc.label": { en: "Process", es: "Proceso" },
  "proc.heading": { en: "Structured. Transparent. Accountable.", es: "Estructurado. Transparente. Responsable." },
  "proc.sub": {
    en: "Every engagement follows this framework. No ambiguity about what happens, when, or what it costs.",
    es: "Cada alianza sigue este framework. Sin ambigüedad sobre qué pasa, cuándo, o cuánto cuesta.",
  },
  "proc.1.title": { en: "Intelligence & Diagnostic", es: "Inteligencia y Diagnóstico" },
  "proc.1.dur": { en: "2 weeks", es: "2 semanas" },
  "proc.1.desc": {
    en: "We audit your market position, digital infrastructure, and operational bottlenecks. You receive a strategic diagnostic with prioritized recommendations and a complete implementation roadmap.",
    es: "Auditamos tu posición de mercado, infraestructura digital y cuellos de botella operativos. Recibes un diagnóstico estratégico con recomendaciones priorizadas y un roadmap completo.",
  },
  "proc.2.title": { en: "System Architecture", es: "Arquitectura del Sistema" },
  "proc.2.dur": { en: "3 weeks", es: "3 semanas" },
  "proc.2.desc": {
    en: "We design the full ecosystem — data models, integration points, AI capabilities, and technology stack. Every architectural decision is reviewed with your team before engineering begins.",
    es: "Diseñamos el ecosistema completo — modelos de datos, puntos de integración, capacidades de IA y stack tecnológico. Cada decisión arquitectónica se revisa con tu equipo antes de iniciar ingeniería.",
  },
  "proc.3.title": { en: "Build & Validate", es: "Construcción y Validación" },
  "proc.3.dur": { en: "8–12 weeks", es: "8–12 semanas" },
  "proc.3.desc": {
    en: "Two-week sprints with live demonstrations. AI models trained on your data. Interfaces stress-tested with real users. Nothing moves to production until it meets our quality threshold.",
    es: "Sprints de dos semanas con demos en vivo. Modelos de IA entrenados con tus datos. Interfaces probadas con usuarios reales. Nada pasa a producción hasta cumplir nuestro umbral de calidad.",
  },
  "proc.4.title": { en: "Deploy & Compound", es: "Despliegue y Crecimiento" },
  "proc.4.dur": { en: "Ongoing", es: "Continuo" },
  "proc.4.desc": {
    en: "Enterprise-grade infrastructure with automated monitoring. Monthly optimization cycles. Quarterly strategic reviews. Your system gets smarter every month — and so does our partnership.",
    es: "Infraestructura enterprise-grade con monitoreo automatizado. Ciclos de optimización mensuales. Revisiones estratégicas trimestrales. Tu sistema mejora cada mes — y nuestra alianza también.",
  },

  // Engagement
  "eng.label": { en: "Engagement", es: "Alianza" },
  "eng.heading": { en: "One standard of work.", es: "Un solo estándar de trabajo." },
  "eng.left.p1": {
    en: "We do not offer tiers, packages, or retainers. Every engagement is a full-scope partnership — custom-architected to your organization, your market, and your growth objectives.",
    es: "No ofrecemos tiers, paquetes ni retainers. Cada alianza es una partnership de alcance completo — arquitectada a la medida de tu organización, tu mercado y tus objetivos de crecimiento.",
  },
  "eng.left.p2": {
    en: "We accept 4–6 new engagements per quarter. If we are not the right fit, we will tell you directly and recommend alternatives.",
    es: "Aceptamos 4–6 nuevas alianzas por trimestre. Si no somos el fit correcto, te lo diremos directamente y recomendaremos alternativas.",
  },
  "eng.price": { en: "From $45,000 USD", es: "Desde $45,000 USD" },
  "eng.scope": { en: "Scoped to complexity. Paid in milestones.", es: "Alcance según complejidad. Pago por milestones." },
  "eng.what": { en: "What You Receive", es: "Lo Que Recibes" },
  "eng.d1": { en: "Strategic diagnostic & implementation roadmap", es: "Diagnóstico estratégico y roadmap de implementación" },
  "eng.d2": { en: "Full AI ecosystem — architecture through deployment", es: "Ecosistema AI completo — de arquitectura a despliegue" },
  "eng.d3": { en: "Custom-trained AI models on your operational data", es: "Modelos de IA entrenados con tus datos operativos" },
  "eng.d4": { en: "Executive analytics dashboard with predictive intelligence", es: "Dashboard ejecutivo con inteligencia predictiva" },
  "eng.d5": { en: "12-month optimization partnership with dedicated team", es: "Alianza de optimización de 12 meses con equipo dedicado" },
  "eng.cta": { en: "Apply for Consultation", es: "Solicitar Consulta" },
  "eng.fine": {
    en: "We will tell you honestly if we are the right fit.",
    es: "Te diremos honestamente si somos el fit correcto.",
  },

  // Contact
  "contact.label": { en: "Engagement Application", es: "Solicitud de Alianza" },
  "contact.heading": { en: "Start with a conversation.", es: "Inicia con una conversación." },
  "contact.sub": {
    en: "We review every application personally. If there is a strong fit, you will hear from a senior partner within 48 hours.",
    es: "Revisamos cada solicitud personalmente. Si hay un fuerte fit, tendrás noticias de un socio senior en 48 horas.",
  },
  "contact.fine": { en: "We accept 4–6 new engagements per quarter.", es: "Aceptamos 4–6 nuevas alianzas por trimestre." },
  "contact.f1": { en: "Your Name", es: "Tu Nombre" },
  "contact.f2": { en: "Organization", es: "Organización" },
  "contact.f3": { en: "Website or LinkedIn", es: "Sitio Web o LinkedIn" },
  "contact.f4": { en: "Annual Revenue Range", es: "Rango de Revenue Anual" },
  "contact.f5": {
    en: "What does your organization need to solve in the next 12 months?",
    es: "¿Qué necesita resolver tu organización en los próximos 12 meses?",
  },
  "contact.cta": { en: "Submit Application", es: "Enviar Solicitud" },
  "contact.rev.1": { en: "Under $1M", es: "Menos de $1M" },
  "contact.rev.2": { en: "$1M — $5M", es: "$1M — $5M" },
  "contact.rev.3": { en: "$5M — $20M", es: "$5M — $20M" },
  "contact.rev.4": { en: "$20M — $100M", es: "$20M — $100M" },
  "contact.rev.5": { en: "$100M+", es: "$100M+" },
};

interface LangCtx { lang: Lang; toggle: () => void; t: (k: string) => string }

const Ctx = createContext<LangCtx>({ lang: "es", toggle: () => {}, t: (k) => k });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const toggle = useCallback(() => setLang((l) => (l === "en" ? "es" : "en")), []);
  const t = useCallback((k: string) => T[k]?.[lang] ?? k, [lang]);
  return <Ctx.Provider value={{ lang, toggle, t }}>{children}</Ctx.Provider>;
}

export function useLang() { return useContext(Ctx); }
