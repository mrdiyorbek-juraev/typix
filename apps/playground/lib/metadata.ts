import type { Metadata } from "next";

export const baseUrl =
  process.env.NODE_ENV === "development" ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL("http://localhost:3005")
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: baseUrl.toString(),
      siteName: "Typix Playground",
      type: "website",
      locale: "en_US",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      ...override.twitter,
    },
    alternates: {
      canonical: baseUrl.toString(),
      ...override.alternates,
    },
  };
}
