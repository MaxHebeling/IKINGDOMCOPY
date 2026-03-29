import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ikingdom.org"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.png",
  },
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

const GTM_ID        = process.env.NEXT_PUBLIC_GTM_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>

      <body>
        {/* GTM noscript — must be first child of body */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {children}

        {/* ── Google Tag Manager ──────────────────────────────── */}
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}

        {/* ── Meta Pixel ──────────────────────────────────────── */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
