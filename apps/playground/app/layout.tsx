import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "@typix-editor/theme";
import "./globals.css";
import { ThemeProvider } from "@/components/provider";
import Layout from "@/components/layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Typix Playground",
  description: "Interactive demos for the Typix editor framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${interTight.variable} antialiased`}>
        <ThemeProvider>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
