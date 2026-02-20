import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";
import { upgradeCommand } from "./commands/upgrade.js";
import { removeCommand } from "./commands/remove.js";
import { doctorCommand } from "./commands/doctor.js";
import { envCommand } from "./commands/env.js";

const program = new Command();

program
  .name("typix")
  .description("CLI for adding extensions to your Typix editor")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize Typix config in your project")
  .action(initCommand);

program
  .command("add")
  .description("Add extensions to your project")
  .argument("[extensions...]", "Extensions to add")
  .option("-a, --all", "Add all available extensions")
  .action(addCommand);

program
  .command("upgrade")
  .description("Upgrade installed Typix extensions to their latest versions")
  .argument("[extensions...]", "Extensions to upgrade (name or package)")
  .option("-a, --all", "Upgrade all installed extensions")
  .action(upgradeCommand);

program
  .command("remove")
  .description("Remove Typix extensions from your project")
  .argument("[extensions...]", "Extensions to remove (name or package)")
  .option("-a, --all", "Remove all installed extensions")
  .action(removeCommand);

program
  .command("list")
  .description("List all available Typix extensions")
  .action(listCommand);

program
  .command("doctor")
  .description("Diagnose common issues in your Typix project")
  .action(doctorCommand);

program
  .command("env")
  .description("Display environment and installed package info")
  .action(envCommand);

program.parse();
