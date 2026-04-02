import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de Servicio",
  description: "Términos y condiciones de uso de los servicios de iKingdom.",
  alternates: { canonical: "https://www.ikingdom.org/terms-of-service" },
  robots: { index: false, follow: false },
};

export default function TermsOfService() {
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
            Términos de Servicio
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
              1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder y utilizar este sitio web, aceptas quedar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguna de las condiciones aquí establecidas, te pedimos que no utilices este sitio.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              2. Descripción de los Servicios
            </h2>
            <p>
              iKingdom ofrece servicios de arquitectura de ecosistemas digitales, incluyendo estrategia, diseño, desarrollo e implementación de plataformas digitales y sistemas con inteligencia artificial. Los servicios específicos, alcance, entregables y condiciones económicas se establecen en propuestas y acuerdos contractuales individuales.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              3. Uso del Sitio Web
            </h2>
            <p className="mb-4">Al utilizar este sitio, te comprometes a:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Proporcionar información veraz y actualizada en los formularios de contacto",
                "No utilizar el sitio con fines ilegales o no autorizados",
                "No intentar interferir con el funcionamiento del sitio o sus sistemas",
                "No reproducir, distribuir ni explotar el contenido del sitio sin autorización expresa",
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
              4. Propiedad Intelectual
            </h2>
            <p>
              Todo el contenido de este sitio — incluyendo textos, diseños, gráficos, logotipos, código e interfaces — es propiedad de iKingdom o sus licenciantes y está protegido por las leyes de propiedad intelectual aplicables. Queda prohibida su reproducción total o parcial sin autorización escrita previa.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              5. Solicitudes y Proceso de Consulta
            </h2>
            <p>
              El envío del formulario de solicitud no constituye un acuerdo contractual ni garantiza la prestación de servicios. iKingdom se reserva el derecho de aceptar o rechazar cualquier solicitud a su discreción. Toda propuesta de servicios requiere la firma de un acuerdo por escrito separado.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              6. Confidencialidad
            </h2>
            <p>
              Toda información que compartas durante el proceso de consulta será tratada con estricta confidencialidad. iKingdom no divulgará detalles específicos de clientes ni proyectos sin autorización expresa. Para proyectos activos, se formaliza un acuerdo de confidencialidad (NDA) antes del inicio del trabajo.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              7. Limitación de Responsabilidad
            </h2>
            <p>
              Este sitio web y su contenido se proporcionan "tal como están", sin garantías de ningún tipo, expresas o implícitas. iKingdom no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso de este sitio. Los resultados descritos en el sitio son representativos de trabajos pasados y no constituyen una garantía de resultados futuros.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              8. Enlaces a Terceros
            </h2>
            <p>
              Este sitio puede contener enlaces a sitios de terceros. iKingdom no tiene control sobre dichos sitios y no asume responsabilidad por su contenido, políticas de privacidad o prácticas.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              9. Modificaciones
            </h2>
            <p>
              iKingdom se reserva el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en esta página. El uso continuado del sitio tras cualquier cambio implica la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4AF37] text-[16px] font-semibold tracking-[-0.02em] mb-4">
              10. Ley Aplicable
            </h2>
            <p>
              Estos Términos se rigen por las leyes aplicables en la jurisdicción donde opera iKingdom. Cualquier disputa derivada del uso de este sitio o de los servicios de iKingdom se resolverá en primer lugar mediante negociación de buena fe entre las partes.
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
