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
        ? "iKingdom LLC — Agencia Digital en San Diego | Diseño Web, Branding y Crecimiento"
        : "iKingdom LLC — Digital Agency in San Diego | Web Design, Branding & Growth",
      template: "%s | iKingdom",
    },
    description: isEs
      ? "Agencia digital en San Diego especializada en diseño web premium, estrategia de marca y arquitectura de conversión. Servicio local y nacional."
      : "San Diego digital agency specializing in premium web design, brand strategy, and conversion architecture. Serving local and nationwide clients.",
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
        ? "iKingdom LLC — Agencia Digital en San Diego | Diseño Web, Branding y Crecimiento"
        : "iKingdom LLC — Digital Agency in San Diego | Web Design, Branding & Growth",
      description: isEs
        ? "Agencia digital en San Diego: diseño web premium, estrategia de marca y arquitectura de conversión."
        : "San Diego digital agency: premium web design, brand strategy & conversion architecture.",
      url: `${BASE}/${lang}`,
      siteName: "iKingdom",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "iKingdom" }],
      locale: isEs ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isEs
        ? "iKingdom LLC — Agencia Digital en San Diego"
        : "iKingdom LLC — Digital Agency in San Diego",
      description: isEs
        ? "Diseño web premium, estrategia de marca y arquitectura de conversión en San Diego."
        : "Premium web design, brand strategy & conversion architecture in San Diego.",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();
  return <>{children}</>;
}
