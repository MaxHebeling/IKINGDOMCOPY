import type { Metadata } from "next";
import { locales } from "@/i18n/config";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang !== "en";
  const BASE = "https://www.ikingdom.org";

  return {
    title: isEs ? "Diagnóstico Estratégico" : "Strategic Diagnosis",
    description: isEs
      ? "Acceso exclusivo. Completa tu diagnóstico y conoce si tu proyecto califica para trabajar con iKingdom."
      : "Exclusive access. Complete your diagnosis and find out if your project qualifies to work with iKingdom.",
    alternates: {
      canonical: `${BASE}/${lang}/fit`,
      languages: {
        es: `${BASE}/es/fit`,
        en: `${BASE}/en/fit`,
        "x-default": `${BASE}/es/fit`,
      },
    },
    openGraph: {
      title: isEs ? "Diagnóstico Estratégico — iKingdom" : "Strategic Diagnosis — iKingdom",
      description: isEs
        ? "Acceso exclusivo. Completa tu diagnóstico y conoce si tu proyecto califica para trabajar con iKingdom."
        : "Exclusive access. Complete your diagnosis and find out if your project qualifies to work with iKingdom.",
      url: `${BASE}/${lang}/fit`,
      siteName: "iKingdom",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "iKingdom" }],
      locale: isEs ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default function FitLangLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
