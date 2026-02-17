import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";

const program = new Command();

program
  .name("typix")
  .description("CLI for adding extensions and components to your Typix editor")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize Typix config (typix.json)")
  .action(initCommand);

program
  .command("add")
  .description("Add extensions or components to your project")
  .argument("[items...]", "Extensions or components to add")
  .option("-a, --all", "Add all available extensions")
  .action(addCommand);

program
  .command("list")
  .description("List available extensions and components")
  .action(listCommand);

program.parse();
