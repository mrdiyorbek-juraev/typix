import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/index.ts", "src/lexical.ts"],
  banner: {
    js: "'use client'",
  },
  minify: true,
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "lexical",
    /^@lexical\/.*/,
    /^@typix-editor\/.*/,
  ],
  ...options,
}));
