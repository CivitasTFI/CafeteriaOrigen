import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, expect, test } from "vitest";
import MenuPage from "../../pages/MenuPage";
import { CarritoProvider } from "../../context/CarritoContext";
import { erroresApi } from "../fixtures/errores";
import { catalogoPrueba, productosApi } from "../fixtures/productos";
import {
  crearHandlerBuscarProductos,
  crearHandlerError,
  crearHandlerProductos,
} from "../mocks/handlers";
import { server } from "../mocks/server";

const urlProductos = new URL("/productos", window.location.origin).href;

function renderMenu() {
  return render(
    <CarritoProvider>
      <MenuPage />
    </CarritoProvider>,
  );
}

beforeEach(() => {
  server.use(
    crearHandlerProductos(productosApi),
    crearHandlerBuscarProductos(catalogoPrueba),
  );
});

test("muestra un indicador accesible al iniciar la carga del menú", () => {
  server.use(crearHandlerProductos(productosApi));

  renderMenu();

  expect(screen.getByRole("status")).toHaveTextContent("Cargando menú");
});

test("muestra el selector de café y pastelería cuando el menú está listo", async () => {
  renderMenu();

  expect(await screen.findByRole("heading", { name: "Café" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Pastelería" })).toBeInTheDocument();
  expect(await screen.findByText("$2.500")).toBeInTheDocument();
});

test("muestra el error de la API y deja de mostrar la carga ante un 500", async () => {
  server.use(crearHandlerError("/productos", erroresApi.errorInterno, 500));

  renderMenu();

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

    renderMenu();

    expect(await screen.findByRole("alert")).toHaveTextContent(mensaje);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Café" }),
    ).not.toBeInTheDocument();

    server.use(
      crearHandlerProductos(productosApi),
      crearHandlerBuscarProductos(catalogoPrueba),
    );
    await usuario.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByRole("heading", { name: "Café" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  },
);
