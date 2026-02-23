import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/og/"],
      },
      {
        // Allow AI crawlers explicit access to LLM-friendly routes
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "anthropic-ai",
          "cohere-ai",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/docs/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", baseUrl).toString(),
    host: baseUrl.toString(),
  };
}
