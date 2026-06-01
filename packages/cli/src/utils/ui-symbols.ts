import fs from "fs-extra";
import path from "node:path";
import { getUiTemplatesDir } from "./ui-paths.js";

export type SymbolKind = "primitive" | "main" | "lib";

export type SymbolEntry = {
  /** The exported symbol name */
  symbol: string;
  /** Whether it's a primitive (single-file), a main component (folder), or a lib util (file) */
  kind: SymbolKind;
  /** The directory or file name under the kind (e.g., "button" for "./primitives/button") */
  slug: string;
  /** Path relative to the ui templates root (e.g., "primitives/button" or "lib/utils") */
  sourcePath: string;
};

export type SymbolMap = Map<string, SymbolEntry>;

let cache: SymbolMap | null = null;

/**
 * Parses dist/templates/ui/index.ts to map every exported symbol to its
 * source location. Used by the graph walker to resolve `@typix-editor/ui`
 * imports to the underlying file/dir.
 */
export function getSymbolMap(): SymbolMap {
  if (cache) return cache;

  const indexPath = path.join(getUiTemplatesDir(), "index.ts");
  const source = fs.readFileSync(indexPath, "utf-8");

  const map: SymbolMap = new Map();

  // Match: export [type] { ... } from "./relative/path";
  // [\s\S]*? handles multi-line export blocks.
  const exportRegex =
    /export\s+(?:type\s+)?\{([\s\S]*?)\}\s+from\s+["']([^"']+)["']/g;

  let match: RegExpExecArray | null;
  while ((match = exportRegex.exec(source)) !== null) {
    const namesBlock = match[1]!;
    const importPath = match[2]!;

    const entry = classifyPath(importPath);
    if (!entry) continue;

    const symbols = parseSymbols(namesBlock);
    for (const sym of symbols) {
      map.set(sym, {
        symbol: sym,
        kind: entry.kind,
        slug: entry.slug,
        sourcePath: entry.sourcePath,
      });
    }
  }

  cache = map;
  return map;
}

function classifyPath(
  importPath: string
): { kind: SymbolKind; slug: string; sourcePath: string } | null {
  // Strip leading "./"
  const clean = importPath.replace(/^\.\//, "");

  // "primitives/button" → primitive, slug "button"
  const primMatch = clean.match(/^primitives\/([^/]+)/);
  if (primMatch) {
    return {
      kind: "primitive",
      slug: primMatch[1]!,
      sourcePath: `primitives/${primMatch[1]}`,
    };
  }

  // "main/floating-link" → main, slug "floating-link"
  const mainMatch = clean.match(/^main\/([^/]+)/);
  if (mainMatch) {
    return {
      kind: "main",
      slug: mainMatch[1]!,
      sourcePath: `main/${mainMatch[1]}`,
    };
  }

  // "lib/utils" → lib, slug "utils"
  const libMatch = clean.match(/^lib\/([^/]+)/);
  if (libMatch) {
    return {
      kind: "lib",
      slug: libMatch[1]!,
      sourcePath: `lib/${libMatch[1]}`,
    };
  }

  return null;
}

/**
 * Splits "A, B, type C, type D" into ["A","B","C","D"].
 * Symbol aliases ("A as B") are recorded as the exported name "B" since
 * that's what consumers import.
 */
function parseSymbols(block: string): string[] {
  return block
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      // Strip "type " prefix
      let name = s.replace(/^type\s+/, "").trim();
      // Handle "X as Y" → Y
      const asMatch = name.match(/^(\w+)\s+as\s+(\w+)$/);
      if (asMatch) name = asMatch[2]!;
      return name;
    })
    .filter((s) => /^\w+$/.test(s));
}

/** For tests / debugging */
export function clearSymbolMapCache(): void {
  cache = null;
}
