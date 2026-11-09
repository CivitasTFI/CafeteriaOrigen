import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, expect, test } from "vitest";
import App from "../../App";
import { catalogoCompleto } from "../fixtures/productos";
import { pedidoApi, respuestaCrearPedidoApi } from "../fixtures/pedidos";
import { crearHandlerProductos, crearHandlerProductoPorId } from "../mocks/handlers";
import { server } from "../mocks/server";

const urlPedidos = new URL("/pedidos", window.location.origin).href;

beforeEach(() => {
  server.use(
    crearHandlerProductos(catalogoCompleto),
    crearHandlerProductoPorId(catalogoCompleto),
  );
});

afterEach(() => window.history.replaceState(null, "", "/"));

async function prepararPedido(usuario: UserEvent) {
  await usuario.click(await screen.findByRole("radio", { name: "Expreso" }));
  await usuario.click(screen.getByRole("radio", { name: "Mediano" }));
  await usuario.click(screen.getByRole("radio", { name: /Colombia/ }));
  const agregarCafe = screen.getByRole("button", { name: "Agregar café al carrito" });
  await usuario.click(agregarCafe);
  await usuario.click(agregarCafe);
  await usuario.click(screen.getByRole("button", { name: "Agregar Muffin de Chocolate" }));
}

test.each([
  { ruta: "/?mesa=4", encabezado: "mesa 4" },
  { ruta: "/?mesa=8", encabezado: "mesa 8" },
  { ruta: "/", encabezado: "retiro en barra" },
  { ruta: "/?mesa=abc", encabezado: "retiro en barra" },
  { ruta: "/?mesa=9", encabezado: "retiro en barra" },
  { ruta: "/?mesa=4&mesa=5", encabezado: "retiro en barra" },
])("App muestra $encabezado al abrir $ruta", ({ ruta, encabezado }) => {
  window.history.replaceState(null, "", ruta);
  render(<App />);
  const cabecera = screen.getByRole("banner");
  expect(within(cabecera).getByText(encabezado)).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
});

test.each([
  { caso: "mesa", ruta: "/?mesa=4", mesaId: 4 },
  { caso: "barra por mesa inválida", ruta: "/?mesa=9", mesaId: undefined },
])("confirma desde App para $caso usando únicamente IDs, cantidades y mesa opcional", async ({ ruta, mesaId }) => {
  const usuario = userEvent.setup();
  const solicitudes: unknown[] = [];
  window.history.replaceState(null, "", ruta);
  server.use(http.post(urlPedidos, async ({ request }) => {
    solicitudes.push(await request.json());
    return HttpResponse.json({
      ...respuestaCrearPedidoApi,
      pedido: { ...pedidoApi, id: 9, total: 12345, ...(mesaId === undefined ? {} : { mesaId }) },
    }, { status: 201 });
  }));
  render(<App />);
  await prepararPedido(usuario);
  expect(screen.getAllByRole("button", { name: "Confirmar pedido" })).toHaveLength(1);
  await usuario.click(screen.getByRole("button", { name: "Confirmar pedido" }));
  const confirmacion = await screen.findByRole("region", { name: "Pedido confirmado" });
  expect(within(confirmacion).getByText("Número de pedido: 9")).toBeInTheDocument();
  expect(within(confirmacion).getByText("Estado: pendiente")).toBeInTheDocument();
  expect(within(confirmacion).getByText("Total: $12.345")).toBeInTheDocument();
  expect(solicitudes).toEqual([{
    items: [{ productoId: 5, cantidad: 2 }, { productoId: 19, cantidad: 1 }],
    ...(mesaId === undefined ? {} : { mesaId }),
  }]);
  expect(screen.getByText("Tu carrito está vacio")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Confirmar pedido" })).toBeDisabled();
});

test("consulta desde la confirmación el ID recibido de API y conserva el pedido al navegar", async () => {
  const usuario = userEvent.setup();
  const consultas: string[] = [];
  server.use(
    http.post(urlPedidos, () => HttpResponse.json({
      ...respuestaCrearPedidoApi,
      pedido: { ...pedidoApi, id: 9 },
    }, { status: 201 })),
    http.get(`${urlPedidos}/9`, ({ request }) => {
      consultas.push(request.url);
      return HttpResponse.json({ ...pedidoApi, id: 9, estado: "en preparación" });
    }),
  );
  render(<App />);
  const pagina = screen.getByRole("main");
  await prepararPedido(usuario);
  await usuario.click(screen.getByRole("button", { name: "Confirmar pedido" }));
  await screen.findByRole("region", { name: "Pedido confirmado" });
  expect(consultas).toEqual([]);
  expect(screen.queryByLabelText("ID del pedido")).not.toBeInTheDocument();
  await usuario.click(screen.getByRole("button", { name: "Ver productos" }));
  await screen.findByRole("list", { name: "Productos del menú" });
  const confirmacion = screen.getByRole("region", { name: "Pedido confirmado" });
  await usuario.click(within(confirmacion).getByRole("button", { name: "Consultar estado" }));
  expect(await within(confirmacion).findByText("Estado actual: en preparación")).toBeInTheDocument();
  expect(consultas).toEqual([`${urlPedidos}/9`]);
  expect(screen.getByRole("main")).toBe(pagina);
});

test.each(["éxito", "rechazo"])("bloquea la edición durante el envío y la habilita después del %s", async (resultado) => {
  const usuario = userEvent.setup();
  let solicitudes = 0;
  let liberarRespuesta: (() => void) | undefined;
  const espera = new Promise<void>((resolve) => { liberarRespuesta = resolve; });
  server.use(http.post(urlPedidos, async () => {
    solicitudes++;
    await espera;
    return resultado === "éxito"
      ? HttpResponse.json(respuestaCrearPedidoApi, { status: 201 })
      : HttpResponse.json({ error: "Pedido rechazado" }, { status: 400 });
  }));
  render(<App />);
  await prepararPedido(usuario);
  try {
    await usuario.dblClick(screen.getByRole("button", { name: "Confirmar pedido" }));
    expect(await screen.findByRole("button", { name: "Enviando pedido..." })).toBeDisabled();
    for (const nombre of [
      "Agregar café al carrito", "Agregar Muffin de Chocolate",
      "Sumar Expreso Mediano Colombia", "Restar Expreso Mediano Colombia",
      "Eliminar Muffin de Chocolate", "Ver productos",
    ]) {
      const boton = screen.getByRole("button", { name: nombre });
      expect(boton).toBeDisabled();
      await usuario.click(boton);
    }
    expect(screen.getByRole("radio", { name: "Expreso" })).toBeDisabled();
    expect(screen.getByText("Cantidad: 2")).toBeInTheDocument();
    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
    await waitFor(() => expect(solicitudes).toBe(1));
  } finally {
    liberarRespuesta?.();
  }
  if (resultado === "éxito") {
    await screen.findByRole("region", { name: "Pedido confirmado" });
    expect(screen.getByText("Tu carrito está vacio")).toBeInTheDocument();
  } else {
    expect(await screen.findByRole("alert")).toHaveTextContent("Pedido rechazado");
    expect(screen.getByText("Subtotal orientativo: $17.220")).toBeInTheDocument();
  }
  expect(screen.getByRole("button", { name: "Agregar Muffin de Chocolate" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Ver productos" })).toBeEnabled();
});

test("conserva las cantidades ante un rechazo y permite reintentar el mismo pedido", async () => {
  const usuario = userEvent.setup();
  const solicitudes: unknown[] = [];
  server.use(http.post(urlPedidos, async ({ request }) => {
    solicitudes.push(await request.json());
    return solicitudes.length === 1
      ? HttpResponse.json({ error: "Pedido rechazado" }, { status: 400 })
      : HttpResponse.json(respuestaCrearPedidoApi, { status: 201 });
  }));
  render(<App />);
  await prepararPedido(usuario);
  await usuario.click(screen.getByRole("button", { name: "Confirmar pedido" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Pedido rechazado");
  expect(screen.getByText("Cantidad: 2")).toBeInTheDocument();
  expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Pedido confirmado" })).not.toBeInTheDocument();
  await usuario.click(screen.getByRole("button", { name: "Confirmar pedido" }));
  await screen.findByRole("region", { name: "Pedido confirmado" });
  expect(solicitudes).toHaveLength(2);
  expect(solicitudes[1]).toEqual(solicitudes[0]);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByText("Tu carrito está vacio")).toBeInTheDocument();
});

test("cada confirmación sigue su propio ID y un error de seguimiento conserva el nuevo carrito", async () => {
  const usuario = userEvent.setup();
  let creaciones = 0;
  const consultas: string[] = [];
  server.use(
    http.post(urlPedidos, () => {
      const id = 9 + creaciones++;
      return HttpResponse.json({
        ...respuestaCrearPedidoApi,
        pedido: id === 9
          ? { ...pedidoApi, id }
          : { ...pedidoApi, id, items: [{ productoId: 19, cantidad: 1 }], total: 2500 },
      }, { status: 201 });
    }),
    http.get(`${urlPedidos}/:id`, ({ params }) => {
      consultas.push(String(params.id));
      return consultas.length === 2
        ? HttpResponse.json({ error: "No se pudo consultar el pedido" }, { status: 500 })
        : HttpResponse.json({ ...pedidoApi, id: Number(params.id), estado: params.id === "9" ? "en preparación" : "completado" });
    }),
  );
  render(<App />);
  await prepararPedido(usuario);
  await usuario.click(screen.getByRole("button", { name: "Confirmar pedido" }));
  await screen.findByText("Número de pedido: 9");
  await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
  await screen.findByText("Estado actual: en preparación");
  await usuario.click(screen.getByRole("button", { name: "Agregar Muffin de Chocolate" }));
  await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
  await screen.findByRole("alert");
  expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  expect(screen.getByText("Subtotal orientativo: $2.500")).toBeInTheDocument();
  await usuario.click(screen.getByRole("button", { name: "Confirmar pedido" }));
  await screen.findByText("Número de pedido: 10");
  expect(screen.queryByText("Número de pedido: 9")).not.toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.queryByText("Estado actual: en preparación")).not.toBeInTheDocument();
  await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
  await screen.findByText("Estado actual: completado");
  expect(consultas).toEqual(["9", "9", "10"]);
});
