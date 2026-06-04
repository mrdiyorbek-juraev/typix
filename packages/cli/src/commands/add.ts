import chalk from "chalk";
import inquirer from "inquirer";
import { logger, spinner } from "../utils/logger.js";
import {
  getAllExtensions,
  getCorePackages,
  getExtensionEntry,
  getExtensionNames,
  getExtensionsOnly,
  type ExtensionEntry,
} from "../utils/registry.js";
import { installPackages } from "../utils/package-manager.js";

export async function addCommand(
  extensions: string[],
  options: { all?: boolean }
) {
  const allExtensions = getAllExtensions();
  const extensionNames = getExtensionNames();

  // --all flag: install every extension
  if (options.all) {
    const packages = allExtensions.map((ext) => ext.package);
    const s = spinner("Installing all extensions...").start();
    try {
      installPackages(packages);
      s.succeed("All extensions installed!");
    } catch {
      s.fail("Failed to install extensions.");
      process.exitCode = 1;
    }
    return;
  }

  let selected: ExtensionEntry[];

  if (extensions.length === 0) {
    // Interactive multi-select picker — core packages first, then extensions,
    // separated by inquirer Separators so the two groups are visually distinct.
    const core = getCorePackages();
    const ext = getExtensionsOnly();
    const choices: Array<
      { name: string; value: string } | InstanceType<typeof inquirer.Separator>
    > = [];

    if (core.length > 0) {
      choices.push(new inquirer.Separator(chalk.bold("Core packages")));
      for (const e of core) {
        choices.push({
          name: `${e.name} ${chalk.gray(`- ${e.description}`)}`,
          value: e.name,
        });
      }
    }
    if (ext.length > 0) {
      choices.push(new inquirer.Separator(chalk.bold("Extensions")));
      for (const e of ext) {
        choices.push({
          name: `${e.name} ${chalk.gray(`- ${e.description}`)}`,
          value: e.name,
        });
      }
    }

    const { picked } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "picked",
        message: "Which packages would you like to add?",
        choices,
      },
    ]);

    if (picked.length === 0) {
      logger.warn("No packages selected.");
      return;
    }

    selected = picked.map((name: string) => getExtensionEntry(name)!);
  } else {
    // Validate each name
    for (const name of extensions) {
      if (!extensionNames.includes(name)) {
        logger.error(
          `"${name}" not found. Run ${chalk.cyan("typix list")} to see available extensions.`
        );
        process.exitCode = 1;
        return;
      }
    }

    selected = extensions.map((name) => getExtensionEntry(name)!);
  }

  const packages = selected.map((ext) => ext.package);
  const names = selected.map((ext) => ext.name);

  logger.break();
  logger.info(
    `Installing ${names.length} package(s): ${chalk.cyan(names.join(", "))}`
  );
  logger.break();

  try {
    installPackages(packages);
  } catch {
    logger.error("Failed to install packages.");
    process.exitCode = 1;
    return;
  }

  logger.break();
  logger.success("Packages installed successfully!");
  logger.break();
  for (const ext of selected) {
    logger.success(`${chalk.bold(ext.name)} ${chalk.gray(`(${ext.package})`)}`);
  }
}
