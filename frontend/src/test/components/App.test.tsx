import { render, screen, within } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import App from "../../App";
import { productosApi } from "../fixtures/productos";
import { crearHandlerProductos } from "../mocks/handlers";
import { server } from "../mocks/server";

beforeEach(() => {
  server.use(crearHandlerProductos(productosApi));
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

test("carga y muestra los productos de la API al montar la aplicación", async () => {
  render(<App />);

  const listado = await screen.findByRole("list", {
    name: "Productos del menú",
  });

  for (const producto of productosApi) {
    expect(within(listado).getByText(producto.nombre)).toBeInTheDocument();
  }

  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
