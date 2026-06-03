import { defineConfig, type Options } from "tsup";
import { cpSync } from "node:fs";
import { resolve } from "node:path";

const UI_SOURCE_DIRS = ["main", "primitives", "lib", "styles"] as const;
const UI_SOURCE_FILES = ["index.ts"] as const;

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

    const designSrc = resolve("../design-system/src");
    const uiDest = resolve("dist/templates/ui");
    for (const dir of UI_SOURCE_DIRS) {
      cpSync(resolve(designSrc, dir), resolve(uiDest, dir), {
        recursive: true,
      });
    }
    for (const file of UI_SOURCE_FILES) {
      cpSync(resolve(designSrc, file), resolve(uiDest, file));
    }
  },
  ...options,
}));
