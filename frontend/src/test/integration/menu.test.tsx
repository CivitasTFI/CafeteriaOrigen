import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";
import MenuPage from "../../pages/MenuPage";
import { erroresApi } from "../fixtures/errores";
import { productosApi } from "../fixtures/productos";
import { crearHandlerError, crearHandlerProductos } from "../mocks/handlers";
import { server } from "../mocks/server";

const urlProductos = new URL("/productos", window.location.origin).href;

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

test.each([
  {
    caso: "un error 500",
    handler: crearHandlerError("/productos", erroresApi.errorInterno, 500),
    mensaje: erroresApi.errorInterno.error,
  },
  {
    caso: "un fallo de conexión",
    handler: http.get(urlProductos, () => HttpResponse.error()),
    mensaje: "No se pudo conectar con el servidor",
  },
  {
    caso: "un precio textual en la respuesta",
    handler: http.get(urlProductos, () =>
      HttpResponse.json([
        productosApi[0],
        { ...productosApi[1], precio: "2500" },
      ]),
    ),
    mensaje: "La respuesta del servidor no tiene el formato esperado",
  },
])(
  "permite recuperar el menú al reintentar después de $caso",
  async ({ handler, mensaje }) => {
    const usuario = userEvent.setup();
    server.use(handler);

    render(<MenuPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(mensaje);
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
  },
);
