import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import App from "../../App";
import { catalogoCompleto } from "../fixtures/productos";
import {
  crearHandlerBuscarProductos,
  crearHandlerProductoPorId,
  crearHandlerProductos,
} from "../mocks/handlers";
import { server } from "../mocks/server";

beforeEach(() => {
  server.use(
    crearHandlerProductos(catalogoCompleto),
    crearHandlerProductoPorId(catalogoCompleto),
    crearHandlerBuscarProductos(catalogoCompleto),
  );
});

test("monta App con un único encabezado principal accesible", () => {
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
  expect(screen.queryByText("Cargando menú...")).not.toBeInTheDocument();
});

test("navega a Ver productos y muestra el listado completo", async () => {
  const usuario = userEvent.setup();
  render(<App />);

  await usuario.click(screen.getByRole("button", { name: "Ver productos" }));

  const listado = await screen.findByRole("list", {
    name: "Productos del menú",
  });
  expect(within(listado).getAllByRole("listitem")).toHaveLength(20);
});

test("navega a Buscar productos y consulta la API de búsqueda", async () => {
  const usuario = userEvent.setup();
  render(<App />);

  await usuario.click(screen.getByRole("button", { name: "Buscar productos" }));
  await usuario.selectOptions(screen.getByLabelText("Tipo de producto"), "pasteleria");
  await usuario.click(screen.getByRole("button", { name: "Buscar" }));

  const resultados = await screen.findByRole("list", {
    name: "Resultados de búsqueda",
  });
  expect(within(resultados).getAllByRole("listitem")).toHaveLength(2);
});
