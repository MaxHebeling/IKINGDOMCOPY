import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang !== "en";
  const BASE = "https://www.ikingdom.org";

  return {
    title: {
      default: isEs
        ? "iKingdom — Arquitectura de Crecimiento Digital"
        : "iKingdom — Premium Growth Architecture",
      template: "%s | iKingdom",
    },
    description: isEs
      ? "Sistemas de captación, conversión y escalamiento para empresas que operan a alto nivel."
      : "Revenue systems, AI operations, and enterprise platforms for companies that don't play average.",
    alternates: {
      canonical: `${BASE}/${lang}`,
      languages: {
        es: `${BASE}/es`,
        en: `${BASE}/en`,
        "x-default": `${BASE}/es`,
      },
    },
    openGraph: {
      title: isEs
        ? "iKingdom — Arquitectura de Crecimiento Digital"
        : "iKingdom — Premium Growth Architecture",
      description: isEs
        ? "Sistemas de captación, conversión y escalamiento para empresas que operan a alto nivel."
        : "Revenue systems, AI operations, and enterprise platforms for companies that don't play average.",
      url: `${BASE}/${lang}`,
      siteName: "iKingdom",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "iKingdom" }],
      locale: isEs ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isEs
        ? "iKingdom — Arquitectura de Crecimiento Digital"
        : "iKingdom — Premium Growth Architecture",
      description: isEs
        ? "Sistemas de captación, conversión y escalamiento para empresas que operan a alto nivel."
        : "Revenue systems, AI operations, and enterprise platforms for companies that don't play average.",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();
  return <>{children}</>;
}
