import type { Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { ThemeProvider } from "@/components/provider";
import Layout from "@/components/layout";
import { baseUrl, createMetadata } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata = createMetadata({
  title: {
    template: "%s | Typix Playground",
    default: "Typix Playground — Interactive Rich Text Editor Demo",
  },
  description:
    "Try Typix live — an extensible rich text editor for React built on Lexical. Explore tables, code blocks, mentions, slash commands, drag-and-drop, and more.",
  keywords: [
    "typix playground",
    "rich text editor demo",
    "lexical editor playground",
    "react editor demo",
    "wysiwyg editor",
    "typix editor",
    "code block editor",
    "table editor",
    "mention editor",
  ],
  metadataBase: baseUrl,
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: "/logo.svg",
  },
  openGraph: {
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Typix Playground — Interactive Rich Text Editor Demo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#fff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${interTight.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Typix Playground",
              url: baseUrl.toString(),
              description:
                "Interactive rich text editor demo powered by Typix — an extensible editor framework built on Lexical.",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        <ThemeProvider>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
