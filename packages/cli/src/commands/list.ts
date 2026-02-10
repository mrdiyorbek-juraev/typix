import chalk from "chalk";
import { getAllComponents } from "../utils/registry.js";
import { logger } from "../utils/logger.js";

export async function listCommand() {
  const components = getAllComponents();

  logger.break();
  console.log(chalk.bold("Available components:"));
  logger.break();

  const nameWidth = 20;
  const header =
    chalk.gray(
      "  " + "Name".padEnd(nameWidth) + "Description"
    );
  console.log(header);
  console.log(chalk.gray("  " + "─".repeat(55)));

  for (const component of components) {
    const name = chalk.cyan(component.name.padEnd(nameWidth));
    console.log(`  ${name}${component.description}`);
  }

  logger.break();
  logger.info(
    `Add a component: ${chalk.cyan("typix add <component>")}`
  );
  logger.info(
    `Add all components: ${chalk.cyan("typix add --all")}`
  );
}
