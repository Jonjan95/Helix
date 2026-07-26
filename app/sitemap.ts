import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return [];
  }

  return [
    {
      changeFrequency: "monthly",
      priority: 1,
      url: siteUrl.toString(),
    },
  ];
}
