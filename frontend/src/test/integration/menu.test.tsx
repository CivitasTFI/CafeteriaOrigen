import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import MenuPage from "../../pages/MenuPage";
import { erroresApi } from "../fixtures/errores";
import { productosApi } from "../fixtures/productos";
import { crearHandlerError, crearHandlerProductos } from "../mocks/handlers";
import { server } from "../mocks/server";

test("muestra un indicador accesible al iniciar la carga del menú", () => {
  server.use(crearHandlerProductos(productosApi));

  render(<MenuPage />);

  expect(screen.getByRole("status")).toHaveTextContent("Cargando menú");
});

test("muestra los productos recibidos de la API y deja de mostrar la carga", async () => {
  server.use(crearHandlerProductos(productosApi));

  render(<MenuPage />);

  for (const producto of productosApi) {
    expect(await screen.findByText(producto.nombre)).toBeInTheDocument();
  }

  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("muestra el error de la API y deja de mostrar la carga ante un 500", async () => {
  server.use(crearHandlerError("/productos", erroresApi.errorInterno, 500));

  render(<MenuPage />);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    erroresApi.errorInterno.error,
  );
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
