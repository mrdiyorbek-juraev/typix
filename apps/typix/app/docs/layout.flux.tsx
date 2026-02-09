import { FluxLayout } from "@/components/layout/flux";
import "katex/dist/katex.min.css";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return <FluxLayout>{children}</FluxLayout>;
}
