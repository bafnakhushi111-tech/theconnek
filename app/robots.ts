import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/color-preview"],
    },
    sitemap: "https://www.theconnek.com/sitemap.xml",
    host: "https://www.theconnek.com",
  };
}
