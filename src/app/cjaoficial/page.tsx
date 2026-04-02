import type { Metadata } from "next";
import BriefForm from "./BriefForm";
import styles from "./brief.module.css";

export const metadata: Metadata = {
  title: "Brief CJA Oficial",
  description:
    "Formulario de brief estratégico para proyectos CJA Oficial con iKingdom.",
  robots: { index: false, follow: false },
};

export default function CjaOficialBriefPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <p className={styles.kicker}>iKingdom × CJA Oficial</p>
        <h1 className={styles.title}>Brief estratégico</h1>
        <p className={styles.subtitle}>
          Completá el formulario con el máximo detalle posible. Toda la información es confidencial
          y nos permite preparar una propuesta alineada a tu negocio.
        </p>
        <BriefForm />
      </div>
    </div>
  );
}
