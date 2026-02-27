import chalk from "chalk";
import inquirer from "inquirer";
import { logger, spinner } from "../utils/logger.js";
import {
  getAllExtensions,
  getExtensionEntry,
  getExtensionNames,
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
    const packages = allExtensions.flatMap((ext) =>
      ext.reactPackage ? [ext.package, ext.reactPackage] : [ext.package]
    );
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
    // Interactive multi-select picker
    const { picked } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "picked",
        message: "Which extensions would you like to add?",
        choices: allExtensions.map((ext) => ({
          name: `${ext.name} ${chalk.gray(`- ${ext.description}`)}`,
          value: ext.name,
        })),
      },
    ]);

    if (picked.length === 0) {
      logger.warn("No extensions selected.");
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

  const packages = selected.flatMap((ext) =>
    ext.reactPackage ? [ext.package, ext.reactPackage] : [ext.package]
  );
  const names = selected.map((ext) => ext.name);

  logger.break();
  logger.info(
    `Installing ${names.length} extension(s): ${chalk.cyan(names.join(", "))}`
  );
  logger.break();

  try {
    installPackages(packages);
  } catch {
    logger.error("Failed to install extensions.");
    process.exitCode = 1;
    return;
  }

  logger.break();
  logger.success("Extensions installed successfully!");
  logger.break();
  for (const ext of selected) {
    logger.success(`${chalk.bold(ext.name)} ${chalk.gray(`(${ext.package})`)}`);
    if (ext.reactPackage) {
      logger.success(
        `  ${chalk.gray("+ React UI:")} ${chalk.gray(ext.reactPackage)}`
      );
    }
  }
}
