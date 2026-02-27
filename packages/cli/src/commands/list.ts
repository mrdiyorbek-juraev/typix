import chalk from "chalk";
import { getAllExtensions } from "../utils/registry.js";
import { logger } from "../utils/logger.js";

export async function listCommand() {
  const extensions = getAllExtensions();

  const nameWidth = 24;
  const pkgWidth = 48;

  logger.break();
  console.log(chalk.bold("Available extensions:"));
  logger.break();

  const header = chalk.gray(
    "  " + "Name".padEnd(nameWidth) + "Package".padEnd(pkgWidth) + "Description"
  );
  console.log(header);
  console.log(chalk.gray("  " + "\u2500".repeat(nameWidth + pkgWidth + 30)));

  for (const ext of extensions) {
    const tag = ext.reactPackage ? chalk.magenta(" [+React UI]") : "";
    const name = chalk.cyan(ext.name.padEnd(nameWidth));
    const pkg = chalk.gray(ext.package.padEnd(pkgWidth));
    console.log(`  ${name}${pkg}${ext.description}${tag}`);
  }

  logger.break();
  console.log(
    chalk.gray(`  ${chalk.magenta("[+React UI]")} = has a companion React UI package`)
  );
  logger.break();
  logger.info(
    `Add extensions: ${chalk.cyan("typix add")} (interactive) or ${chalk.cyan("typix add <name>")}`
  );
  logger.info(`Add all extensions: ${chalk.cyan("typix add --all")}`);
}
