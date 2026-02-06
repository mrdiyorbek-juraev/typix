import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import "@typix-editor/react/src/styles/main.css";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html className={inter.className} lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
