import chalk from "chalk";
import { getAllComponents } from "../utils/registry.js";
import { getAllExtensions } from "../utils/registry.js";
import { logger } from "../utils/logger.js";

export async function listCommand() {
  const components = getAllComponents();
  const extensions = getAllExtensions();

  const nameWidth = 24;

  // Extensions
  logger.break();
  console.log(chalk.bold("Available extensions:"));
  logger.break();

  const pkgWidth = 48;
  const extHeader = chalk.gray(
    "  " + "Name".padEnd(nameWidth) + "Package".padEnd(pkgWidth) + "Description"
  );
  console.log(extHeader);
  console.log(chalk.gray("  " + "\u2500".repeat(nameWidth + pkgWidth + 30)));

  for (const ext of extensions) {
    const name = chalk.cyan(ext.name.padEnd(nameWidth));
    const pkg = chalk.gray(ext.package.padEnd(pkgWidth));
    console.log(`  ${name}${pkg}${ext.description}`);
  }

  // Components
  if (components.length > 0) {
    logger.break();
    console.log(chalk.bold("Available components:"));
    logger.break();

    const compHeader = chalk.gray(
      "  " + "Name".padEnd(nameWidth) + "Description"
    );
    console.log(compHeader);
    console.log(chalk.gray("  " + "\u2500".repeat(55)));

    for (const component of components) {
      const name = chalk.cyan(component.name.padEnd(nameWidth));
      console.log(`  ${name}${component.description}`);
    }
  }

  logger.break();
  logger.info(`Add extensions: ${chalk.cyan("typix add")} (interactive) or ${chalk.cyan("typix add <name>")}`);
  logger.info(`Add all extensions: ${chalk.cyan("typix add --all")}`);
}
