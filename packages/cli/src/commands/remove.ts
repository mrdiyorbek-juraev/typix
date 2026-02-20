import chalk from "chalk";
import inquirer from "inquirer";
import { logger, spinner } from "../utils/logger.js";
import { getAllExtensions } from "../utils/registry.js";
import {
  removePackages,
  getInstalledTypixExtensions,
} from "../utils/package-manager.js";

export async function removeCommand(
  extensions: string[],
  options: { all?: boolean }
) {
  const installed = getInstalledTypixExtensions();

  if (Object.keys(installed).length === 0) {
    logger.warn("No Typix extensions found in this project.");
    return;
  }

  const allExtensions = getAllExtensions();
  const installedEntries = allExtensions.filter((ext) => installed[ext.package]);

  let packages: string[];

  if (options.all) {
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: chalk.red(
          `Remove all ${installedEntries.length} installed extensions?`
        ),
        default: false,
      },
    ]);
    if (!confirm) {
      logger.info("Cancelled.");
      return;
    }
    packages = installedEntries.map((e) => e.package);
  } else if (extensions.length > 0) {
    const nameToPackage: Record<string, string> = {};
    for (const ext of allExtensions) {
      nameToPackage[ext.name] = ext.package;
    }

    packages = [];
    for (const name of extensions) {
      const pkg = nameToPackage[name] ?? name;
      if (!installed[pkg]) {
        logger.warn(`"${name}" is not installed — skipping.`);
        continue;
      }
      packages.push(pkg);
    }

    if (packages.length === 0) {
      logger.error("No valid installed extensions matched.");
      process.exitCode = 1;
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Remove ${chalk.cyan(packages.join(", "))}?`,
        default: false,
      },
    ]);
    if (!confirm) {
      logger.info("Cancelled.");
      return;
    }
  } else {
    // Interactive picker
    const { picked } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "picked",
        message: "Which extensions would you like to remove?",
        choices: installedEntries.map((ext) => ({
          name: `${ext.name} ${chalk.gray(`(${installed[ext.package]})`)}`,
          value: ext.package,
        })),
      },
    ]);

    if (picked.length === 0) {
      logger.warn("No extensions selected.");
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Remove ${chalk.red(picked.length + " extension(s)")}?`,
        default: false,
      },
    ]);
    if (!confirm) {
      logger.info("Cancelled.");
      return;
    }

    packages = picked;
  }

  logger.break();
  const s = spinner("Removing extensions...").start();
  try {
    removePackages(packages);
    s.succeed(`Removed ${packages.length} extension(s).`);
    logger.break();
    for (const pkg of packages) {
      logger.success(chalk.gray(pkg));
    }
  } catch {
    s.fail("Failed to remove extensions.");
    process.exitCode = 1;
  }
}
