export function getSection(path: string | undefined) {
  if (!path) return "docs";
  const [dir] = path.split("/", 1);
  if (!dir) return "docs";
  return (
    {
      ui: "ui",
      mdx: "mdx",
      cli: "cli",
      headless: "headless",
    }[dir] ?? "docs"
  );
}
