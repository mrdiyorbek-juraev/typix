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
          // OpenAI
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          // Anthropic
          "ClaudeBot",
          "anthropic-ai",
          "Claude-Web",
          // Google AI
          "Google-Extended",
          "Googlebot-AI",
          // Perplexity
          "PerplexityBot",
          // Meta
          "Meta-ExternalAgent",
          "Meta-ExternalFetcher",
          // Cohere
          "cohere-ai",
          // You.com
          "YouBot",
          // DuckDuckGo
          "DuckAssistBot",
          // ByteDance
          "Bytespider",
          // Amazon
          "Amazonbot",
          // Apple
          "Applebot",
          // Mistral
          "MistralAI",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/docs/"],
        disallow: [],
      },
    ],
    sitemap: new URL("/sitemap.xml", baseUrl).toString(),
    host: baseUrl.toString(),
  };
}
