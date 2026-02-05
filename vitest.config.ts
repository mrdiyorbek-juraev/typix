import path from "path";
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "**/*.d.ts",
        "**/*.config.{ts,js}",
        "**/index.ts",
      ],
    },
    setupFiles: [path.resolve(__dirname, "vitest.setup.ts")],
    passWithNoTests: true,
  },
});
