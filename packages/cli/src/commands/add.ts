import chalk from "chalk";
import inquirer from "inquirer";
import { readConfig } from "../utils/config.js";
import { logger, spinner } from "../utils/logger.js";
import {
  getAllComponents,
  getComponentNames,
  getRegistryEntry,
  type RegistryEntry,
  getAllExtensions,
  getExtensionEntry,
  getExtensionNames,
  type ExtensionEntry,
} from "../utils/registry.js";
import { collectDependencies, writeComponent } from "../utils/writer.js";
import { installPackages } from "../utils/package-manager.js";

export async function addCommand(
  items: string[],
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

  let selectedExtensions: ExtensionEntry[];

  if (items.length === 0) {
    // Interactive multi-select picker
    const { selected } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selected",
        message: "Which extensions would you like to add?",
        choices: allExtensions.map((ext) => ({
          name: `${ext.name} ${chalk.gray(`- ${ext.description}`)}`,
          value: ext.name,
        })),
      },
    ]);

    if (selected.length === 0) {
      logger.warn("No extensions selected.");
      return;
    }

    selectedExtensions = selected.map(
      (name: string) => getExtensionEntry(name)!
    );
  } else {
    // Direct install from CLI arguments
    selectedExtensions = [];

    // Check if any items are component names (existing behavior)
    const componentItems: string[] = [];
    const extensionItems: string[] = [];

    for (const name of items) {
      if (extensionNames.includes(name)) {
        extensionItems.push(name);
      } else if (getRegistryEntry(name)) {
        componentItems.push(name);
      } else {
        logger.error(
          `"${name}" not found. Available extensions: ${extensionNames.join(", ")}`
        );
        process.exitCode = 1;
        return;
      }
    }

    // Handle component items (existing behavior)
    if (componentItems.length > 0) {
      await addComponents(componentItems, options);
    }

    if (extensionItems.length === 0) return;

    selectedExtensions = extensionItems.map(
      (name) => getExtensionEntry(name)!
    );
  }

  // Install selected extensions
  const packages = selectedExtensions.map((ext) => ext.package);
  const names = selectedExtensions.map((ext) => ext.name);

  logger.break();
  logger.info(`Installing ${names.length} extension(s): ${chalk.cyan(names.join(", "))}`);
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
  for (const ext of selectedExtensions) {
    logger.success(`${chalk.bold(ext.name)} ${chalk.gray(`(${ext.package})`)}`);
  }
}

async function addComponents(
  components: string[],
  options: { all?: boolean }
) {
  const config = await readConfig();

  if (!config) {
    logger.error(
      "No typix.json found. Run " + chalk.cyan("typix init") + " first."
    );
    process.exitCode = 1;
    return;
  }

  let entries: RegistryEntry[];

  if (options.all) {
    entries = getAllComponents();
  } else {
    entries = [];
    for (const name of components) {
      const entry = getRegistryEntry(name);
      if (!entry) {
        logger.error(
          `Component "${name}" not found. Available: ${getComponentNames().join(", ")}`
        );
        process.exitCode = 1;
        return;
      }
      entries.push(entry);
    }
  }

  const s = spinner("Adding components...").start();

  const allWritten: string[] = [];

  for (const entry of entries) {
    const written = await writeComponent(entry, config);
    allWritten.push(...written);
  }

  s.succeed("Components added!");

  logger.break();
  for (const file of allWritten) {
    logger.success(`Created ${chalk.bold(file)}`);
  }

  const deps = collectDependencies(entries);
  if (deps.length > 0) {
    logger.break();
    logger.info("Install required dependencies:");
    console.log(chalk.cyan(`  pnpm add ${deps.join(" ")}`));
  }
}
