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
    en: "Systems that convert traffic into real clients, predictably and scalably.",
    es: "Sistemas que convierten tráfico en clientes reales, de forma predecible y escalable.",
  },
  "hero.cta": { en: "Apply for strategic diagnosis", es: "Aplicar para diagnóstico estratégico" },
  "hero.cta2": { en: "See how it works", es: "Ver cómo funciona" },
  "hero.fine": {
    en: "Limited applications. We only work with companies ready to scale with structure.",
    es: "Aplicación limitada. Solo trabajamos con empresas listas para escalar con estructura.",
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

  // Shared CTAs
  "scarcity": { en: "We only accept 4–6 projects per quarter.", es: "Solo aceptamos 4–6 proyectos por trimestre." },
  "cap.plan.cta": { en: "Request diagnosis", es: "Solicitar diagnóstico" },

  // ClarityStrip
  "clarity.headline": { en: "Visibility is not the same as conversion.", es: "Tener visibilidad no es lo mismo que tener conversión." },
  "clarity.sub": { en: "We design the infrastructure that transforms attention into commercial opportunity.", es: "Diseñamos la infraestructura que transforma atención en oportunidad comercial." },
  "clarity.tagline": { en: "Strategy · Architecture · Implementation", es: "Estrategia · Arquitectura · Implementación" },

  // Capabilities section
  "cap.section.heading": { en: "Architectures designed to scale your business.", es: "Arquitecturas diseñadas para escalar tu negocio." },
  "cap.section.sub": { en: "We don't sell web pages. We build systems that convert, position, and sustain real growth.", es: "No vendemos páginas web. Construimos sistemas que convierten, posicionan y sostienen crecimiento real." },
  "cap.section.select": { en: "We select the tier based on your current structure and objectives.", es: "Seleccionamos el nivel según tu estructura actual y objetivos." },
  "cap.plan.badge": { en: "RECOMMENDED", es: "RECOMENDADO" },
  "cap.plan.1.name": { en: "Strategic Web", es: "Web Estratégica" },
  "cap.plan.1.desc": { en: "Your digital presence ready to position your brand and convert from day one.", es: "Tu presencia digital lista para posicionar tu marca y convertir desde el primer día." },
  "cap.plan.1.f1": { en: "Strategic diagnosis", es: "Diagnóstico estratégico" },
  "cap.plan.1.f2": { en: "Message architecture and copy", es: "Arquitectura de mensaje y copy" },
  "cap.plan.1.f3": { en: "Premium design aligned to your brand", es: "Diseño premium alineado a tu marca" },
  "cap.plan.1.f4": { en: "Optimized responsive development", es: "Desarrollo responsive optimizado" },
  "cap.plan.1.f5": { en: "Base analytics and metrics", es: "Analítica y métricas base" },
  "cap.plan.1.note": { en: "For projects that need structural clarity with fast execution.", es: "Para proyectos que necesitan claridad estructural con ejecución rápida." },
  "cap.plan.2.name": { en: "Acquisition System", es: "Sistema de Captación" },
  "cap.plan.2.desc": { en: "Your sales system operating. Capture, filter, and convert clients without manual intervention.", es: "Tu sistema de venta operando. Capta, filtra y convierte clientes sin intervención manual." },
  "cap.plan.2.f1": { en: "Everything in Strategic Web", es: "Todo lo de Web Estratégica" },
  "cap.plan.2.f2": { en: "Additional conversion pages", es: "Páginas de conversión adicionales" },
  "cap.plan.2.f3": { en: "CRM integrations and automation", es: "Integraciones CRM y automatización" },
  "cap.plan.2.f4": { en: "Automated capture flows", es: "Flujos de captación automatizados" },
  "cap.plan.2.f5": { en: "Advanced forms + qualification", es: "Formularios avanzados + calificación" },
  "cap.plan.2.f6": { en: "Lead tracking and nurturing", es: "Seguimiento y nurturing de leads" },
  "cap.plan.2.note": { en: "For businesses that already sell and need a system to scale their results.", es: "Para negocios que ya venden y necesitan un sistema que escale sus resultados." },
  "cap.plan.3.name": { en: "Complete Ecosystem", es: "Ecosistema Completo" },
  "cap.plan.3.desc": { en: "Complete digital architecture to operate, scale, and grow without structural limits.", es: "Arquitectura digital completa para operar, escalar y crecer sin límite de estructura." },
  "cap.plan.3.f1": { en: "End-to-end digital architecture", es: "Arquitectura digital end-to-end" },
  "cap.plan.3.f2": { en: "CRM and connected processes", es: "CRM y procesos conectados" },
  "cap.plan.3.f3": { en: "Advanced automations", es: "Automatizaciones avanzadas" },
  "cap.plan.3.f4": { en: "Internal operational flows", es: "Flujos operativos internos" },
  "cap.plan.3.f5": { en: "Custom integrations", es: "Integraciones a medida" },
  "cap.plan.3.f6": { en: "Infrastructure designed to scale", es: "Infraestructura pensada para escalar" },
  "cap.plan.3.note": { en: "For companies that need solid infrastructure, not temporary solutions.", es: "Para empresas que necesitan infraestructura sólida, no soluciones temporales." },

  // WhatWeDo
  "wwd.label": { en: "Our Difference", es: "Nuestra diferencia" },
  "wwd.heading": { en: "We are not an agency. We design the infrastructure that makes your business sell.", es: "No somos una agencia. Diseñamos la infraestructura que hace que tu negocio venda." },
  "wwd.sub": { en: "Every decision points to a measurable commercial result. We don't execute tasks — we build systems that operate.", es: "Cada decisión apunta a un resultado comercial medible. No ejecutamos tareas — construimos sistemas que operan." },
  "wwd.card.1.title": { en: "Strategic positioning", es: "Posicionamiento estratégico" },
  "wwd.card.1.desc": { en: "We define the exact message that moves your ideal client to take action.", es: "Definimos el mensaje exacto que mueve a tu cliente ideal a tomar acción." },
  "wwd.card.2.title": { en: "Premium visual authority", es: "Autoridad visual premium" },
  "wwd.card.2.desc": { en: "Design that justifies your price before the client reads a word.", es: "Diseño que justifica tu precio antes de que el cliente lea una palabra." },
  "wwd.card.3.title": { en: "Conversion architecture", es: "Arquitectura de conversión" },
  "wwd.card.3.desc": { en: "Every element has a commercial purpose. Nothing is decorative.", es: "Cada elemento tiene un propósito comercial. Nada es decorativo." },
  "wwd.card.4.title": { en: "Active acquisition systems", es: "Sistemas de captación activa" },
  "wwd.card.4.desc": { en: "Infrastructure that continuously generates and qualifies prospects.", es: "Infraestructura que genera y califica prospectos de forma continua." },

  // Marquee
  "marquee.1": { en: "The problem is not having a digital presence.", es: "El problema no es tener presencia digital." },
  "marquee.2": { en: "It's not having a system that sells.", es: "Es no tener un sistema que venda." },

  // Process galaxy
  "proc.galaxy.label": { en: "Methodology", es: "Metodología" },
  "proc.galaxy.heading.1": { en: "One method.", es: "Un método." },
  "proc.galaxy.heading.2": { en: "No improvisation.", es: "Sin improvisación." },
  "proc.galaxy.sub": { en: "Four structured phases. Each week has a deliverable. Every decision has a measurable impact on your business.", es: "Cuatro fases estructuradas. Cada semana tiene un entregable. Cada decisión tiene un impacto medible en tu negocio." },
  "proc.galaxy.heading.mobile": { en: "One method. No improvisation.", es: "Un método. Sin improvisación." },
  "proc.galaxy.sub.mobile": { en: "Four phases. Each deliverable, on time.", es: "Cuatro fases. Cada entregable, en tiempo." },
  "proc.step.1.week": { en: "Week 1", es: "Semana 1" },
  "proc.step.1.title": { en: "Strategic Diagnosis", es: "Diagnóstico estratégico" },
  "proc.step.1.desc": { en: "We prevent you from making costly decisions without strategic clarity.", es: "Evitamos que tomes decisiones costosas sin claridad estratégica." },
  "proc.step.2.week": { en: "Week 2", es: "Semana 2" },
  "proc.step.2.title": { en: "Narrative Definition", es: "Definición narrativa" },
  "proc.step.2.desc": { en: "We define the message that truly connects and positions your brand.", es: "Definimos el mensaje que realmente conecta y posiciona tu marca." },
  "proc.step.3.week": { en: "Week 3–4", es: "Semana 3–4" },
  "proc.step.3.title": { en: "Conversion Architecture", es: "Arquitectura de conversión" },
  "proc.step.3.desc": { en: "We build a structure that guides the user towards action.", es: "Construimos una estructura que guía al usuario hacia la acción." },
  "proc.step.4.week": { en: "Week 5–6", es: "Semana 5–6" },
  "proc.step.4.title": { en: "Digital Implementation", es: "Implementación digital" },
  "proc.step.4.desc": { en: "We implement a system ready to operate and scale.", es: "Implementamos un sistema listo para operar y escalar." },

  // Clients
  "clients.label": { en: "Trust", es: "Confianza" },
  "clients.heading": { en: "Companies that trusted us to grow with structure, not intuition.", es: "Empresas que confiaron en nosotros para crecer con estructura, no con intuición." },
  "clients.sub": { en: "We don't show logos. We show relationships built on direction, system, and execution.", es: "No mostramos logos. Mostramos relaciones construidas sobre dirección, sistema y ejecución." },
  "clients.status": { en: "10 connected units", es: "10 unidades conectadas" },
  "clients.sys": { en: "sys: active", es: "sys: activo" },

  // Engagement fit
  "eng.fit.label": { en: "Project Fit", es: "Fit del proyecto" },
  "eng.fit.heading": { en: "Who it's right for.", es: "Para quién sí tiene sentido." },
  "eng.fit.ideal": { en: "Ideal for", es: "Ideal para" },
  "eng.fit.not": { en: "Not for", es: "No es para" },
  "eng.fit.ideal.1": { en: "Businesses that sell services or high-ticket items and need a system to support them.", es: "Negocios que venden servicios o tickets altos y necesitan un sistema que los soporte." },
  "eng.fit.ideal.2": { en: "Brands that already invest in marketing but aren't seeing the results they expected.", es: "Marcas que ya invierten en marketing pero no ven los resultados que esperaban." },
  "eng.fit.ideal.3": { en: "Teams that need message clarity, more authority, and better leads.", es: "Equipos que necesitan claridad de mensaje, más autoridad y mejores leads." },
  "eng.fit.ideal.4": { en: "Companies that value strategy, design, and execution as one thing.", es: "Empresas que valoran la estrategia, el diseño y la ejecución como una sola cosa." },
  "eng.fit.not.1": { en: "Early-stage businesses without a validated business model.", es: "Negocios en etapa inicial sin modelo de negocio validado." },
  "eng.fit.not.2": { en: "Those looking for quick, cheap, or low-commitment solutions.", es: "Quienes buscan soluciones rápidas, económicas o de bajo compromiso." },
  "eng.fit.not.3": { en: "Those who need a presence without a defined commercial objective.", es: "Quienes necesitan presencia sin objetivo comercial definido." },
  "eng.fit.not.4": { en: "Those not ready to invest in serious architecture.", es: "Quienes no están listos para invertir en arquitectura seria." },

  // Contact eval form
  "contact.eval.label": { en: "Strategic Evaluation", es: "Evaluación Estratégica" },
  "contact.eval.heading": { en: "Application for strategic evaluation.", es: "Aplicación para evaluación estratégica." },
  "contact.eval.sub": { en: "Our team will review your case and contact you if there is a strategic fit.", es: "Nuestro equipo revisará tu caso y te contactará si hay ajuste estratégico." },
  "contact.eval.channel": { en: "Active secure channel", es: "Canal seguro activo" },
  "contact.eval.location": { en: "San Diego, California · USA", es: "San Diego, California · EE.UU." },
  "contact.eval.success.received": { en: "DATA RECEIVED", es: "DATOS RECIBIDOS" },
  "contact.eval.success.processing": { en: "PROCESSING DIAGNOSIS...", es: "PROCESANDO DIAGNÓSTICO..." },
  "contact.eval.success.reply": { en: "We will respond within the next 24 hours", es: "Responderemos dentro de las próximas 24 horas" },
  "contact.eval.error": { en: "Error sending. Please try again.", es: "Error al enviar. Intenta de nuevo." },
  "contact.eval.submit.loading": { en: "PROCESSING", es: "PROCESANDO" },
  "contact.eval.submit": { en: "REQUEST STRATEGIC DIAGNOSIS", es: "SOLICITAR DIAGNÓSTICO ESTRATÉGICO" },
  "contact.eval.f1": { en: "Full name", es: "Nombre completo" },
  "contact.eval.f2": { en: "Corporate email", es: "Email corporativo" },
  "contact.eval.f3": { en: "Company", es: "Empresa" },
  "contact.eval.f4": { en: "Approximate annual revenue", es: "Revenue anual aproximado" },
  "contact.eval.f5": { en: "What do you want to solve?", es: "¿Qué quieres resolver?" },
  "contact.eval.b1": { en: "Under $500K USD", es: "Menos de $500K USD" },
  "contact.eval.b2": { en: "$500K – $2M USD", es: "$500K – $2M USD" },
  "contact.eval.b3": { en: "$2M – $10M USD", es: "$2M – $10M USD" },
  "contact.eval.b4": { en: "$10M – $50M USD", es: "$10M – $50M USD" },
  "contact.eval.b5": { en: "$50M+ USD", es: "$50M+ USD" },

  // Disqualification
  "disq.label": { en: "Selection", es: "Selección" },
  "disq.heading": { en: "If you're ready to operate at another level.", es: "Si estás listo para operar a otro nivel." },
  "disq.line.1": { en: "We don't execute projects without a clear strategy.", es: "No ejecutamos proyectos sin estrategia clara." },
  "disq.line.2": { en: "We don't sell decorative design or empty presence.", es: "No vendemos diseño decorativo ni presencia vacía." },
  "disq.line.3": { en: "We work with companies that want to build something that works — not just something that looks good.", es: "Trabajamos con empresas que quieren construir algo que funciona — no algo que solo se ve bien." },

  // Footer
  "footer.brand": { en: "Acquisition, conversion, and scaling systems for companies operating at a high level. We don't execute tasks — we build infrastructure that sells.", es: "Sistemas de captación, conversión y escalamiento para empresas que operan a alto nivel. No ejecutamos tareas — construimos infraestructura que vende." },
  "footer.status": { en: "System operational", es: "Sistema operativo" },
  "footer.nav.label": { en: "Navigation", es: "Navegación" },
  "footer.nav.1": { en: "Solutions", es: "Capacidades" },
  "footer.nav.2": { en: "Process", es: "Proceso" },
  "footer.nav.3": { en: "Clients", es: "Clientes" },
  "footer.nav.4": { en: "Fit", es: "Fit" },
  "footer.nav.5": { en: "Contact", es: "Contacto" },
  "footer.services.label": { en: "Services", es: "Servicios" },
  "footer.services.1": { en: "Digital ecosystems with AI", es: "Ecosistemas digitales con IA" },
  "footer.services.2": { en: "Conversion architecture", es: "Arquitectura de conversión" },
  "footer.services.3": { en: "Operations automation", es: "Automatización de operaciones" },
  "footer.services.4": { en: "Brand strategy and narrative", es: "Estrategia y narrativa de marca" },
  "footer.services.5": { en: "Implementation and scaling", es: "Implementación y escalamiento" },
  "footer.services.6": { en: "Premium web design", es: "Diseño web Premium" },
  "footer.contact.label": { en: "Contact", es: "Contacto" },
  "footer.contact.city": { en: "San Diego, California · USA", es: "San Diego, California · EE.UU." },
  "footer.contact.cta": { en: "Schedule strategy", es: "Agendar estrategia" },
  "footer.legal.privacy": { en: "Privacy", es: "Privacidad" },
  "footer.legal.terms": { en: "Terms", es: "Términos" },
  "footer.legal.cookies": { en: "Cookies", es: "Cookies" },
  "footer.copyright": { en: "© 2026 iKingdom. All rights reserved.", es: "© 2026 iKingdom. Todos los derechos reservados." },
};

interface LangCtx { lang: Lang; toggle: () => void; t: (k: string) => string }

const Ctx = createContext<LangCtx>({ lang: "es", toggle: () => {}, t: (k) => k });

export function LangProvider({ children, initialLang = "es" }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const toggle = useCallback(() => setLang((l) => (l === "en" ? "es" : "en")), []);
  const t = useCallback((k: string) => T[k]?.[lang] ?? k, [lang]);
  return <Ctx.Provider value={{ lang, toggle, t }}>{children}</Ctx.Provider>;
}

export function useLang() { return useContext(Ctx); }
