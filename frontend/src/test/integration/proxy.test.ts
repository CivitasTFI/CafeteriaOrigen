// @vitest-environment node

import { http, HttpResponse, passthrough } from "msw";
import { createServer } from "vite";
import type { ViteDevServer } from "vite";
import { afterAll, beforeAll, expect, test, vi } from "vitest";
import viteConfig from "../../../vite.config";
import { server } from "../mocks/server";

let vite: ViteDevServer | undefined;
let frontendUrl: string;

beforeAll(async () => {
  vite = await createServer({
    ...viteConfig,
    configFile: false,
    logLevel: "silent",
    optimizeDeps: { noDiscovery: true, include: [] },
    server: {
      ...viteConfig.server,
      host: "127.0.0.1",
      port: 0,
      hmr: false,
      watch: null,
      preTransformRequests: false,
    },
  });

  await vite.listen();

  const address = vite.httpServer?.address();

  if (address === undefined || address === null || typeof address === "string") {
    throw new Error("Vite no pudo abrir el puerto de la prueba.");
  }

  frontendUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await vite?.close();
});

test.each(["/productos", "/pedidos"])(
  "redirige %s desde Vite a la API conservando la ruta",
  async (ruta) => {
    const responder = vi.fn(() => HttpResponse.json([]));

    server.use(
      http.get(`${frontendUrl}${ruta}`, () => passthrough()),
      http.get(`http://localhost:3000${ruta}`, responder),
    );

    const response = await fetch(`${frontendUrl}${ruta}`);

    expect(responder).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([]);
  },
);
