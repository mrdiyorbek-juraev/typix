import "./global.css";
import "@typix-editor/react/src/styles/main.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "./provider";
import { baseUrl, createMetadata } from "@/lib/metadata";
import { Viewport } from "next";
import { Body } from "./layout.client";
import { NextProvider } from "fumadocs-core/framework/next";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import { source } from "@/lib/source";
import Script from "next/script";

export const metadata = createMetadata({
  title: {
    template: "%s | Typix",
    default: "Typix — Extensible Rich Text Editor for React",
  },
  description:
    "Typix is a headless, extensible rich text editor framework for React built on Lexical. Install only the extensions you need — auto-link, mentions, code highlighting, drag-and-drop, and more.",
  keywords: [
    "rich text editor",
    "react editor",
    "lexical editor",
    "wysiwyg",
    "headless editor",
    "text editor react",
    "extensible editor",
    "typix editor",
    "react rich text",
    "content editor",
    "mention editor",
    "code highlight editor",
  ],
  metadataBase: baseUrl,
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    url: baseUrl.toString(),
    siteName: "Typix",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Typix — Extensible Rich Text Editor for React",
      },
    ],
  },
});

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#fff" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Typix",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "A headless, extensible rich text editor framework for React built on Meta's Lexical. Features a modular extension system with auto-complete, mentions, code highlighting, drag-and-drop blocks, floating link editor, and more.",
  url: baseUrl.toString(),
  image: `${baseUrl.toString()}og`,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Diyorbek Juraev",
  },
  programmingLanguage: ["TypeScript", "JavaScript"],
  runtimePlatform: "React",
  keywords:
    "rich text editor, react editor, wysiwyg, lexical, headless editor, extensible",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google-site-verification" content="X4NcIMx9id5XZ3A-V_Tjp8M9Pvmosf06SDZFUAc6IkU" />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8MJYHQ37XW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8MJYHQ37XW');
          `}
        </Script>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <Body>
        <NextProvider>
          <TreeContextProvider tree={source.getPageTree()}>
            <Provider>{children}</Provider>
          </TreeContextProvider>
        </NextProvider>
      </Body>
    </html>
  );
}
