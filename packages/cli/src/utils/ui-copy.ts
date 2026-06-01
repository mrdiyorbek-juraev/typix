import fs from "fs-extra";
import path from "node:path";
import type { Node } from "./ui-graph.js";
import { getUiSubdir, getUiTemplatesDir, getUserUiDir } from "./ui-paths.js";

export type CopyOutcome = {
  /** Files actually written */
  written: string[];
  /** Files skipped because they already exist (and --overwrite was not passed) */
  skipped: string[];
};

/**
 * Copy a node's source files into the user's project, mirroring the
 * source layout. Returns paths written / skipped, relative to cwd.
 *
 * Because we mirror the source layout, relative imports inside the copied
 * files resolve correctly without any rewriting.
 */
export function copyNode(
  node: Node,
  componentDir: string,
  opts: { overwrite: boolean }
): CopyOutcome {
  const root = getUiTemplatesDir();
  const destKindDir = getUserUiDir(
    componentDir,
    node.kind === "primitive" ? "primitives" : node.kind === "main" ? "main" : "lib"
  );

  if (node.isFile) {
    const fileName = path.basename(node.abs);
    const dest = path.join(destKindDir, fileName);
    return copyFile(node.abs, dest, opts.overwrite);
  }

  const dest = path.join(destKindDir, node.slug);
  return copyDir(node.abs, dest, opts.overwrite);
}

function copyFile(src: string, dest: string, overwrite: boolean): CopyOutcome {
  const rel = path.relative(process.cwd(), dest);
  if (fs.existsSync(dest) && !overwrite) {
    return { written: [], skipped: [rel] };
  }
  fs.ensureDirSync(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return { written: [rel], skipped: [] };
}

function copyDir(srcDir: string, destDir: string, overwrite: boolean): CopyOutcome {
  const written: string[] = [];
  const skipped: string[] = [];

  const stack: Array<{ src: string; dest: string }> = [{ src: srcDir, dest: destDir }];
  while (stack.length > 0) {
    const { src, dest } = stack.pop()!;
    if (!fs.existsSync(src)) continue;

    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.ensureDirSync(dest);
      for (const entry of fs.readdirSync(src)) {
        stack.push({ src: path.join(src, entry), dest: path.join(dest, entry) });
      }
    } else {
      const outcome = copyFile(src, dest, overwrite);
      written.push(...outcome.written);
      skipped.push(...outcome.skipped);
    }
  }

  return { written, skipped };
}

/**
 * Copy the entire bundled `styles/` directory into the user's
 * `<componentDir>/styles/`, preserving structure. Used once per `ui add`
 * invocation. Idempotent — per-file skip-if-exists unless `overwrite`.
 *
 * Index file (after copy): `<componentDir>/styles/index.css` — what users
 * import from their app's main CSS entry.
 */
export function copyStyles(
  componentDir: string,
  overwrite: boolean
): CopyOutcome {
  const srcDir = getUiSubdir("styles");
  const destDir = getUserUiDir(componentDir, "styles");
  return copyDir(srcDir, destDir, overwrite);
}

/**
 * Path to the canonical index.css the user should import.
 * Relative to cwd, forward-slash normalised for CSS @import strings.
 */
export function getStylesIndexImportPath(componentDir: string): string {
  const indexPath = path.join(getUserUiDir(componentDir, "styles"), "index.css");
  return "./" + path.relative(process.cwd(), indexPath).replace(/\\/g, "/");
}
