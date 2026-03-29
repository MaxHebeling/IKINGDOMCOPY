import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ikingdom.agency"),
  title: "iKingdom — Arquitectura de Ecosistemas Digitales con IA",
  description: "Construimos la infraestructura digital que opera tu negocio. Estrategia, arquitectura e ingeniería unificadas en sistemas con IA que captan clientes y multiplican ingresos.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "iKingdom",
    title: "iKingdom — Arquitectura de Ecosistemas Digitales con IA",
    description: "Construimos la infraestructura digital que opera tu negocio. Sistemas con IA que captan clientes, automatizan operaciones y multiplican ingresos.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "iKingdom — Arquitectura de Ecosistemas Digitales con IA",
      },
    ],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "iKingdom — Arquitectura de Ecosistemas Digitales con IA",
    description: "Construimos la infraestructura digital que opera tu negocio. Sistemas con IA que captan clientes, automatizan operaciones y multiplican ingresos.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
