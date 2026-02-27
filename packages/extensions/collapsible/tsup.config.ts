import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/index.ts"],
  minify: true,
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: [
    "lexical",
    /^@lexical\/.*/,
  ],
  ...options,
}));
