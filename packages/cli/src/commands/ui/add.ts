import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "node:path";
import { logger, spinner } from "../../utils/logger.js";
import { installPackages } from "../../utils/package-manager.js";
import {
  copyNode,
  copyStyles,
  type CopyOutcome,
} from "../../utils/ui-copy.js";
import { walkGraph, type GraphResult, type Node } from "../../utils/ui-graph.js";
import {
  getUiSubdir,
  getUserUiDir,
  resolveComponentDir,
} from "../../utils/ui-paths.js";

type AddOptions = {
  all?: boolean;
  path?: string;
  overwrite?: boolean;
  debug?: boolean;
};

function listAvailableMains(): string[] {
  const dir = getUiSubdir("main");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export async function uiAddCommand(
  components: string[],
  options: AddOptions
) {
  const available = listAvailableMains();

  let selected: string[];

  if (options.all) {
    selected = available;
  } else if (components.length === 0) {
    const { picked } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "picked",
        message: "Which UI components would you like to vendor?",
        choices: available.map((name) => ({ name, value: name })),
      },
    ]);
    if (picked.length === 0) {
      logger.warn("No components selected.");
      return;
    }
    selected = picked;
  } else {
    for (const name of components) {
      if (!available.includes(name)) {
        logger.error(
          `"${name}" is not a known UI component. Run ${chalk.cyan("typix ui list")} to see the catalog.`
        );
        process.exitCode = 1;
        return;
      }
    }
    selected = components;
  }

  const graph = walkGraph(selected);
  const { componentDir } = await resolveComponentDir(options.path);

  printPlan(selected, graph, componentDir);

  if (options.debug) {
    logger.info("Dry-run — no files written. Re-run without --debug to apply.");
    return;
  }

  // Copy files
  const s = spinner("Copying files...").start();
  const aggregate: CopyOutcome = { written: [], skipped: [] };
  try {
    for (const node of graph.nodes) {
      const outcome = copyNode(node, componentDir, { overwrite: !!options.overwrite });
      aggregate.written.push(...outcome.written);
      aggregate.skipped.push(...outcome.skipped);
    }
    const styleOutcome = copyStyles(componentDir, !!options.overwrite);
    aggregate.written.push(...styleOutcome.written);
    aggregate.skipped.push(...styleOutcome.skipped);
    s.succeed(`Copied ${aggregate.written.length} file(s), skipped ${aggregate.skipped.length}.`);
  } catch (err) {
    s.fail("Failed to copy files.");
    logger.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
    return;
  }

  if (aggregate.skipped.length > 0 && !options.overwrite) {
    logger.break();
    logger.warn(`${aggregate.skipped.length} file(s) already existed and were left untouched. Use --overwrite to replace them.`);
  }

  // Install npm peers (best-effort: skip if already installed)
  const peersToInstall = await filterUninstalledPeers([...graph.npmPeers]);
  if (peersToInstall.length > 0) {
    logger.break();
    logger.info(`Installing ${peersToInstall.length} npm peer(s): ${chalk.cyan(peersToInstall.join(", "))}`);
    try {
      installPackages(peersToInstall);
    } catch {
      logger.error("Failed to install npm peers. You can install them manually.");
      process.exitCode = 1;
      return;
    }
  } else if (graph.npmPeers.size > 0) {
    logger.info("All required npm peers are already installed.");
  }

  logger.break();
  logger.success("Done.");
  const dirRel = path.relative(process.cwd(), componentDir).replace(/\\/g, "/");
  logger.info(`Import components from ${chalk.cyan(`@/${dirRel}/main/<name>`)}`);
  logger.info(`Add to your app's CSS:`);
  console.log(chalk.gray(`    @import "tailwindcss";`));
  console.log(chalk.gray(`    @import "./${dirRel}/styles/tokens.css";`));
  console.log(chalk.gray(`    @import "./${dirRel}/styles/editor.css";`));
  console.log(chalk.gray(`    @import "./${dirRel}/styles/tailwind.css";`));
}

function printPlan(selected: string[], graph: GraphResult, componentDir: string) {
  logger.break();
  console.log(chalk.bold(`Plan: vendor ${selected.length} main component(s)`));
  logger.break();

  console.log(chalk.bold("  Files to copy:"));
  const grouped = groupNodesByKind(graph.nodes);
  for (const kind of ["main", "primitive", "lib"] as const) {
    const nodes = grouped[kind];
    if (nodes.length === 0) continue;
    const label = kind === "main" ? "main components" : kind === "primitive" ? "primitives" : "lib";
    console.log(chalk.gray(`    ${label}:`));
    for (const n of nodes) {
      const dest = path.relative(
        process.cwd(),
        path.join(getUserUiDir(componentDir, kind === "primitive" ? "primitives" : kind), n.slug)
      );
      console.log(`      ${chalk.cyan(n.slug)}  ${chalk.gray("→ " + dest)}`);
    }
  }

  logger.break();
  console.log(chalk.bold(`  Files total: ${graph.files.length}`));

  if (graph.npmPeers.size > 0) {
    logger.break();
    console.log(chalk.bold("  NPM peers to install:"));
    for (const peer of [...graph.npmPeers].sort()) {
      console.log(`    ${chalk.cyan(peer)}`);
    }
  }

  if (graph.workspacePeers.size > 0) {
    logger.break();
    console.log(chalk.bold("  Already required by Typix (not installed):"));
    for (const peer of [...graph.workspacePeers].sort()) {
      console.log(`    ${chalk.gray(peer)}`);
    }
  }
  logger.break();
}

function groupNodesByKind(nodes: Node[]) {
  return {
    main: nodes.filter((n) => n.kind === "main"),
    primitive: nodes.filter((n) => n.kind === "primitive"),
    lib: nodes.filter((n) => n.kind === "lib"),
  };
}

/**
 * Walk up from cwd to find package.json, read its dependencies/devDependencies,
 * and filter out peers that are already declared.
 */
async function filterUninstalledPeers(peers: string[]): Promise<string[]> {
  let dir = process.cwd();
  while (true) {
    const pkgPath = path.join(dir, "package.json");
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      const installed = new Set([
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.devDependencies ?? {}),
      ]);
      return peers.filter((p) => !installed.has(p));
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return peers;
}
