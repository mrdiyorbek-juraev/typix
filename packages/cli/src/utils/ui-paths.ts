import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { readConfig, getDefaultConfig, type TypixConfig } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Absolute path to the bundled `@typix-editor/ui` source.
 * In dev (running tsx from src/): resolves to ../../dist/templates/ui (built artifact)
 * In prod (running dist/index.js): resolves to ./templates/ui next to the bundle
 */
export function getUiTemplatesDir(): string {
  // dist/index.js → dist/templates/ui
  const candidate = path.resolve(__dirname, "templates/ui");
  if (fs.existsSync(candidate)) return candidate;

  // Fallback: src/utils → packages/cli/dist/templates/ui
  return path.resolve(__dirname, "../../dist/templates/ui");
}

export function getUiSubdir(kind: "main" | "primitives" | "lib" | "styles"): string {
  return path.join(getUiTemplatesDir(), kind);
}

export type ResolvedConfig = {
  componentDir: string;
  config: TypixConfig;
};

/**
 * Reads typix.json (or defaults) and resolves componentDir to an absolute path.
 * Optional override replaces config.componentDir.
 */
export async function resolveComponentDir(
  override?: string
): Promise<ResolvedConfig> {
  const config = (await readConfig()) ?? getDefaultConfig();
  const dir = override ?? config.componentDir;
  return {
    componentDir: path.resolve(process.cwd(), dir),
    config,
  };
}

export function getUserUiDir(componentDir: string, kind: "main" | "primitives" | "lib" | "styles"): string {
  return path.join(componentDir, kind);
}
