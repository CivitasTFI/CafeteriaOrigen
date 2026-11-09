import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, expect, test } from "vitest";
import MenuPage from "../../pages/MenuPage";
import VerProductosPage from "../../pages/VerProductosPage";
import { CarritoProvider } from "../../context/CarritoContext";
import { erroresApi } from "../fixtures/errores";
import { catalogoCompleto } from "../fixtures/productos";
import {
  crearHandlerError,
  crearHandlerProductoPorId,
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

function renderVerProductos() {
  return render(
    <CarritoProvider>
      <VerProductosPage />
    </CarritoProvider>,
  );
}

beforeEach(() => {
  server.use(
    crearHandlerProductos(catalogoCompleto),
    crearHandlerProductoPorId(catalogoCompleto),
  );
});

test("muestra un indicador accesible al iniciar la carga del menú", () => {
  server.use(crearHandlerProductos(catalogoCompleto));

  renderMenu();

  expect(screen.getByRole("status")).toHaveTextContent("Cargando menú");
});

test("muestra selector y pastelería cuando el menú está listo", async () => {
  renderMenu();

  expect(await screen.findByRole("heading", { name: "Café" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Pastelería" })).toBeInTheDocument();
  const pasteleria = screen.getByRole("heading", { name: "Pastelería" });
  const seccionPasteleria = pasteleria.closest("section") ?? pasteleria.parentElement;
  expect(seccionPasteleria).not.toBeNull();
  expect(within(seccionPasteleria as HTMLElement).getByText("Torta Selva Negra")).toBeInTheDocument();
});

test("muestra el catálogo y el detalle en la vista Ver productos", async () => {
  const usuario = userEvent.setup();
  renderVerProductos();

  const listado = await screen.findByRole("list", {
    name: "Productos del menú",
  });
  expect(within(listado).getAllByRole("listitem")).toHaveLength(20);
  expect(
    screen.getByRole("heading", { name: "Detalle de producto" }),
  ).toBeInTheDocument();

  await usuario.selectOptions(screen.getByRole("combobox", {
    name: "Elegir producto por ID",
  }), "20");

  const detalle = screen.getByRole("region", { name: "Detalle de producto" });
  expect(within(detalle).getByText("Torta Selva Negra")).toBeInTheDocument();
  expect(within(detalle).getByText("$4.200")).toBeInTheDocument();
});

test("no consulta un ID inventado ni muestra detalle cuando el catálogo está vacío", async () => {
  const solicitudesDetalle: string[] = [];
  server.use(
    crearHandlerProductos([]),
    http.get(new URL("/productos/:id", window.location.origin).href, ({ request }) => {
      solicitudesDetalle.push(request.url);
      return HttpResponse.json(catalogoCompleto[0]);
    }),
  );

  renderVerProductos();

  expect(await screen.findByText("No hay productos disponibles en el catálogo.")).toBeInTheDocument();
  expect(screen.queryByRole("combobox", { name: "Elegir producto por ID" })).not.toBeInTheDocument();
  expect(screen.queryByText("Expreso Pocillo Brasil")).not.toBeInTheDocument();
  expect(solicitudesDetalle).toEqual([]);
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
        catalogoCompleto[0],
        { ...catalogoCompleto[18], precio: "2500" },
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
      crearHandlerProductos(catalogoCompleto),
      crearHandlerProductoPorId(catalogoCompleto),
    );
    await usuario.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByRole("heading", { name: "Café" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  },
);
