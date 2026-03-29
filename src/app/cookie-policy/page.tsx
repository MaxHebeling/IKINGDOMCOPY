import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Cookies — iKingdom",
  description: "Política de cookies de iKingdom. Qué cookies utilizamos y cómo gestionarlas.",
};

const COOKIE_TYPES = [
  {
    name: "Cookies esenciales",
    required: true,
    desc: "Necesarias para el funcionamiento básico del sitio. No pueden desactivarse.",
    examples: "Sesión de navegación, preferencias de idioma.",
  },
  {
    name: "Cookies analíticas",
    required: false,
    desc: "Nos permiten entender cómo los visitantes interactúan con el sitio para mejorar la experiencia.",
    examples: "Google Analytics (_ga, _gid, _gat).",
  },
  {
    name: "Cookies de marketing",
    required: false,
    desc: "Utilizadas para mostrar anuncios relevantes y medir la efectividad de nuestras campañas publicitarias.",
    examples: "Meta Pixel (_fbp, _fbc), Google Ads (gclid).",
  },
  {
    name: "Cookies de funcionalidad",
    required: false,
    desc: "Permiten recordar tus preferencias para ofrecerte una experiencia más personalizada.",
    examples: "Preferencias de consentimiento, configuración visual.",
  },
];

const SECTIONS = [
  {
    title: "¿Qué son las cookies?",
    content: `Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo al visitarlos. Sirven para recordar información sobre tu visita, como tus preferencias de idioma o si ya has visitado el sitio anteriormente, lo que facilita tu próxima visita y hace el sitio más útil.`,
  },
  {
    title: "¿Cómo utilizamos las cookies?",
    content: `Utilizamos cookies propias y de terceros para analizar el tráfico de nuestro sitio, medir la efectividad de nuestras campañas de marketing digital, mejorar tu experiencia de navegación y personalizar el contenido que te mostramos. Nunca utilizamos cookies para recopilar información sensible ni para identificarte personalmente sin tu consentimiento.`,
  },
  {
    title: "Google Tag Manager y Google Analytics",
    content: `Nuestro sitio utiliza Google Tag Manager para gestionar etiquetas de seguimiento y Google Analytics para analizar el comportamiento de los visitantes. Estas herramientas nos permiten conocer cuántas personas visitan el sitio, qué páginas son más populares y cómo los usuarios llegan a nosotros. Google puede transferir esta información a terceros cuando así lo exija la legislación o cuando dichos terceros procesen la información en nombre de Google.`,
  },
  {
    title: "Meta Pixel",
    content: `Utilizamos el píxel de Meta (Facebook/Instagram) para medir la efectividad de nuestras campañas publicitarias en dichas plataformas, crear audiencias personalizadas y mostrar anuncios relevantes a usuarios que han visitado nuestro sitio. Puedes gestionar tus preferencias de publicidad en tu cuenta de Facebook en Configuración > Anuncios.`,
  },
  {
    title: "Cómo gestionar las cookies",
    content: `Puedes controlar y eliminar las cookies a través de la configuración de tu navegador. Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio. La mayoría de los navegadores te permiten: ver las cookies almacenadas y eliminarlas individualmente; bloquear cookies de terceros; bloquear cookies de sitios específicos; bloquear todas las cookies; o eliminar todas las cookies al cerrar el navegador.`,
  },
  {
    title: "Actualizaciones",
    content: `Esta Política de Cookies puede ser actualizada periódicamente para reflejar cambios en las cookies que utilizamos o por otras razones operativas, legales o reglamentarias. Te recomendamos revisar esta página regularmente para estar informado sobre el uso de cookies.`,
  },
];

export default function CookiePolicy() {
  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#D4AF37", fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      <nav style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", padding: "20px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <img src="/clients/Hebeling_Imperium.png" alt="iKingdom" style={{ height: "36px", width: "auto" }} />
          </Link>
          <Link href="/" style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(212,175,55,0.5)", textDecoration: "none" }}>
            ← Volver
          </Link>
        </div>
      </nav>

      <header style={{ maxWidth: "860px", margin: "0 auto", padding: "80px 32px 60px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(212,175,55,0.4)", marginBottom: "20px" }}>
          Legal · Cookies
        </p>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: "20px" }}>
          Política de Cookies
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(212,175,55,0.4)", fontWeight: 300, lineHeight: 1.7 }}>
          Última actualización: 28 de marzo de 2026
        </p>
        <div style={{ marginTop: "32px", height: "1px", background: "linear-gradient(90deg, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0) 100%)" }} />
      </header>

      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "0 32px 120px" }}>
        <p style={{ fontSize: "15px", color: "rgba(212,175,55,0.65)", fontWeight: 300, lineHeight: 1.82, marginBottom: "56px" }}>
          Esta Política de Cookies explica qué son las cookies, cómo las utilizamos en ikingdom.agency y cómo puedes gestionarlas. Al continuar navegando en nuestro sitio, aceptas el uso de cookies de acuerdo con esta política.
        </p>

        {/* Cookie types table */}
        <div style={{ marginBottom: "64px", display: "flex", flexDirection: "column", gap: "2px" }}>
          <p style={{ fontSize: "9px", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", marginBottom: "20px" }}>
            Tipos de cookies que utilizamos
          </p>
          {COOKIE_TYPES.map((c) => (
            <div key={c.name} style={{ padding: "20px 24px", border: "1px solid rgba(212,175,55,0.1)", background: "rgba(212,175,55,0.015)", marginBottom: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(212,175,55,0.88)" }}>{c.name}</span>
                <span style={{
                  fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "2px 8px",
                  border: `1px solid ${c.required ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.2)"}`,
                  color: c.required ? "rgba(212,175,55,0.8)" : "rgba(212,175,55,0.4)",
                }}>
                  {c.required ? "Requerida" : "Opcional"}
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(212,175,55,0.52)", fontWeight: 300, lineHeight: 1.65, marginBottom: "6px" }}>{c.desc}</p>
              <p style={{ fontSize: "11px", color: "rgba(212,175,55,0.32)", fontWeight: 300 }}>Ejemplos: {c.examples}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "14px", color: "rgba(212,175,55,0.9)" }}>
                {s.title}
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(212,175,55,0.55)", fontWeight: 300, lineHeight: 1.85, textAlign: "justify" }}>
                {s.content}
              </p>
            </section>
          ))}
        </div>

        {/* Browser links */}
        <div style={{ marginTop: "56px", padding: "32px 36px", border: "1px solid rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.02)" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", marginBottom: "16px" }}>
            Gestionar cookies en tu navegador
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
              { name: "Mozilla Firefox", url: "https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" },
              { name: "Safari", url: "https://support.apple.com/es-es/guide/safari/sfri11471/mac" },
              { name: "Microsoft Edge", url: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
            ].map((b) => (
              <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", color: "rgba(212,175,55,0.6)", fontWeight: 300, textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(212,175,55,0.4)", flexShrink: 0, display: "inline-block" }} />
                {b.name}
              </a>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid rgba(212,175,55,0.08)", padding: "24px 32px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "11px", color: "rgba(212,175,55,0.25)", fontWeight: 300 }}>© 2026 iKingdom. Todos los derechos reservados.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/privacy-policy" style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,55,0.3)", textDecoration: "none" }}>Privacidad</Link>
            <Link href="/terms-of-service" style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,55,0.3)", textDecoration: "none" }}>Términos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
