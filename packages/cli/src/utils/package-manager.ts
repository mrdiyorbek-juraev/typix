import fs from "fs-extra";
import path from "node:path";
import { execSync } from "node:child_process";
import { logger } from "./logger.js";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export function detectPackageManager(): PackageManager {
  let dir = process.cwd();

  while (true) {
    if (
      fs.existsSync(path.join(dir, "bun.lockb")) ||
      fs.existsSync(path.join(dir, "bun.lock"))
    ) {
      return "bun";
    }
    if (
      fs.existsSync(path.join(dir, "pnpm-lock.yaml")) ||
      fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))
    ) {
      return "pnpm";
    }
    if (fs.existsSync(path.join(dir, "yarn.lock"))) {
      return "yarn";
    }
    if (fs.existsSync(path.join(dir, "package-lock.json"))) {
      return "npm";
    }

    const parent = path.dirname(dir);
    if (parent === dir) break; // reached filesystem root
    dir = parent;
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

function getUpgradeCommand(pm: PackageManager, packages: string[]): string {
  const pkgs = packages.join(" ");
  switch (pm) {
    case "bun":
      return `bun update ${pkgs}`;
    case "pnpm":
      return `pnpm update ${pkgs}`;
    case "yarn":
      return `yarn upgrade ${pkgs}`;
    case "npm":
      return `npm update ${pkgs}`;
  }
}

function getRemoveCommand(pm: PackageManager, packages: string[]): string {
  const pkgs = packages.join(" ");
  switch (pm) {
    case "bun":
      return `bun remove ${pkgs}`;
    case "pnpm":
      return `pnpm remove ${pkgs}`;
    case "yarn":
      return `yarn remove ${pkgs}`;
    case "npm":
      return `npm uninstall ${pkgs}`;
  }
}

export function installPackages(packages: string[]): void {
  const pm = detectPackageManager();
  const command = getInstallCommand(pm, packages);
  logger.info(`Using ${pm} to install packages...`);
  execSync(command, { stdio: "inherit", cwd: process.cwd() });
}

export function upgradePackages(packages: string[]): void {
  const pm = detectPackageManager();
  const command = getUpgradeCommand(pm, packages);
  logger.info(`Using ${pm} to upgrade packages...`);
  execSync(command, { stdio: "inherit", cwd: process.cwd() });
}

export function removePackages(packages: string[]): void {
  const pm = detectPackageManager();
  const command = getRemoveCommand(pm, packages);
  logger.info(`Using ${pm} to remove packages...`);
  execSync(command, { stdio: "inherit", cwd: process.cwd() });
}

export function getInstalledTypixExtensions(): Record<string, string> {
  let dir = process.cwd();
  while (true) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = fs.readJsonSync(pkgPath);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const result: Record<string, string> = {};
      for (const [name, version] of Object.entries(deps)) {
        if (
          name.startsWith("@typix-editor/extension-") ||
          name.startsWith("@typix-editor/react-")
        ) {
          result[name] = version as string;
        }
      }
      return result;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return {};
}

export function getPmVersion(pm: PackageManager): string {
  try {
    return execSync(`${pm} --version`, { stdio: "pipe" }).toString().trim();
  } catch {
    return "unknown";
  }
}
