import { render, screen, waitFor } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";
import { CarritoProvider } from "../../context/CarritoContext";
import { useCarrito } from "../../hooks/useCarrito";
import ConfirmarPedido from "../../components/pedidos/ConfirmarPedido";
import { cafeApi, pasteleriaApi } from "../fixtures/productos";
import { respuestaCrearPedidoApi, respuestaCrearPedidoConMesaApi } from "../fixtures/pedidos";
import { crearHandlerCreacionPedido } from "../mocks/handlers";
import { server } from "../mocks/server";

const urlPedidos = new URL("/pedidos", window.location.origin).href;

function PrepararCarrito() {
  const { agregarProducto } = useCarrito();
  return <>
    <button onClick={() => agregarProducto(cafeApi)}>Agregar café</button>
    <button onClick={() => agregarProducto(pasteleriaApi)}>Agregar pastelería</button>
  </>;
}

function EstadoCarrito() {
  const { items } = useCarrito();
  return <output aria-label="Contenido del carrito">{JSON.stringify(items)}</output>;
}

function renderizarConfirmacion(mesaId?: number) {
  render(<CarritoProvider>
    <PrepararCarrito />
    <ConfirmarPedido mesaId={mesaId} />
    <EstadoCarrito />
  </CarritoProvider>);
}

async function cargarCarrito(usuario: UserEvent) {
  await usuario.click(screen.getByRole("button", { name: "Agregar café" }));
  await usuario.click(screen.getByRole("button", { name: "Agregar café" }));
  await usuario.click(screen.getByRole("button", { name: "Agregar pastelería" }));
}

function contenidoCarrito() {
  return screen.getByLabelText("Contenido del carrito").textContent;
}

const botonConfirmar = () => screen.getByRole("button", { name: "Confirmar pedido" });

test.each([
  { caso: "barra", mesaId: undefined, respuesta: respuestaCrearPedidoApi },
  { caso: "mesa 4", mesaId: 4, respuesta: respuestaCrearPedidoConMesaApi },
])("envía únicamente ítems y mesa opcional para $caso", async ({ mesaId, respuesta }) => {
  const usuario = userEvent.setup();
  const solicitudes: unknown[] = [];
  server.use(http.post(urlPedidos, async ({ request }) => {
    solicitudes.push(await request.json());
    return HttpResponse.json(respuesta, { status: 201 });
  }));
  renderizarConfirmacion(mesaId);
  await cargarCarrito(usuario);
  await usuario.click(botonConfirmar());
  await screen.findByRole("heading", { name: "Pedido confirmado" });
  expect(solicitudes).toEqual([{
    items: [{ productoId: 5, cantidad: 2 }, { productoId: 19, cantidad: 1 }],
    ...(mesaId === undefined ? {} : { mesaId }),
  }]);
});

test("impide enviar un carrito vacío sin hacer peticiones", async () => {
  const usuario = userEvent.setup();
  let solicitudes = 0;
  server.use(http.post(urlPedidos, () => {
    solicitudes++;
    return HttpResponse.json(respuestaCrearPedidoApi, { status: 201 });
  }));
  renderizarConfirmacion();
  expect(botonConfirmar()).toBeDisabled();
  await usuario.click(botonConfirmar());
  expect(solicitudes).toBe(0);
  expect(contenidoCarrito()).toBe("[]");
});

test("bloquea envíos repetidos y conserva el carrito hasta recibir éxito", async () => {
  const usuario = userEvent.setup();
  let solicitudes = 0;
  let liberarRespuesta: (() => void) | undefined;
  const espera = new Promise<void>((resolve) => { liberarRespuesta = resolve; });
  server.use(http.post(urlPedidos, async () => {
    solicitudes++;
    await espera;
    return HttpResponse.json(respuestaCrearPedidoApi, { status: 201 });
  }));
  renderizarConfirmacion();
  await cargarCarrito(usuario);
  const carritoInicial = contenidoCarrito();
  try {
    await usuario.dblClick(botonConfirmar());
    const enviando = await screen.findByRole("button", { name: "Enviando pedido..." });
    expect(enviando).toBeDisabled();
    expect(contenidoCarrito()).toBe(carritoInicial);
    await usuario.click(enviando);
    await waitFor(() => expect(solicitudes).toBe(1));
  } finally {
    liberarRespuesta?.();
  }
  await screen.findByRole("heading", { name: "Pedido confirmado" });
  expect(botonConfirmar()).toBeDisabled();
  expect(contenidoCarrito()).toBe("[]");
});

test("muestra el ID, estado y total de API aunque difieran del subtotal local", async () => {
  const usuario = userEvent.setup();
  server.use(crearHandlerCreacionPedido({
    ...respuestaCrearPedidoApi,
    pedido: { ...respuestaCrearPedidoApi.pedido, id: 9, estado: "en preparación", total: 12345 },
  }));
  renderizarConfirmacion();
  await cargarCarrito(usuario);
  await usuario.click(botonConfirmar());
  expect(await screen.findByText("Número de pedido: 9")).toBeInTheDocument();
  expect(screen.getByText("Estado: en preparación")).toBeInTheDocument();
  expect(screen.getByText("Total: $12.345")).toBeInTheDocument();
});

test("vacía el carrito únicamente después de crear el pedido", async () => {
  const usuario = userEvent.setup();
  server.use(crearHandlerCreacionPedido(respuestaCrearPedidoApi));
  renderizarConfirmacion();
  await cargarCarrito(usuario);
  expect(contenidoCarrito()).not.toBe("[]");
  await usuario.click(botonConfirmar());
  await screen.findByRole("heading", { name: "Pedido confirmado" });
  expect(contenidoCarrito()).toBe("[]");
});

test.each([
  { caso: "rechazo 400", responder: () => HttpResponse.json({ error: "Mesa inexistente" }, { status: 400 }), mensaje: "Mesa inexistente" },
  { caso: "error 500", responder: () => HttpResponse.json({ error: "Error interno del servidor" }, { status: 500 }), mensaje: "Error interno del servidor" },
  { caso: "API caída", responder: () => HttpResponse.error(), mensaje: "No se pudo conectar con el servidor" },
  { caso: "respuesta exitosa incompatible", responder: () => HttpResponse.json({ mensaje: "ok" }, { status: 201 }), mensaje: "La respuesta del servidor no tiene el formato esperado" },
  { caso: "JSON incompleto", responder: () => new HttpResponse('{"mensaje":', { status: 201, headers: { "Content-Type": "application/json" } }), mensaje: "No se pudo interpretar la respuesta del servidor" },
])("muestra $caso sin perder ítems ni cantidades", async ({ responder, mensaje }) => {
  const usuario = userEvent.setup();
  server.use(http.post(urlPedidos, responder));
  renderizarConfirmacion();
  await cargarCarrito(usuario);
  const carritoInicial = contenidoCarrito();
  await usuario.click(botonConfirmar());
  expect(await screen.findByRole("alert")).toHaveTextContent(mensaje);
  expect(contenidoCarrito()).toBe(carritoInicial);
  expect(botonConfirmar()).toBeEnabled();
  expect(screen.queryByRole("heading", { name: "Pedido confirmado" })).not.toBeInTheDocument();
});

test("permite reintentar después de un rechazo y limpia el error tras el éxito", async () => {
  const usuario = userEvent.setup();
  let solicitudes = 0;
  server.use(http.post(urlPedidos, () => ++solicitudes === 1
    ? HttpResponse.json({ error: "Pedido rechazado" }, { status: 400 })
    : HttpResponse.json(respuestaCrearPedidoApi, { status: 201 })));
  renderizarConfirmacion();
  await cargarCarrito(usuario);
  await usuario.click(botonConfirmar());
  await screen.findByRole("alert");
  await usuario.click(botonConfirmar());
  await screen.findByRole("heading", { name: "Pedido confirmado" });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(contenidoCarrito()).toBe("[]");
  expect(solicitudes).toBe(2);
});

test("no presenta una confirmación anterior como resultado de un nuevo envío fallido", async () => {
  const usuario = userEvent.setup();
  server.use(crearHandlerCreacionPedido(respuestaCrearPedidoApi));
  renderizarConfirmacion();
  await cargarCarrito(usuario);
  await usuario.click(botonConfirmar());
  await screen.findByRole("heading", { name: "Pedido confirmado" });
  await cargarCarrito(usuario);
  const carritoInicial = contenidoCarrito();
  server.use(http.post(urlPedidos, () => HttpResponse.json({ error: "Pedido rechazado" }, { status: 400 })));
  await usuario.click(botonConfirmar());
  await screen.findByRole("alert");
  expect(screen.queryByRole("heading", { name: "Pedido confirmado" })).not.toBeInTheDocument();
  expect(contenidoCarrito()).toBe(carritoInicial);
});
