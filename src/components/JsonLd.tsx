import Script from "next/script";

const SITE_URL = "https://www.ikingdom.org";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "iKingdom LLC",
  legalName: "iKingdom LLC",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/og-image.jpg`,
  email: "executive@ikingdom.org",
  telephone: "+19565095558",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1111 6th Ave, Ste 500 #680495",
    addressLocality: "San Diego",
    addressRegion: "CA",
    postalCode: "92101",
    addressCountry: "US",
  },
  areaServed: [
    {
      "@type": "City",
      name: "San Diego",
      "@id": "https://www.wikidata.org/wiki/Q16552",
    },
    {
      "@type": "Country",
      name: "United States",
    },
  ],
  sameAs: [],
  foundingLocation: {
    "@type": "Place",
    name: "San Diego, CA",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#localbusiness`,
  name: "iKingdom LLC",
  url: SITE_URL,
  telephone: "+19565095558",
  email: "executive@ikingdom.org",
  image: `${SITE_URL}/og-image.jpg`,
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1111 6th Ave, Ste 500 #680495",
    addressLocality: "San Diego",
    addressRegion: "CA",
    postalCode: "92101",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 32.7157,
    longitude: -117.1611,
  },
  areaServed: [
    {
      "@type": "City",
      name: "San Diego",
    },
    {
      "@type": "State",
      name: "California",
    },
    {
      "@type": "Country",
      name: "United States",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Digital Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Digital Ecosystems with AI",
          description:
            "Custom AI layers that automate reporting, resource allocation, and decision workflows across your organization.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Conversion Architecture",
          description:
            "Strategic landing pages and funnels designed to convert visitors into qualified leads and customers.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Operations Automation",
          description:
            "CRM integration, workflow automation, and operational systems that scale your business.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Brand Strategy & Narrative",
          description:
            "Premium brand identity, positioning, and storytelling that establishes market authority.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Premium Web Design",
          description:
            "High-performance, conversion-optimized websites built with Next.js and modern web technologies.",
        },
      },
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "iKingdom",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: ["es", "en"],
};

export function JsonLd() {
  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="schema-localbusiness"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
