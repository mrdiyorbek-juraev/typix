import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";
import { upgradeCommand } from "./commands/upgrade.js";
import { removeCommand } from "./commands/remove.js";
import { doctorCommand } from "./commands/doctor.js";
import { envCommand } from "./commands/env.js";
import { uiAddCommand } from "./commands/ui/add.js";
import { uiListCommand } from "./commands/ui/list.js";
import { uiRemoveCommand } from "./commands/ui/remove.js";

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

const ui = program
  .command("ui")
  .description("Vendor design-system components into your project");

ui.command("list")
  .description("List available UI components and their installation status")
  .option("--installed", "Show only components already vendored")
  .option("--available", "Show only components not yet vendored")
  .option("--all", "Show both (default)")
  .option("--path <dir>", "Override the destination path used for the installed check")
  .option("--json", "Output as JSON")
  .action(uiListCommand);

ui.command("add")
  .description("Vendor UI components from @typix-editor/ui into your project")
  .argument("[components...]", "Components to add")
  .option("-a, --all", "Vendor every available UI component")
  .option("--path <dir>", "Override the destination path")
  .option("--overwrite", "Re-copy components even if they already exist")
  .option("-d, --debug", "Dry-run — show what would be copied without writing files")
  .action(uiAddCommand);

ui.command("remove")
  .description("Remove vendored UI components from your project")
  .argument("[components...]", "Components to remove")
  .option("-a, --all", "Remove every vendored component")
  .option("--path <dir>", "Override the source path")
  .option("--force", "Skip the confirmation prompt")
  .option("--remove-peers", "Also uninstall npm peers declared by the removed components")
  .option("-d, --debug", "Dry-run — print what would be removed")
  .action(uiRemoveCommand);

program.parse();
