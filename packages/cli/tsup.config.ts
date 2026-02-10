import { defineConfig, type Options } from "tsup";
import { cpSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig((options: Options) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  clean: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  onSuccess: async () => {
    cpSync(resolve("src/templates"), resolve("dist/templates"), {
      recursive: true,
    });
  },
  ...options,
}));
