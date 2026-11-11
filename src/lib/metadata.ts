import type { Metadata } from "next";

export const description = "Rime’s portfolio of software engineering, numerical computing, design, and interactive experiments.";

const origin = process.env.NEXT_PUBLIC_SITE_URL;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return basePath + path;
}

export function pageMetadata(title: string, summary: string, path: string): Metadata {
  const pageTitle = path === "/" ? "Rime / Software Engineering Portfolio" : title + " / Rime";
  const url = origin ? new URL(basePath + path, origin).toString() : undefined;
  const image = origin ? new URL(asset("/social.png"), origin).toString() : asset("/social.png");

  return {
    title: { absolute: pageTitle },
    description: summary,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      type: "website",
      title: pageTitle,
      description: summary,
      siteName: "Rime / Portfolio",
      url,
      images: [{ url: image, width: 1200, height: 630, alt: "Rime / Software engineering, design and AI" }],
    },
    twitter: { card: "summary_large_image", title: pageTitle, description: summary, images: [image] },
  };
}

