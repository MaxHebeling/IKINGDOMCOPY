import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad y tratamiento de datos personales de iKingdom.",
  alternates: { canonical: "https://www.ikingdom.org/privacy-policy" },
  robots: { index: false, follow: false },
};

export default function PrivacyPolicy() {
  return (
    <main
      className="min-h-screen bg-[#000000] px-8 py-24"
      style={{ fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif' }}
    >
      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-[760px] mx-auto">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="h-px w-6 bg-[#C9A85C]/50" />
            <span className="text-[11px] font-medium uppercase tracking-[0.38em] text-[#C9A85C]">
              Legal
            </span>
            <span className="h-px w-6 bg-[#C9A85C]/50" />
          </div>
          <h1
            className="text-[#D4AF37] mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em", lineHeight: 1.1, fontWeight: 600 }}
          >
            Política de Privacidad
          </h1>
          <p className="text-[#6B5820] text-[13px] tracking-[0.05em]">
            Última actualización: marzo 2026
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#1C1A10] mb-14" />

        {/* Content */}
        <div className="space-y-12 text-[15px] leading-[1.9] text-[#8A8070] font-light">

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              1. Responsable del Tratamiento
            </h2>
            <p>
              iKingdom (en adelante, "la Empresa", "nosotros" o "nuestro") es responsable del tratamiento de los datos personales que se recopilan a través de este sitio web y sus formularios de contacto.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              2. Datos que Recopilamos
            </h2>
            <p className="mb-4">Recopilamos la siguiente información cuando completas nuestro formulario de solicitud:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Nombre completo",
                "Nombre de la organización",
                "Sitio web o perfil de LinkedIn",
                "Rango de revenue anual",
                "Descripción de tus necesidades actuales",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#C9A85C]/40 flex-shrink-0 mt-[10px]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              También podemos recopilar automáticamente información técnica como dirección IP, tipo de navegador, páginas visitadas y parámetros de campaña (UTM, gclid, fbclid) con fines analíticos y de atribución publicitaria.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              3. Finalidad del Tratamiento
            </h2>
            <p className="mb-4">Utilizamos tus datos para:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Evaluar tu solicitud de consulta y determinar si existe un fit estratégico",
                "Contactarte para continuar la conversación",
                "Mejorar nuestros servicios y comunicaciones",
                "Cumplir con obligaciones legales aplicables",
                "Medir el rendimiento de nuestras campañas publicitarias (únicamente con tu consentimiento explícito, otorgado a través del banner de cookies)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#C9A85C]/40 flex-shrink-0 mt-[10px]" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              4. Base Legal
            </h2>
            <p>
              El tratamiento de tus datos se basa en el consentimiento que otorgas al completar y enviar el formulario de solicitud, así como en el interés legítimo de la Empresa para gestionar solicitudes comerciales entrantes.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              5. Cookies y Tecnologías de Seguimiento
            </h2>
            <p className="mb-4">
              Este sitio utiliza cookies y tecnologías similares para:
            </p>
            <ul className="space-y-2 pl-4 mb-4">
              {[
                "Analítica web (Google Analytics)",
                "Seguimiento de conversiones publicitarias (Google Ads, Meta Ads)",
                "Personalización de experiencia",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#C9A85C]/40 flex-shrink-0 mt-[10px]" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Puedes configurar tu navegador para rechazar cookies. Ten en cuenta que algunas funcionalidades del sitio pueden verse afectadas.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              6. Compartición de Datos
            </h2>
            <p>
              No vendemos ni alquilamos tus datos personales a terceros. Podemos compartir información con proveedores de servicios de confianza (herramientas CRM, plataformas de email) únicamente en la medida necesaria para operar nuestros servicios, bajo acuerdos de confidencialidad.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              7. Retención de Datos
            </h2>
            <p>
              Conservamos tus datos durante el tiempo necesario para los fines descritos o según lo exija la ley aplicable. Las solicitudes que no resulten en una alianza activa se eliminan tras 24 meses.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              8. Tus Derechos
            </h2>
            <p className="mb-4">Tienes derecho a:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Acceder a los datos personales que conservamos sobre ti",
                "Solicitar la rectificación de datos inexactos",
                "Solicitar la eliminación de tus datos",
                "Oponerte al tratamiento de tus datos",
                "Solicitar la portabilidad de tus datos",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#C9A85C]/40 flex-shrink-0 mt-[10px]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Para ejercer cualquiera de estos derechos, contáctanos a través de nuestro formulario de contacto.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              9. Seguridad
            </h2>
            <p>
              Implementamos medidas técnicas y organizativas razonables para proteger tus datos contra acceso no autorizado, pérdida o destrucción. La transmisión de datos a través de nuestro sitio se realiza mediante conexiones cifradas (HTTPS).
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              10. Cambios a Esta Política
            </h2>
            <p>
              Nos reservamos el derecho de actualizar esta política en cualquier momento. Las modificaciones se publicarán en esta página con la fecha de actualización revisada. El uso continuado del sitio tras cualquier cambio constituye tu aceptación de la política modificada.
            </p>
          </section>

        </div>

        {/* Divider */}
        <div className="h-px bg-[#1C1A10] mt-16 mb-10" />

        {/* Back link */}
        <Link
          href="/"
          className="text-[12px] tracking-[0.2em] uppercase text-[#6B5820] hover:text-[#D4AF37] transition-colors duration-300 font-medium"
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
