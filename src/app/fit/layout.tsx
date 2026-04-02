import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnóstico Estratégico",
  description:
    "Acceso exclusivo. Completa tu diagnóstico y conoce si tu proyecto califica para trabajar con iKingdom.",
  alternates: {
    canonical: "https://www.ikingdom.org/fit",
  },
  openGraph: {
    title: "Diagnóstico Estratégico — iKingdom",
    description:
      "Acceso exclusivo. Completa tu diagnóstico y conoce si tu proyecto califica para trabajar con iKingdom.",
    url: "https://www.ikingdom.org/fit",
    siteName: "iKingdom",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "iKingdom — Diagnóstico Estratégico",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diagnóstico Estratégico — iKingdom",
    description:
      "Acceso exclusivo. Completa tu diagnóstico y conoce si tu proyecto califica para trabajar con iKingdom.",
    images: ["/og-image.jpg"],
  },
};

export default function FitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
