import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import App from "../../App";
import { catalogoPrueba, productosApi } from "../fixtures/productos";
import {
  crearHandlerBuscarProductos,
  crearHandlerProductos,
} from "../mocks/handlers";
import { server } from "../mocks/server";

beforeEach(() => {
  server.use(
    crearHandlerProductos(productosApi),
    crearHandlerBuscarProductos(catalogoPrueba),
  );
});

test.each([
  "permite montar App en el DOM y consultar su encabezado",
  "mantiene el DOM aislado al montar App en otra prueba",
])("%s", () => {
  render(<App />);

  const encabezado = screen.getByRole("heading", {
    name: "Cafetería Origen",
    level: 1,
  });

  expect(encabezado).toBeInTheDocument();
});

test("carga el menú interactivo al montar la aplicación", async () => {
  render(<App />);

  expect(await screen.findByRole("heading", { name: "Café" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Pastelería" })).toBeInTheDocument();
  expect(await screen.findByText("$2.500")).toBeInTheDocument();
  expect(screen.queryByText("Cargando menú...")).not.toBeInTheDocument();
});
