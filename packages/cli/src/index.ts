import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";

const program = new Command();

program
  .name("typix")
  .description("CLI for adding extensions to your Typix editor")
  .version("1.0.0");

program
  .command("add")
  .description("Add extensions to your project")
  .argument("[extensions...]", "Extensions to add")
  .option("-a, --all", "Add all available extensions")
  .action(addCommand);

program
  .command("list")
  .description("List all available extensions")
  .action(listCommand);

program.parse();
