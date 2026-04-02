"use client";

import { useState, useRef } from "react";
import styles from "../../cjaoficial/brief.module.css";

// ─── REEMPLAZÁ ESTO con tu form ID de Formspree ──────────────────────────────
// 1. Creá cuenta gratis en https://formspree.io
// 2. New form → copiás el ID (ej: "xpwzgkdo")
// 3. Pegalo aquí abajo
const FORMSPREE_ID = "TU_FORM_ID_ACÁ";
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

type FormData = {
  // S1
  nombre: string;
  ciudad: string;
  anio: string;
  division: string;
  web: string;
  deportes: string;
  // S2
  contacto: string;
  cargo: string;
  email: string;
  whatsapp: string;
  como: string;
  // S3
  presencia: string[];
  socios: string;
  tienda: string;
  nivelDigital: string;
  // S4
  objetivos: string[];
  budget: string;
  tiempo: string;
  // S5
  desafio: string;
  proyecto: string;
  referente: string;
  extra: string;
};

const initialData: FormData = {
  nombre: "", ciudad: "", anio: "", division: "", web: "", deportes: "",
  contacto: "", cargo: "", email: "", whatsapp: "", como: "",
  presencia: [], socios: "", tienda: "", nivelDigital: "",
  objetivos: [], budget: "", tiempo: "",
  desafio: "", proyecto: "", referente: "", extra: "",
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function RadioGroup({
  name, options, value, onChange,
}: {
  name: keyof FormData;
  options: { label: string; value: string; desc?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.radioGroup}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`${styles.radioItem} ${value === opt.value ? styles.selected : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <div>
            <div className={styles.riLabel}>{opt.label}</div>
            {opt.desc && <div className={styles.riDesc}>{opt.desc}</div>}
          </div>
        </label>
      ))}
    </div>
  );
}

function CheckGroup({
  options, values, onChange,
}: {
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]
    );
  };
  return (
    <div className={styles.checkGroup}>
      {options.map((opt) => (
        <label
          key={opt}
          className={`${styles.checkItem} ${values.includes(opt) ? styles.selected : ""}`}
        >
          <input
            type="checkbox"
            checked={values.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <div className={styles.ciLabel}>{opt}</div>
        </label>
      ))}
    </div>
  );
}

function TagGroup({
  options, values, max, onChange,
}: {
  options: string[];
  values: string[];
  max: number;
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt));
    } else if (values.length < max) {
      onChange([...values, opt]);
    }
  };
  return (
    <div className={styles.tagGroup}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`${styles.tag} ${values.includes(opt) ? styles.sel : ""}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ScaleSelector({
  value, onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      <div className={styles.scaleRow}>
        {["1", "2", "3", "4", "5"].map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.scaleBtn} ${value === n ? styles.sel : ""}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className={styles.scaleLabels}>
        <span>Muy débil</span>
        <span>Muy fuerte</span>
      </div>
    </>
  );
}

function ProgressBar({ step }: { step: number }) {
  const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressLabel}>Paso {step} de {TOTAL_STEPS}</div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.dots}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i + 1 === step ? styles.dotActive : i + 1 < step ? styles.dotDone : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function BriefForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const topRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof FormData, val: string | string[]) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const scrollTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const validate = (): boolean => {
    const alerts: Record<number, () => boolean> = {
      1: () => !!(data.nombre && data.ciudad && data.division),
      2: () => !!(data.contacto && data.cargo && data.email && data.whatsapp),
      4: () => !!data.budget,
      5: () => !!data.desafio,
    };
    const check = alerts[step];
    if (check && !check()) {
      alert("Por favor completá los campos obligatorios antes de continuar.");
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    scrollTop();
  };

  const prev = () => {
    setStep((s) => Math.max(s - 1, 1));
    scrollTop();
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus("sending");

    // Flatten arrays to comma-separated strings for Formspree
    const payload = {
      ...data,
      presencia: data.presencia.join(", "),
      objetivos: data.objetivos.join(", "),
      _subject: `Brief iKingdom · ${data.nombre} · ${data.contacto}`,
    };

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        scrollTop();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // ── SUCCESS ──────────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <main className={styles.wrap}>
        <HeroSection />
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Brief recibido</h2>
          <p className={styles.successDesc}>
            Gracias <strong>{data.contacto}</strong>. El equipo de iKingdom va a revisar
            tu información y te contactará dentro de las próximas{" "}
            <strong>48 horas hábiles</strong> con un diagnóstico personalizado y una
            propuesta concreta para <strong>{data.nombre}</strong>.
          </p>
          <div className={styles.successBadge}>iKingdom · Digital Strategy</div>
        </div>
      </main>
    );
  }

  // ── FORM ─────────────────────────────────────────────────────────────────────
  return (
    <main className={styles.wrap} ref={topRef}>
      <Header />
      <ProgressBar step={step} />

      <form onSubmit={(e) => e.preventDefault()}>
        {/* ── STEP 1 ── */}
        {step === 1 && (
          <section>
            <StepHeader
              eyebrow="Sección 01"
              title="Datos del club"
              desc="Información institucional básica para personalizar el diagnóstico."
            />
            <p className={styles.requiredNote}>
              Los campos con <span className={styles.req}>*</span> son obligatorios.
            </p>
            <div className={styles.fieldRow}>
              <Field label="Nombre del club" required>
                <input
                  type="text"
                  value={data.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  placeholder="Ej: Centro Juventud Antoniana"
                />
              </Field>
              <Field label="Ciudad / Provincia" required>
                <input
                  type="text"
                  value={data.ciudad}
                  onChange={(e) => set("ciudad", e.target.value)}
                  placeholder="Ej: Salta, Salta"
                />
              </Field>
            </div>
            <div className={styles.fieldRow}>
              <Field label="Año de fundación">
                <input
                  type="text"
                  value={data.anio}
                  onChange={(e) => set("anio", e.target.value)}
                  placeholder="Ej: 1916"
                />
              </Field>
              <Field label="División actual" required>
                <select
                  value={data.division}
                  onChange={(e) => set("division", e.target.value)}
                >
                  <option value="">Seleccioná...</option>
                  {["Primera División (AFA)", "Primera Nacional", "Federal A", "Federal Amateur", "Liga regional", "Otro"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Sitio web actual" hint="(si existe)">
              <input
                type="url"
                value={data.web}
                onChange={(e) => set("web", e.target.value)}
                placeholder="https://"
              />
            </Field>
            <Field label="¿Qué otros deportes practica el club?" hint="(además de fútbol)">
              <input
                type="text"
                value={data.deportes}
                onChange={(e) => set("deportes", e.target.value)}
                placeholder="Ej: vóley, hockey, futsal..."
              />
            </Field>
          </section>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <section>
            <StepHeader
              eyebrow="Sección 02"
              title="Contacto responsable"
              desc="¿Con quién coordinamos? Puede ser el presidente, secretario o encargado de comunicación."
            />
            <div className={styles.fieldRow}>
              <Field label="Nombre y apellido" required>
                <input
                  type="text"
                  value={data.contacto}
                  onChange={(e) => set("contacto", e.target.value)}
                />
              </Field>
              <Field label="Cargo en el club" required>
                <input
                  type="text"
                  value={data.cargo}
                  onChange={(e) => set("cargo", e.target.value)}
                  placeholder="Ej: Presidente, Secretario..."
                />
              </Field>
            </div>
            <div className={styles.fieldRow}>
              <Field label="Email" required>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="correo@club.com"
                />
              </Field>
              <Field label="WhatsApp" required>
                <input
                  type="tel"
                  value={data.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="+54 9 387 000-0000"
                />
              </Field>
            </div>
            <Field label="¿Cómo llegaste a iKingdom?" required>
              <RadioGroup
                name="como"
                value={data.como}
                onChange={(v) => set("como", v)}
                options={[
                  { label: "Instagram / Redes sociales", value: "Instagram" },
                  { label: "Recomendación de un conocido", value: "Recomendación" },
                  { label: "Búsqueda en Google", value: "Google" },
                  { label: "Otro", value: "Otro" },
                ]}
              />
            </Field>
          </section>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <section>
            <StepHeader
              eyebrow="Sección 03"
              title="Situación digital actual"
              desc="Queremos entender dónde estás hoy antes de plantear hacia dónde ir."
            />
            <Field label="¿Qué presencia digital tiene el club?" hint="(seleccioná todo lo que aplica)">
              <CheckGroup
                options={["Sitio web propio", "Facebook", "Instagram", "YouTube", "TikTok", "Sin presencia digital"]}
                values={data.presencia}
                onChange={(v) => set("presencia", v)}
              />
            </Field>
            <Field label="¿El club tiene sistema de socios online?">
              <RadioGroup
                name="socios"
                value={data.socios}
                onChange={(v) => set("socios", v)}
                options={[
                  { label: "Sí, funcionando", value: "Sí, funcionando" },
                  { label: "Sí pero incompleto / informal", value: "Parcial" },
                  { label: "No, es todo presencial", value: "No" },
                ]}
              />
            </Field>
            <Field label="¿El club vende indumentaria o merchandising online?">
              <RadioGroup
                name="tienda"
                value={data.tienda}
                onChange={(v) => set("tienda", v)}
                options={[
                  { label: "Sí, tenemos tienda propia", value: "Tienda propia" },
                  { label: "Sí, a través de terceros (MercadoLibre, etc.)", value: "Terceros" },
                  { label: "No vendemos online", value: "No" },
                ]}
              />
            </Field>
            <Field label="Del 1 al 5 ¿cómo calificás tu presencia digital hoy?">
              <ScaleSelector
                value={data.nivelDigital}
                onChange={(v) => set("nivelDigital", v)}
              />
            </Field>
          </section>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <section>
            <StepHeader
              eyebrow="Sección 04"
              title="Objetivos y prioridades"
              desc="¿Qué querés lograr? Esto define el foco de nuestra propuesta."
            />
            <Field label="¿Cuáles son tus objetivos principales?" hint="(elegí hasta 3)">
              <TagGroup
                max={3}
                values={data.objetivos}
                onChange={(v) => set("objetivos", v)}
                options={[
                  "Más socios",
                  "Tienda online propia",
                  "Mejor posicionamiento en Google",
                  "Atraer patrocinadores",
                  "Venta de entradas online",
                  "Rebranding / nueva imagen",
                  "Contenido y redes sociales",
                  "Automatización de comunicaciones",
                  "CRM de hinchas",
                ]}
              />
            </Field>
            <Field label="¿Cuál es tu presupuesto estimado?" required>
              <RadioGroup
                name="budget"
                value={data.budget}
                onChange={(v) => set("budget", v)}
                options={[
                  { label: "Hasta USD 500", value: "hasta-500" },
                  { label: "USD 500 – 1.500", value: "500-1500" },
                  { label: "USD 1.500 – 3.000", value: "1500-3000" },
                  { label: "Más de USD 3.000", value: "3000+" },
                  { label: "A definir según propuesta", value: "a-definir" },
                ]}
              />
            </Field>
            <Field label="¿En cuánto tiempo necesitás resultados?">
              <RadioGroup
                name="tiempo"
                value={data.tiempo}
                onChange={(v) => set("tiempo", v)}
                options={[
                  { label: "Lo antes posible (menos de 1 mes)", value: "1mes" },
                  { label: "En 1 a 3 meses", value: "3meses" },
                  { label: "En 3 a 6 meses", value: "6meses" },
                  { label: "Somos flexibles", value: "flexible" },
                ]}
              />
            </Field>
          </section>
        )}

        {/* ── STEP 5 ── */}
        {step === 5 && (
          <section>
            <StepHeader
              eyebrow="Sección 05"
              title="Contexto y detalles finales"
              desc="Esta sección es libre. Cuanto más nos contés, mejor personalizamos la propuesta."
            />
            <Field label="¿Cuál es el mayor desafío digital que enfrenta el club hoy?" required>
              <textarea
                value={data.desafio}
                maxLength={500}
                onChange={(e) => set("desafio", e.target.value)}
                placeholder="Describí el problema principal con tus propias palabras..."
              />
              <CharCount value={data.desafio} max={500} />
            </Field>
            <Field label="¿Hay un proyecto específico que querés encarar?" hint="(opcional)">
              <textarea
                value={data.proyecto}
                maxLength={500}
                onChange={(e) => set("proyecto", e.target.value)}
                placeholder="Ej: Queremos lanzar el carnet digital de socio antes del próximo torneo..."
              />
              <CharCount value={data.proyecto} max={500} />
            </Field>
            <Field label="¿Hay algún club o referente digital que admires?" hint="(opcional)">
              <input
                type="text"
                value={data.referente}
                onChange={(e) => set("referente", e.target.value)}
                placeholder="Ej: Racing, San Lorenzo, un club europeo..."
              />
            </Field>
            <Field label="¿Algo más que quieras agregar?" hint="(opcional)">
              <textarea
                value={data.extra}
                maxLength={300}
                style={{ minHeight: "80px" }}
                onChange={(e) => set("extra", e.target.value)}
                placeholder="Cualquier información adicional que consideres relevante..."
              />
              <CharCount value={data.extra} max={300} />
            </Field>
          </section>
        )}

        {/* ── NAVIGATION ── */}
        <div className={styles.nav}>
          {step > 1 && (
            <button type="button" className={`${styles.btn} ${styles.btnBack}`} onClick={prev}>
              ← Anterior
            </button>
          )}
          {step < TOTAL_STEPS && (
            <button type="button" className={`${styles.btn} ${styles.btnNext}`} onClick={next}>
              Siguiente →
            </button>
          )}
          {step === TOTAL_STEPS && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSubmit}`}
              onClick={handleSubmit}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Enviando..." : "Enviar brief →"}
            </button>
          )}
        </div>

        {status === "error" && (
          <p className={styles.errorMsg}>
            Hubo un error al enviar. Revisá tu conexión o escribinos directamente a{" "}
            <a href="mailto:hola@ikingdom.org">hola@ikingdom.org</a>
          </p>
        )}
      </form>
    </main>
  );
}

// ─── SMALL HELPERS ────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className={styles.hdr}>
      <div className={styles.brand}>
        <span className={styles.brandI}>i</span>
        <span className={styles.brandK}>K</span>
        <span className={styles.brandRest}>ingdom</span>
      </div>
      <p className={styles.hdrSub}>Digital Strategy &amp; Growth Consulting</p>
      <h1 className={styles.hdrTitle}>Brief de diagnóstico digital</h1>
      <p className={styles.hdrDesc}>
        Completá este formulario para que nuestro equipo entienda tu club, tu negocio y
        tus objetivos. Tarda menos de 8 minutos.
      </p>
    </header>
  );
}

function StepHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className={styles.stepHeader}>
      <p className={styles.stepEyebrow}>{eyebrow}</p>
      <h2 className={styles.stepTitle}>{title}</h2>
      <p className={styles.stepDesc}>{desc}</p>
    </div>
  );
}

function Field({
  label, required, hint, children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.req}> *</span>}
        {hint && <span className={styles.hint}> {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <p className={styles.charCount}>
      {value.length} / {max}
    </p>
  );
}
