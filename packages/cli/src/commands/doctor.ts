import chalk from "chalk";
import fs from "fs-extra";
import path from "node:path";
import { logger } from "../utils/logger.js";
import { getInstalledTypixExtensions } from "../utils/package-manager.js";
import { getConfigPath } from "../utils/config.js";

function check(label: string, ok: boolean, hint?: string) {
  const icon = ok ? chalk.green("✔") : chalk.red("✖");
  const text = ok ? chalk.white(label) : chalk.red(label);
  console.log(`  ${icon} ${text}`);
  if (!ok && hint) {
    console.log(`    ${chalk.gray("→")} ${chalk.gray(hint)}`);
  }
}

function findPackageJson(): Record<string, unknown> | null {
  let dir = process.cwd();
  while (true) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      return fs.readJsonSync(pkgPath);
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

export async function doctorCommand() {
  logger.break();
  console.log(chalk.bold("Running Typix diagnostics..."));
  logger.break();

  let issues = 0;

  // 1. typix.json
  const configExists = fs.existsSync(getConfigPath());
  check(
    "typix.json config found",
    configExists,
    `Run ${chalk.cyan("typix init")} to create it.`
  );
  if (!configExists) issues++;

  // 2. package.json readable
  const pkg = findPackageJson();
  check(
    "package.json found",
    pkg !== null,
    "Ensure you are in a project root."
  );
  if (!pkg) {
    issues++;
  }

  const deps: Record<string, string> = {
    ...((pkg?.dependencies as Record<string, string>) ?? {}),
    ...((pkg?.devDependencies as Record<string, string>) ?? {}),
  };

  // 3. @typix-editor/react installed
  const hasReact = "@typix-editor/react" in deps;
  check(
    "@typix-editor/react is installed",
    hasReact,
    `Run ${chalk.cyan("pnpm add @typix-editor/react")} to install the core package.`
  );
  if (!hasReact) issues++;

  // 4. lexical peer dep
  const hasLexical = "lexical" in deps;
  check(
    "lexical peer dependency is installed",
    hasLexical,
    `Run ${chalk.cyan("pnpm add lexical")} to install the required peer dependency.`
  );
  if (!hasLexical) issues++;

  // 5. Installed extensions are recognised in registry
  const installed = getInstalledTypixExtensions();
  const unknownExts = Object.keys(installed).filter(
    (pkg) => !pkg.startsWith("@typix-editor/extension-")
  );
  const hasUnknown = unknownExts.length > 0;
  check(
    "All installed extensions are valid",
    !hasUnknown,
    hasUnknown ? `Unknown packages: ${unknownExts.join(", ")}` : undefined
  );
  if (hasUnknown) issues++;

  logger.break();

  if (issues === 0) {
    logger.success(
      chalk.green(`All checks passed. Your Typix project looks healthy!`)
    );
  } else {
    logger.warn(
      `Found ${chalk.yellow(issues)} issue(s). Fix the above before continuing.`
    );
    process.exitCode = 1;
  }

  logger.break();
}
