import inquirer from "inquirer";
import { getDefaultConfig, readConfig, writeConfig } from "../utils/config.js";
import { logger } from "../utils/logger.js";

export async function initCommand() {
  const existing = await readConfig();

  if (existing) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "typix.json already exists. Overwrite?",
        default: false,
      },
    ]);

    if (!overwrite) {
      logger.info("Init cancelled.");
      return;
    }
  }

  const defaults = getDefaultConfig();

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "componentDir",
      message: "Component output directory:",
      default: defaults.componentDir,
    },
    {
      type: "confirm",
      name: "typescript",
      message: "Use TypeScript?",
      default: defaults.typescript,
    },
    {
      type: "confirm",
      name: "tailwind",
      message: "Use Tailwind CSS?",
      default: defaults.tailwind,
    },
  ]);

  await writeConfig({
    componentDir: answers.componentDir,
    typescript: answers.typescript,
    tailwind: answers.tailwind,
  });

  logger.break();
  logger.success("Created typix.json");
  logger.info(`Components will be added to ${answers.componentDir}`);
}
