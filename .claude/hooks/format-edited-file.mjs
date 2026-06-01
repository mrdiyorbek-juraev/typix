#!/usr/bin/env node
// PostToolUse hook for Edit/Write.
// Runs `biome format --write` on the edited file when it's a supported type.
// Silent no-op on failure — formatting should never break Claude's flow.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const SUPPORTED = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".jsonc",
  ".css",
]);

let input;
try {
  input = JSON.parse(readFileSync(0, "utf-8"));
} catch {
  process.exit(0);
}

const file = input?.tool_input?.file_path;
if (!file) process.exit(0);

const ext = extname(file).toLowerCase();
if (!SUPPORTED.has(ext)) process.exit(0);

const result = spawnSync(
  "pnpm",
  ["exec", "biome", "format", "--write", file],
  { stdio: "ignore", shell: true }
);

// Always exit 0 — a formatter failure is not a tool failure.
process.exit(0);
