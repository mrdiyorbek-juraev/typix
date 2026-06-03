import chalk from "chalk";
import os from "node:os";
import { logger } from "../utils/logger.js";
import {
  detectPackageManager,
  getInstalledTypixExtensions,
  getPmVersion,
} from "../utils/package-manager.js";

export async function envCommand() {
  const pm = detectPackageManager();
  const pmVersion = getPmVersion(pm);
  const installed = getInstalledTypixExtensions();

  logger.break();
  console.log(chalk.bold("Typix Environment Info"));
  logger.break();

  const row = (label: string, value: string) =>
    console.log(`  ${chalk.gray(label.padEnd(22))} ${chalk.white(value)}`);

  // System
  console.log(chalk.dim("  System"));
  row("OS:", `${os.type()} ${os.release()} (${os.arch()})`);
  row("Node.js:", process.version);
  row("Package Manager:", `${pm} ${pmVersion}`);
  row("Working Dir:", process.cwd());

  logger.break();

  // Split installed packages into extensions and react companions
  const extensions: Record<string, string> = {};
  const reactCompanions: Record<string, string> = {};
  for (const [name, version] of Object.entries(installed)) {
    if (name.startsWith("@typix-editor/react-")) {
      reactCompanions[name] = version;
    } else {
      extensions[name] = version;
    }
  }

  // Extensions
  console.log(chalk.dim("  Extensions"));
  if (Object.keys(extensions).length === 0) {
    console.log(
      `  ${chalk.gray("None found. Run")} ${chalk.cyan("typix add")} ${chalk.gray("to install extensions.")}`
    );
  } else {
    for (const [name, version] of Object.entries(extensions)) {
      const shortName = name.replace("@typix-editor/extension-", "");
      console.log(
        `  ${chalk.cyan(shortName.padEnd(22))} ${chalk.gray(name)}  ${chalk.white(version)}`
      );
    }
  }

  logger.break();

  // React UI Companions
  console.log(chalk.dim("  React UI Companions"));
  if (Object.keys(reactCompanions).length === 0) {
    console.log(`  ${chalk.gray("None installed.")}`);
  } else {
    for (const [name, version] of Object.entries(reactCompanions)) {
      const shortName = name.replace("@typix-editor/react-", "");
      console.log(
        `  ${chalk.magenta(shortName.padEnd(22))} ${chalk.gray(name)}  ${chalk.white(version)}`
      );
    }
  }

  logger.break();
}
