import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { TypixConfig } from "./config.js";
import type { RegistryEntry } from "./registry.js";
import { logger } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getTemplatesDir(): string {
  return path.resolve(__dirname, "templates");
}

export async function writeComponent(
  entry: RegistryEntry,
  config: TypixConfig
): Promise<string[]> {
  const templatesDir = getTemplatesDir();
  const outputDir = path.resolve(process.cwd(), config.componentDir);
  const written: string[] = [];

  for (const file of entry.files) {
    const srcPath = path.join(templatesDir, file);
    const destPath = path.join(outputDir, file);

    await fs.ensureDir(path.dirname(destPath));
    await fs.copyFile(srcPath, destPath);

    const relativePath = path.relative(process.cwd(), destPath);
    written.push(relativePath);
  }

  return written;
}

export function collectDependencies(entries: RegistryEntry[]): string[] {
  const deps = new Set<string>();
  for (const entry of entries) {
    for (const dep of entry.dependencies) {
      deps.add(dep);
    }
  }
  return Array.from(deps).sort();
}
