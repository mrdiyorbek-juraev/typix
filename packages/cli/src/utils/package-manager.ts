import fs from "fs-extra";
import path from "node:path";
import { execSync } from "node:child_process";
import { logger } from "./logger.js";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export function detectPackageManager(): PackageManager {
  const cwd = process.cwd();

  if (
    fs.existsSync(path.join(cwd, "bun.lockb")) ||
    fs.existsSync(path.join(cwd, "bun.lock"))
  ) {
    return "bun";
  }

  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }

  if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
    return "npm";
  }

  return "npm";
}

function getInstallCommand(pm: PackageManager, packages: string[]): string {
  const pkgs = packages.join(" ");
  switch (pm) {
    case "bun":
      return `bun add ${pkgs}`;
    case "pnpm":
      return `pnpm add ${pkgs}`;
    case "yarn":
      return `yarn add ${pkgs}`;
    case "npm":
      return `npm install ${pkgs}`;
  }
}

export function installPackages(packages: string[]): void {
  const pm = detectPackageManager();
  const command = getInstallCommand(pm, packages);

  logger.info(`Using ${pm} to install packages...`);

  execSync(command, { stdio: "inherit", cwd: process.cwd() });
}
