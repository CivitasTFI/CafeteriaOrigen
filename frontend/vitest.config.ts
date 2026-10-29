import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: false,
      include: ["src/test/**/*.{test,spec}.{ts,tsx}"],
      setupFiles: ["./src/test/setup.ts"],
      api: false,
    },
  }),
);
