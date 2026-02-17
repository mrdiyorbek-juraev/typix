import fs from "fs-extra";
import path from "node:path";

export type TypixConfig = {
  componentDir: string;
  typescript: boolean;
  tailwind: boolean;
};

const CONFIG_FILE = "typix.json";

export function getConfigPath(): string {
  return path.resolve(process.cwd(), CONFIG_FILE);
}

export async function readConfig(): Promise<TypixConfig | null> {
  const configPath = getConfigPath();
  if (await fs.pathExists(configPath)) {
    return fs.readJson(configPath);
  }
  return null;
}

export async function writeConfig(config: TypixConfig): Promise<void> {
  const configPath = getConfigPath();
  await fs.writeJson(configPath, config, { spaces: 2 });
}

export function getDefaultConfig(): TypixConfig {
  return {
    componentDir: "components/typix",
    typescript: true,
    tailwind: true,
  };
}
