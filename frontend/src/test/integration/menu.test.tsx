import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import MenuPage from "../../pages/MenuPage";
import { productosApi } from "../fixtures/productos";
import { crearHandlerProductos } from "../mocks/handlers";
import { server } from "../mocks/server";

test("muestra un indicador accesible al iniciar la carga del menú", () => {
  server.use(crearHandlerProductos(productosApi));

  render(<MenuPage />);

  expect(screen.getByRole("status")).toHaveTextContent("Cargando menú");
});
