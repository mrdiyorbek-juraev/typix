import chalk from "chalk";
import { readConfig } from "../utils/config.js";
import { logger, spinner } from "../utils/logger.js";
import {
  getAllComponents,
  getComponentNames,
  getRegistryEntry,
  type RegistryEntry,
} from "../utils/registry.js";
import { collectDependencies, writeComponent } from "../utils/writer.js";

export async function addCommand(
  components: string[],
  options: { all?: boolean }
) {
  const config = await readConfig();

  if (!config) {
    logger.error(
      "No typix.json found. Run " + chalk.cyan("typix init") + " first."
    );
    process.exit(1);
  }

  let entries: RegistryEntry[];

  if (options.all) {
    entries = getAllComponents();
  } else {
    if (components.length === 0) {
      logger.error("Please specify a component name or use --all.");
      logger.info(
        "Available: " + getComponentNames().join(", ")
      );
      process.exit(1);
    }

    entries = [];
    for (const name of components) {
      const entry = getRegistryEntry(name);
      if (!entry) {
        logger.error(
          `Component "${name}" not found. Available: ${getComponentNames().join(", ")}`
        );
        process.exit(1);
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
    console.log(
      chalk.cyan(`  pnpm add ${deps.join(" ")}`)
    );
  }
}
