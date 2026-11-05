import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
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

test("permite reintentar después de un error 500 y muestra los productos al recuperarse la API", async () => {
  const usuario = userEvent.setup();
  server.use(crearHandlerError("/productos", erroresApi.errorInterno, 500));

  render(<MenuPage />);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    erroresApi.errorInterno.error,
  );

  server.use(crearHandlerProductos(productosApi));
  await usuario.click(screen.getByRole("button", { name: "Reintentar" }));

  for (const producto of productosApi) {
    expect(await screen.findByText(producto.nombre)).toBeInTheDocument();
  }

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("informa el fallo de conexión y permite recuperar el menú al reintentar", async () => {
  const usuario = userEvent.setup();
  const url = new URL("/productos", window.location.origin).href;
  server.use(http.get(url, () => HttpResponse.error()));

  render(<MenuPage />);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "No se pudo conectar con el servidor",
  );
  expect(screen.queryByRole("status")).not.toBeInTheDocument();

  server.use(crearHandlerProductos(productosApi));
  await usuario.click(screen.getByRole("button", { name: "Reintentar" }));

  for (const producto of productosApi) {
    expect(await screen.findByText(producto.nombre)).toBeInTheDocument();
  }

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("rechaza productos con un precio textual y permite recuperar el menú al reintentar", async () => {
  const usuario = userEvent.setup();
  const url = new URL("/productos", window.location.origin).href;
  const productosInvalidos = [
    productosApi[0],
    { ...productosApi[1], precio: "2500" },
  ];
  server.use(http.get(url, () => HttpResponse.json(productosInvalidos)));

  render(<MenuPage />);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "La respuesta del servidor no tiene el formato esperado",
  );
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("list", { name: "Productos del menú" }),
  ).not.toBeInTheDocument();

  server.use(crearHandlerProductos(productosApi));
  await usuario.click(screen.getByRole("button", { name: "Reintentar" }));

  for (const producto of productosApi) {
    expect(await screen.findByText(producto.nombre)).toBeInTheDocument();
  }

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
