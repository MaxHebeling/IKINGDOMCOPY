import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/login",
        "/companies/",
        "/thank-you",
        "/privacy-policy",
        "/cookie-policy",
        "/terms-of-service",
      ],
    },
    sitemap: "https://www.ikingdom.org/sitemap.xml",
  };
}
