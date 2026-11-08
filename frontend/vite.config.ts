import { defineConfig } from "vite";
import type { ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";

const proxyApi: ProxyOptions = {
  target: "http://localhost:3000",
  changeOrigin: true,
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/productos": { ...proxyApi },
      "/pedidos": { ...proxyApi },
    },
  },
});
