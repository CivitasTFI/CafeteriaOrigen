import { http, HttpResponse } from "msw";
import { expect, test, vi } from "vitest";
import { server } from "../mocks/server";

const handlersIniciales = server.listHandlers();

test("MSW intercepta una consulta de productos sin levantar la API", async () => {
  const responder = vi.fn(() => HttpResponse.json([]));

  server.use(http.get("http://localhost:3000/productos", responder));

  const response = await fetch("http://localhost:3000/productos");

  expect(responder).toHaveBeenCalledOnce();
  expect(response.status).toBe(200);
  await expect(response.json()).resolves.toEqual([]);
});

test("restaura los handlers iniciales antes de la siguiente prueba", () => {
  expect(server.listHandlers()).toEqual(handlersIniciales);
});
