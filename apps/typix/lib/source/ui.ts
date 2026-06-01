import { uiDocs } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

export const uiSource = loader({
  baseUrl: "/docs/ui",
  source: uiDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});
