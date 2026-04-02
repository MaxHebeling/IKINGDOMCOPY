"use client";

import { useState } from "react";
import styles from "./brief.module.css";

const TRAFFIC_OPTIONS = [
  "Meta / Instagram",
  "Google Ads",
  "Orgánico / SEO",
  "Email",
  "Referidos",
  "Otro",
] as const;

export default function BriefForm() {
  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [cityCountry, setCityCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [problemSolved, setProblemSolved] = useState("");
  const [differentiator, setDifferentiator] = useState("");
  const [whyChooseYou, setWhyChooseYou] = useState("");
  const [mainServices, setMainServices] = useState("");
  const [keyService, setKeyService] = useState("");
  const [idealClient, setIdealClient] = useState("");
  const [notIdealClient, setNotIdealClient] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [clientsServed, setClientsServed] = useState("");
  const [testimonials, setTestimonials] = useState("");
  const [landingObjective, setLandingObjective] = useState("");
  const [trafficStrategy, setTrafficStrategy] = useState<string[]>([]);
  const [designStyle, setDesignStyle] = useState("");
  const [mainOffer, setMainOffer] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function toggleTraffic(opt: string) {
    setTrafficStrategy((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!consent) {
      setError("Debés aceptar el tratamiento de datos para continuar.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cjaoficial-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          tagline,
          cityCountry,
          website,
          socialMedia,
          email,
          phone,
          address,
          problemSolved,
          differentiator,
          whyChooseYou,
          mainServices,
          keyService,
          idealClient,
          notIdealClient,
          yearsExperience,
          clientsServed,
          testimonials,
          landingObjective,
          trafficStrategy: trafficStrategy.length ? trafficStrategy : undefined,
          designStyle,
          mainOffer,
          generatedPrompt,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "No se pudo enviar. Intentá de nuevo.");
        return;
      }
      setDone(true);
    } catch {
      setError("Error de red. Revisá tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className={styles.success} role="status">
        <p className={styles.successTitle}>Brief recibido</p>
        <p style={{ margin: 0 }}>
          Gracias. El equipo revisará tu información y se pondrá en contacto por los medios que
          indicaste.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <section className={styles.section} aria-labelledby="sec-contact">
        <h2 id="sec-contact" className={styles.sectionTitle}>
          01 · Contacto y empresa
        </h2>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`} htmlFor="companyName">
              Empresa / razón social
            </label>
            <input
              id="companyName"
              className={styles.input}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              autoComplete="organization"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="tagline">
              Tagline o eslogan
            </label>
            <input
              id="tagline"
              className={styles.input}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`} htmlFor="phone">
              Teléfono / WhatsApp
            </label>
            <input
              id="phone"
              type="tel"
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="cityCountry">
              Ciudad y país
            </label>
            <input
              id="cityCountry"
              className={styles.input}
              value={cityCountry}
              onChange={(e) => setCityCountry(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="website">
              Sitio web
            </label>
            <input
              id="website"
              className={styles.input}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://"
              autoComplete="url"
            />
          </div>
        </div>
        <div className={styles.field} style={{ marginTop: 14 }}>
          <label className={styles.label} htmlFor="socialMedia">
            Redes sociales
          </label>
          <input
            id="socialMedia"
            className={styles.input}
            value={socialMedia}
            onChange={(e) => setSocialMedia(e.target.value)}
            placeholder="@cuentas o enlaces"
          />
        </div>
        <div className={styles.field} style={{ marginTop: 14 }}>
          <label className={styles.label} htmlFor="address">
            Dirección (opcional)
          </label>
          <input
            id="address"
            className={styles.input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sec-offer">
        <h2 id="sec-offer" className={styles.sectionTitle}>
          02 · Oferta y diferenciación
        </h2>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="problemSolved">
            ¿Qué problema resolvés para tu cliente?
          </label>
          <textarea
            id="problemSolved"
            className={styles.textarea}
            value={problemSolved}
            onChange={(e) => setProblemSolved(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mainOffer">
            Oferta principal (producto/servicio estrella)
          </label>
          <textarea
            id="mainOffer"
            className={styles.textarea}
            value={mainOffer}
            onChange={(e) => setMainOffer(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="differentiator">
            ¿Qué te diferencia de la competencia?
          </label>
          <textarea
            id="differentiator"
            className={styles.textarea}
            value={differentiator}
            onChange={(e) => setDifferentiator(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="whyChooseYou">
            ¿Por qué te eligen tus mejores clientes?
          </label>
          <textarea
            id="whyChooseYou"
            className={styles.textarea}
            value={whyChooseYou}
            onChange={(e) => setWhyChooseYou(e.target.value)}
          />
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="mainServices">
              Servicios o líneas de negocio
            </label>
            <textarea
              id="mainServices"
              className={styles.textarea}
              style={{ minHeight: 88 }}
              value={mainServices}
              onChange={(e) => setMainServices(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="keyService">
              Servicio clave para esta campaña
            </label>
            <input
              id="keyService"
              className={styles.input}
              value={keyService}
              onChange={(e) => setKeyService(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sec-client">
        <h2 id="sec-client" className={styles.sectionTitle}>
          03 · Cliente y credibilidad
        </h2>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="idealClient">
              Cliente ideal
            </label>
            <textarea
              id="idealClient"
              className={styles.textarea}
              style={{ minHeight: 88 }}
              value={idealClient}
              onChange={(e) => setIdealClient(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="notIdealClient">
              Cliente que no querés atraer
            </label>
            <textarea
              id="notIdealClient"
              className={styles.textarea}
              style={{ minHeight: 88 }}
              value={notIdealClient}
              onChange={(e) => setNotIdealClient(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="yearsExperience">
              Años en el mercado
            </label>
            <input
              id="yearsExperience"
              className={styles.input}
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="clientsServed">
              Clientes atendidos (orden de magnitud)
            </label>
            <input
              id="clientsServed"
              className={styles.input}
              value={clientsServed}
              onChange={(e) => setClientsServed(e.target.value)}
              placeholder="ej. 50+, 500 empresas"
            />
          </div>
        </div>
        <div className={styles.field} style={{ marginTop: 14 }}>
          <label className={styles.label} htmlFor="testimonials">
            Testimonios o casos (texto o links)
          </label>
          <textarea
            id="testimonials"
            className={styles.textarea}
            value={testimonials}
            onChange={(e) => setTestimonials(e.target.value)}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sec-land">
        <h2 id="sec-land" className={styles.sectionTitle}>
          04 · Landing y tráfico
        </h2>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="landingObjective">
            Objetivo principal de la landing
          </label>
          <textarea
            id="landingObjective"
            className={styles.textarea}
            value={landingObjective}
            onChange={(e) => setLandingObjective(e.target.value)}
            placeholder="Leads, ventas, reservas, descarga, etc."
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Estrategia de tráfico prevista</span>
          <div className={styles.checkRow}>
            {TRAFFIC_OPTIONS.map((opt) => (
              <label key={opt} className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={trafficStrategy.includes(opt)}
                  onChange={() => toggleTraffic(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="designStyle">
            Estilo visual deseado
          </label>
          <textarea
            id="designStyle"
            className={styles.textarea}
            value={designStyle}
            onChange={(e) => setDesignStyle(e.target.value)}
            placeholder="Referencias, colores, sensación (minimal, premium, corporativo…)"
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sec-extra">
        <h2 id="sec-extra" className={styles.sectionTitle}>
          05 · Contexto adicional
        </h2>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="generatedPrompt">
            Notas libres o brief extendido
          </label>
          <textarea
            id="generatedPrompt"
            className={styles.textarea}
            style={{ minHeight: 120 }}
            value={generatedPrompt}
            onChange={(e) => setGeneratedPrompt(e.target.value)}
          />
          <p className={styles.hint}>
            Podés pegar aquí cualquier texto de contexto que quieras que el equipo tenga en cuenta.
          </p>
        </div>
        <label className={styles.consent}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            Acepto que mis datos se usen para contactarme en relación a este brief, conforme a la
            política de privacidad de iKingdom.
          </span>
        </label>
      </section>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? "Enviando…" : "Enviar brief"}
        </button>
      </div>
    </form>
  );
}
