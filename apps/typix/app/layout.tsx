import "./global.css";
import "@typix-editor/react/src/styles/main.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "./provider";
import { baseUrl, createMetadata } from "@/lib/metadata";
import { Viewport } from "next";
import { Body } from "./layout.client";
import { NextProvider } from 'fumadocs-core/framework/next';
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree';
import { source } from "@/lib/source";


export const metadata = createMetadata({
  title: {
    template: '%s | Typix',
    default: 'Typix',
  },
  description: 'The best way to create documentation for your projects.',
  metadataBase: baseUrl,
});

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const mono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`} suppressHydrationWarning>
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
