import { HomeLayout } from "fumadocs-ui/layouts/home";
import { linkItems } from "@/components/layout/header";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout
      {...baseOptions()}
      className="[--color-fd-primary:var(--color-brand)] dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]"
      links={linkItems}
    >
      {children}
    </HomeLayout>
  );
}
