import chalk from "chalk";
import fs from "fs-extra";
import path from "node:path";
import { logger } from "../../utils/logger.js";
import {
  getUiSubdir,
  getUserUiDir,
  resolveComponentDir,
} from "../../utils/ui-paths.js";

type Filter = "installed" | "available" | "all";

type ListOptions = {
  installed?: boolean;
  available?: boolean;
  all?: boolean;
  path?: string;
  json?: boolean;
};

type Entry = {
  name: string;
  installed: boolean;
  installedAt?: string;
};

function resolveFilter(opts: ListOptions): Filter {
  if (opts.installed) return "installed";
  if (opts.available) return "available";
  return "all";
}

function listMainComponents(): string[] {
  const mainDir = getUiSubdir("main");
  if (!fs.existsSync(mainDir)) return [];
  return fs
    .readdirSync(mainDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export async function uiListCommand(options: ListOptions) {
  const { componentDir } = await resolveComponentDir(options.path);
  const userMainDir = getUserUiDir(componentDir, "main");

  const entries: Entry[] = listMainComponents().map((name) => {
    const installedAt = path.join(userMainDir, name);
    const installed = fs.existsSync(installedAt);
    return {
      name,
      installed,
      installedAt: installed
        ? path.relative(process.cwd(), installedAt)
        : undefined,
    };
  });

  const filter = resolveFilter(options);
  const filtered = entries.filter((e) => {
    if (filter === "installed") return e.installed;
    if (filter === "available") return !e.installed;
    return true;
  });

  if (options.json) {
    console.log(JSON.stringify({ components: filtered }, null, 2));
    return;
  }

  logger.break();
  console.log(chalk.bold(`UI components (${entries.length} total)`));
  logger.break();

  const installed = filtered.filter((e) => e.installed);
  const available = filtered.filter((e) => !e.installed);

  if (filter !== "available" && installed.length > 0) {
    console.log(chalk.green("  Already in your project:"));
    for (const e of installed) {
      console.log(`    ${chalk.cyan(e.name)}  ${chalk.gray(e.installedAt!)}`);
    }
    logger.break();
  }

  if (filter !== "installed" && available.length > 0) {
    console.log(chalk.bold("  Available to add:"));
    for (const e of available) {
      console.log(`    ${chalk.cyan(e.name)}`);
    }
    logger.break();
  }

  if (filtered.length === 0) {
    logger.info(`No components match the current filter (${filter}).`);
    return;
  }

  logger.info(`Add one: ${chalk.cyan("typix ui add <name>")}`);
  logger.info(`Add all: ${chalk.cyan("typix ui add --all")}`);
}
