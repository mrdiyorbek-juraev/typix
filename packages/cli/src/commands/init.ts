import inquirer from "inquirer";
import path from "node:path";
import { getDefaultConfig, readConfig, writeConfig } from "../utils/config.js";
import {
  detectPackageManager,
  type PackageManager,
} from "../utils/package-manager.js";
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
  const detectedPm = detectPackageManager();

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "componentDir",
      message: "Component output directory:",
      default: defaults.componentDir,
      filter: (val: string) => (typeof val === "string" ? val.trim() : val),
      validate: (val: string) => {
        const v = (val ?? "").trim();
        if (v.length === 0) return "Path cannot be empty.";
        // Catch the very common confused-as-confirm answer.
        if (/^(y|yes|n|no)$/i.test(v)) {
          return `"${v}" looks like a yes/no answer — this prompt expects a folder path (e.g. "components/typix").`;
        }
        // Reject absolute paths and parent traversal that escape the project.
        if (path.isAbsolute(v) || v.startsWith("..")) {
          return "Path must be relative to the project root and stay inside it.";
        }
        return true;
      },
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
    {
      type: "list",
      name: "packageManager",
      message: "Package manager:",
      choices: [
        {
          name: `pnpm${detectedPm === "pnpm" ? "  (detected)" : ""}`,
          value: "pnpm",
        },
        {
          name: `npm${detectedPm === "npm" ? "  (detected)" : ""}`,
          value: "npm",
        },
        {
          name: `yarn${detectedPm === "yarn" ? "  (detected)" : ""}`,
          value: "yarn",
        },
        {
          name: `bun${detectedPm === "bun" ? "  (detected)" : ""}`,
          value: "bun",
        },
      ],
      default: detectedPm,
    },
  ]);

  await writeConfig({
    componentDir: answers.componentDir,
    typescript: answers.typescript,
    tailwind: answers.tailwind,
    packageManager: answers.packageManager as PackageManager,
  });

  logger.break();
  logger.success("Created typix.json");
  logger.info(`Components will be added to ${answers.componentDir}`);
  logger.info(`Package manager: ${answers.packageManager}`);
}
