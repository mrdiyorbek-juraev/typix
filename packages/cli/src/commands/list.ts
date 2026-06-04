import chalk from "chalk";
import {
  getCorePackages,
  getExtensionsOnly,
  type ExtensionEntry,
} from "../utils/registry.js";
import { logger } from "../utils/logger.js";

export async function listCommand() {
  const core = getCorePackages();
  const extensions = getExtensionsOnly();

  const nameWidth = 24;
  const pkgWidth = 48;

  function printSection(heading: string, rows: ExtensionEntry[]) {
    if (rows.length === 0) return;
    logger.break();
    console.log(chalk.bold(heading));
    logger.break();
    console.log(
      chalk.gray(
        "  " +
          "Name".padEnd(nameWidth) +
          "Package".padEnd(pkgWidth) +
          "Description"
      )
    );
    console.log(chalk.gray("  " + "\u2500".repeat(nameWidth + pkgWidth + 30)));
    for (const e of rows) {
      const name = chalk.cyan(e.name.padEnd(nameWidth));
      const pkg = chalk.gray(e.package.padEnd(pkgWidth));
      console.log(`  ${name}${pkg}${e.description}`);
    }
  }

  printSection("Core packages:", core);
  printSection("Available extensions:", extensions);

  logger.break();
  logger.info(
    `Add packages: ${chalk.cyan("typix add")} (interactive) or ${chalk.cyan("typix add <name>")}`
  );
  logger.info(`Add all: ${chalk.cyan("typix add --all")}`);
}
