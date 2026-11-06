import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:5173",
    browserName: "chromium",
  },
  webServer: [
    {
      command: "npm --prefix ../backend run dev",
      url: "http://localhost:3000/productos",
      env: { NODE_ENV: "test" },
      reuseExistingServer: false,
    },
    {
      command: "npm run dev -- --port 5173 --strictPort",
      url: "http://localhost:5173",
      reuseExistingServer: false,
    },
  ],
});