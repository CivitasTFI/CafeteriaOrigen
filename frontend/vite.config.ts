import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/productos": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/pedidos": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
