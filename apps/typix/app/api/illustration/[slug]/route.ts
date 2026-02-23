import { illustrationSvgs } from "./svgs";

const PALETTES = {
  light: { c: "#64748b", a: "#10b981" }, // slate-500, emerald-500
  dark: { c: "#94a3b8", a: "#34d399" }, // slate-400, emerald-400
} as const;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const generator = illustrationSvgs[slug];

  if (!generator) {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(req.url);
  const theme = url.searchParams.get("theme") === "dark" ? "dark" : "light";
  const { c, a } = PALETTES[theme];
  const svg = generator(c, a);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=604800, s-maxage=604800, immutable",
    },
  });
}
