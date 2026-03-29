import type { Metadata } from "next";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ikingdom.org"),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.png",
  },
  title: "iKingdom — Agencia de crecimiento digital",
  description:
    "Creamos sistemas de captación, conversión y escalamiento digital de alto nivel.",
  openGraph: {
    title: "iKingdom — Agencia de crecimiento digital",
    description:
      "Creamos sistemas de captación, conversión y escalamiento digital de alto nivel.",
    url: "https://www.ikingdom.org",
    siteName: "iKingdom",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "iKingdom — Agencia de crecimiento digital",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iKingdom — Agencia de crecimiento digital",
    description:
      "Creamos sistemas de captación, conversión y escalamiento digital de alto nivel.",
    images: ["/og-image.jpg"],
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

        {/* Cookie consent banner */}
        <CookieConsent />

        {/* ── Consent Mode default (denied until user accepts) ── */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent','default',{
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>

        {/* Restore consent from localStorage on load */}
        <Script id="consent-restore" strategy="beforeInteractive">
          {`
            (function(){
              try {
                var c = localStorage.getItem('ikd_cookie_consent');
                if(c === 'accepted'){
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: 'consent_update',
                    analytics_storage: 'granted',
                    ad_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted'
                  });
                }
              } catch(e){}
            })();
          `}
        </Script>

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
fbq('consent','revoke');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');
(function(){
  try {
    if(localStorage.getItem('ikd_cookie_consent')==='accepted'){
      fbq('consent','grant');
    }
  } catch(e){}
  window.addEventListener('ikd_consent_accepted', function(){
    fbq('consent','grant');
  });
})();`}
          </Script>
        )}
      </body>
    </html>
  );
}
