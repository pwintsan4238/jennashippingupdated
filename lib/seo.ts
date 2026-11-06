import type { Metadata } from "next";
import { site } from "./site";

/** Share image (1200×630) used when a page is posted to Facebook, Viber, LinkedIn, etc. */
export const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` };

/**
 * Title, description, canonical URL and share-preview tags for one page.
 * `path` is the page's route with a trailing slash, e.g. "/about/" (the site uses trailingSlash).
 * Next.js replaces `openGraph` per page rather than merging it, so every page sets the full object here.
 */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} — Myanmar Seafarer Crewing & Maritime Training`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}
