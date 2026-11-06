import type { MetadataRoute } from "next";
import { getJobs } from "@/lib/jobs";

export const dynamic = "force-static";

const BASE = "https://jenashipping.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/services", "/shipowners", "/careers", "/careers/apply", "/faq", "/contact"];
  const jobs = await getJobs();
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}/`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...jobs.map((j) => ({ url: `${BASE}/careers/${j.slug}/`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
