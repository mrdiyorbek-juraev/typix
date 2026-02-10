import chalk from "chalk";
import ora, { type Ora } from "ora";

export const logger = {
  info: (msg: string) => console.log(chalk.cyan("ℹ"), msg),
  success: (msg: string) => console.log(chalk.green("✔"), msg),
  warn: (msg: string) => console.log(chalk.yellow("⚠"), msg),
  error: (msg: string) => console.log(chalk.red("✖"), msg),
  break: () => console.log(""),
};

export function spinner(text: string): Ora {
  return ora({ text, color: "cyan" });
}
