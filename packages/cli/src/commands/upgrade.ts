import chalk from "chalk";
import inquirer from "inquirer";
import { logger, spinner } from "../utils/logger.js";
import {
  getExtensionEntry,
  getAllExtensions,
  type ExtensionEntry,
} from "../utils/registry.js";
import {
  upgradePackages,
  getInstalledTypixExtensions,
} from "../utils/package-manager.js";

function appendReactCompanions(
  packages: string[],
  installed: Record<string, string>,
  allExtensions: ExtensionEntry[]
): string[] {
  const result = [...packages];
  for (const pkg of packages) {
    const entry = allExtensions.find((e) => e.package === pkg);
    if (entry?.reactPackage && installed[entry.reactPackage]) {
      result.push(entry.reactPackage);
    }
  }
  return result;
}

export async function upgradeCommand(
  extensions: string[],
  options: { all?: boolean }
) {
  const installed = getInstalledTypixExtensions();

  if (Object.keys(installed).length === 0) {
    logger.warn("No Typix extensions found in this project.");
    logger.info(`Run ${chalk.cyan("typix add")} to install extensions.`);
    return;
  }

  let packages: string[];

  if (options.all) {
    packages = Object.keys(installed);
  } else if (extensions.length > 0) {
    const allExtensions = getAllExtensions();
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
  } else {
    // Interactive picker from installed extensions only
    const allExtensions = getAllExtensions();
    const installedEntries = allExtensions.filter(
      (ext) => installed[ext.package]
    );

    const { picked } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "picked",
        message: "Which extensions would you like to upgrade?",
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

    packages = picked;
  }

  const allExts = getAllExtensions();
  packages = appendReactCompanions(packages, installed, allExts);

  logger.break();
  logger.info(`Upgrading ${packages.length} package(s)...`);
  logger.break();

  const s = spinner("Upgrading packages...").start();
  try {
    upgradePackages(packages);
    s.succeed("Extensions upgraded successfully!");
  } catch {
    s.fail("Failed to upgrade extensions.");
    process.exitCode = 1;
  }
}
