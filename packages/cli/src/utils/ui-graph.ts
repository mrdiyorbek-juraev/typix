import fs from "fs-extra";
import path from "node:path";
import { getUiTemplatesDir } from "./ui-paths.js";

export type NodeKind = "main" | "primitive" | "lib";

export type Node = {
  kind: NodeKind;
  /** Slug (folder or file basename without ext) */
  slug: string;
  /** Path relative to the ui templates root (e.g. "main/floating-link" or "lib/utils") */
  rel: string;
  /** Absolute path on disk under dist/templates/ui */
  abs: string;
  /** True if this is a single-file node (lib), false for folder nodes */
  isFile: boolean;
};

export type GraphResult = {
  /** All nodes that must be copied to satisfy the starting node + transitive deps */
  nodes: Node[];
  /** npm package specifiers (e.g., "@radix-ui/react-popover", "lucide-react") */
  npmPeers: Set<string>;
  /** workspace specifiers (e.g., "@typix-editor/core", "lexical") */
  workspacePeers: Set<string>;
  /** All source files contributing to the copy plan, keyed by absolute path */
  files: string[];
};

/**
 * NPM-published runtime dependencies declared in design-system's package.json.
 * Imports matching these (or scoped prefixes) are recorded as "needs to be
 * installed in the user's project".
 */
const NPM_PEERS_PREFIXES = [
  "@radix-ui/",
  "react-day-picker",
  "react-textarea-autosize",
];
const NPM_PEERS_EXACT = new Set([
  "class-variance-authority",
  "clsx",
  "cmdk",
  "lucide-react",
  "tailwind-merge",
]);

/**
 * Already-required by Typix itself — user will almost certainly have these.
 * Tracked so we can report them, but not installed.
 */
const WORKSPACE_PREFIXES = ["@typix-editor/", "@lexical/"];
const WORKSPACE_EXACT = new Set(["react", "react-dom", "lexical"]);

const FILE_EXTENSIONS = [".ts", ".tsx"];
const INDEX_FILES = ["index.ts", "index.tsx"];

/**
 * Builds the full dependency graph for the given main-component slug(s).
 * Walks relative imports across folder boundaries to discover required
 * primitives and lib utilities.
 */
export function walkGraph(startMainSlugs: string[]): GraphResult {
  const root = getUiTemplatesDir();

  const nodesByRel = new Map<string, Node>();
  const npmPeers = new Set<string>();
  const workspacePeers = new Set<string>();
  const visitedFiles = new Set<string>();
  const fileQueue: string[] = [];

  // Seed: enqueue every file inside each starting main component folder.
  for (const slug of startMainSlugs) {
    const node = makeNode("main", slug, root);
    nodesByRel.set(node.rel, node);
    for (const f of collectFiles(node.abs)) fileQueue.push(f);
  }

  while (fileQueue.length > 0) {
    const file = fileQueue.shift()!;
    if (visitedFiles.has(file)) continue;
    visitedFiles.add(file);

    const source = fs.readFileSync(file, "utf-8");
    const imports = extractImports(source);
    const fileDir = path.dirname(file);

    for (const spec of imports) {
      if (spec.startsWith(".")) {
        // Relative import — may cross node boundary.
        const target = resolveRelative(fileDir, spec);
        if (!target) continue;

        const relFromRoot = path.relative(root, target).replace(/\\/g, "/");
        const node = nodeForPath(relFromRoot, root);
        if (!node) continue;

        if (!nodesByRel.has(node.rel)) {
          nodesByRel.set(node.rel, node);
          // Newly discovered node — enqueue all its files for further walking.
          if (node.isFile) {
            fileQueue.push(node.abs);
          } else {
            for (const f of collectFiles(node.abs)) fileQueue.push(f);
          }
        }
      } else {
        classifyExternal(spec, npmPeers, workspacePeers);
      }
    }
  }

  const allFiles: string[] = [];
  for (const node of nodesByRel.values()) {
    if (node.isFile) allFiles.push(node.abs);
    else allFiles.push(...collectFiles(node.abs));
  }

  return {
    nodes: [...nodesByRel.values()].sort(sortNodes),
    npmPeers,
    workspacePeers,
    files: allFiles,
  };
}

function makeNode(kind: NodeKind, slug: string, root: string): Node {
  if (kind === "lib") {
    const candidates = FILE_EXTENSIONS.map((ext) =>
      path.join(root, "lib", `${slug}${ext}`)
    );
    const abs = candidates.find(fs.existsSync) ?? candidates[0]!;
    return { kind, slug, rel: `lib/${slug}`, abs, isFile: true };
  }
  const dir = kind === "main" ? "main" : "primitives";
  return {
    kind,
    slug,
    rel: `${dir}/${slug}`,
    abs: path.join(root, dir, slug),
    isFile: false,
  };
}

/**
 * Given a path relative to the ui templates root (e.g., "primitives/button/index.tsx"),
 * figure out which node owns it.
 */
function nodeForPath(relFromRoot: string, root: string): Node | null {
  const parts = relFromRoot.split("/");

  if (parts[0] === "primitives" && parts[1]) {
    return makeNode("primitive", parts[1], root);
  }
  if (parts[0] === "main" && parts[1]) {
    return makeNode("main", parts[1], root);
  }
  if (parts[0] === "lib" && parts[1]) {
    const slug = parts[1].replace(/\.[tj]sx?$/, "");
    return makeNode("lib", slug, root);
  }
  return null;
}

/**
 * Resolve a relative import specifier from `fromDir` to an absolute file path.
 * Tries .ts, .tsx, /index.ts, /index.tsx.
 */
function resolveRelative(fromDir: string, spec: string): string | null {
  const base = path.resolve(fromDir, spec);

  // Already has an extension?
  if (/\.[tj]sx?$/.test(base) && fs.existsSync(base)) return base;

  for (const ext of FILE_EXTENSIONS) {
    const candidate = `${base}${ext}`;
    if (fs.existsSync(candidate)) return candidate;
  }
  for (const idx of INDEX_FILES) {
    const candidate = path.join(base, idx);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Recursively walk a directory and return all .ts/.tsx files.
 */
function collectFiles(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (FILE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
        out.push(full);
      }
    }
  }
  return out;
}

/**
 * Extract bare-specifier import paths from TS/TSX source.
 * Handles: import x from "Y", import { a, b } from "Y", import "Y",
 * import type ... from "Y", export ... from "Y", dynamic import("Y").
 * Ignores requires (we only target ESM).
 */
export function extractImports(source: string): string[] {
  const specs = new Set<string>();

  // import [...] from "X" / import "X" / import type [...] from "X"
  const importRe =
    /\bimport\b[\s\S]*?(?:from\s+)?["']([^"']+)["']\s*;?/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(source)) !== null) {
    specs.add(m[1]!);
  }

  // export [type] [{...}] from "X"
  const exportFromRe = /\bexport\b[\s\S]*?from\s+["']([^"']+)["']\s*;?/g;
  while ((m = exportFromRe.exec(source)) !== null) {
    specs.add(m[1]!);
  }

  // dynamic import("X")
  const dynRe = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
  while ((m = dynRe.exec(source)) !== null) {
    specs.add(m[1]!);
  }

  return [...specs];
}

function classifyExternal(
  spec: string,
  npmPeers: Set<string>,
  workspacePeers: Set<string>
): void {
  // Skip type-only "node:" specifiers
  if (spec.startsWith("node:")) return;

  // Subpath split: "@radix-ui/react-popover/foo" → "@radix-ui/react-popover"
  const pkg = packageNameFromSpecifier(spec);

  if (NPM_PEERS_EXACT.has(pkg)) {
    npmPeers.add(pkg);
    return;
  }
  if (NPM_PEERS_PREFIXES.some((p) => pkg.startsWith(p))) {
    npmPeers.add(pkg);
    return;
  }
  if (WORKSPACE_EXACT.has(pkg)) {
    workspacePeers.add(pkg);
    return;
  }
  if (WORKSPACE_PREFIXES.some((p) => pkg.startsWith(p))) {
    workspacePeers.add(pkg);
    return;
  }
  // Unknown external — record as npm peer (best-effort, user will see warning).
  npmPeers.add(pkg);
}

function packageNameFromSpecifier(spec: string): string {
  if (spec.startsWith("@")) {
    // Scoped: keep first two segments
    const [scope, name, ...rest] = spec.split("/");
    return name ? `${scope}/${name}` : spec;
  }
  return spec.split("/")[0]!;
}

function sortNodes(a: Node, b: Node): number {
  const order: Record<NodeKind, number> = { main: 0, primitive: 1, lib: 2 };
  const k = order[a.kind] - order[b.kind];
  return k !== 0 ? k : a.slug.localeCompare(b.slug);
}
