import chalk from "chalk";
import fs from "fs-extra";
import { rm } from "node:fs/promises";
import inquirer from "inquirer";
import path from "node:path";
import { logger, spinner } from "../../utils/logger.js";
import { removePackages } from "../../utils/package-manager.js";
import { walkGraph } from "../../utils/ui-graph.js";
import { getUserUiDir, resolveComponentDir } from "../../utils/ui-paths.js";

type RemoveOptions = {
  all?: boolean;
  path?: string;
  force?: boolean;
  debug?: boolean;
  removePeers?: boolean;
};

function listVendoredMains(componentDir: string): string[] {
  const dir = getUserUiDir(componentDir, "main");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export async function uiRemoveCommand(
  components: string[],
  options: RemoveOptions
) {
  const { componentDir } = await resolveComponentDir(options.path);
  const vendored = listVendoredMains(componentDir);

  if (vendored.length === 0) {
    logger.info("No vendored UI components found.");
    return;
  }

  let selected: string[];

  if (options.all) {
    selected = vendored;
  } else if (components.length === 0) {
    const { picked } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "picked",
        message: "Which vendored components to remove?",
        choices: vendored.map((name) => ({ name, value: name })),
      },
    ]);
    if (picked.length === 0) {
      logger.warn("Nothing selected.");
      return;
    }
    selected = picked;
  } else {
    for (const name of components) {
      if (!vendored.includes(name)) {
        logger.error(
          `"${name}" is not vendored in ${path.relative(process.cwd(), componentDir)}.`
        );
        process.exitCode = 1;
        return;
      }
    }
    selected = components;
  }

  // Compute survivors: vendored mains NOT being removed.
  const survivors = vendored.filter((v) => !selected.includes(v));

  // Walk graphs to figure out orphans.
  const removedGraph = walkGraph(selected);
  const survivorGraph = survivors.length > 0 ? walkGraph(survivors) : null;

  const survivorRels = new Set(
    survivorGraph ? survivorGraph.nodes.map((n) => n.rel) : []
  );
  const survivorPeers = new Set(
    survivorGraph ? [...survivorGraph.npmPeers] : []
  );

  const orphanedNodes = removedGraph.nodes.filter((n) => {
    if (n.kind === "main") return selected.includes(n.slug);
    return !survivorRels.has(n.rel);
  });

  const orphanedPeers = options.removePeers
    ? [...removedGraph.npmPeers].filter((p) => !survivorPeers.has(p))
    : [];

  // Plan
  logger.break();
  console.log(chalk.bold(`Plan: remove ${selected.length} main component(s)`));
  logger.break();
  console.log(chalk.bold("  Will delete:"));
  for (const n of orphanedNodes) {
    const destDir = getUserUiDir(
      componentDir,
      n.kind === "primitive" ? "primitives" : n.kind === "main" ? "main" : "lib"
    );
    const target = n.isFile
      ? path.join(destDir, path.basename(n.abs))
      : path.join(destDir, n.slug);
    const rel = path.relative(process.cwd(), target);
    const tag =
      n.kind === "main"
        ? chalk.red("main")
        : n.kind === "primitive"
          ? chalk.yellow("primitive (orphaned)")
          : chalk.yellow("lib (orphaned)");
    console.log(`    ${tag}  ${chalk.cyan(n.slug)}  ${chalk.gray(rel)}`);
  }

  if (orphanedPeers.length > 0) {
    logger.break();
    console.log(chalk.bold("  Will uninstall npm peers:"));
    for (const p of orphanedPeers.sort()) {
      console.log(`    ${chalk.cyan(p)}`);
    }
  }
  logger.break();

  if (options.debug) {
    logger.info("Dry-run — no files removed.");
    return;
  }

  if (!options.force) {
    const { ok } = await inquirer.prompt([
      {
        type: "confirm",
        name: "ok",
        message: "Continue?",
        default: false,
      },
    ]);
    if (!ok) {
      logger.info("Cancelled.");
      return;
    }
  }

  const s = spinner("Removing files...").start();
  try {
    for (const n of orphanedNodes) {
      const destDir = getUserUiDir(
        componentDir,
        n.kind === "primitive"
          ? "primitives"
          : n.kind === "main"
            ? "main"
            : "lib"
      );
      const target = n.isFile
        ? path.join(destDir, path.basename(n.abs))
        : path.join(destDir, n.slug);
      // Native fs.rm with retries handles Windows EBUSY/ENOTEMPTY race conditions
      // (e.g., when tsc/IDE briefly holds a file handle) better than fs-extra.remove.
      await rm(target, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100,
      });
    }
    s.succeed(`Removed ${orphanedNodes.length} item(s).`);
  } catch (err) {
    s.fail("Failed to remove some files.");
    logger.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
    return;
  }

  if (orphanedPeers.length > 0) {
    logger.break();
    logger.info(`Uninstalling ${orphanedPeers.length} npm peer(s)...`);
    try {
      removePackages(orphanedPeers);
    } catch {
      logger.error(
        "Failed to uninstall some peers. Remove them manually if needed."
      );
    }
  } else if (options.removePeers && removedGraph.npmPeers.size > 0) {
    logger.info(
      "All npm peers are still required by remaining components — kept."
    );
  }

  logger.break();
  logger.success("Done.");
}
