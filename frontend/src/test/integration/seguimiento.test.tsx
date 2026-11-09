
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";
import SeguimientoPedido from "../../components/pedidos/SeguimientoPedido";
import { pedidoApi } from "../fixtures/pedidos";
import { erroresApi } from "../fixtures/errores";
import { server } from "../mocks/server";

const URLpedido = new URL(
    `/pedidos/${pedidoApi.id}`,
    window.location.origin
).href;

test("consulta y muestra el estado de un pedido por su ID", async () => {
    const usuario = userEvent.setup();

    server.use(
        http.get(URLpedido, () => {
            return HttpResponse.json(pedidoApi);
        })
    );

    render(<SeguimientoPedido />);

    await usuario.type(
        screen.getByLabelText("ID del pedido"),
        "1"
    );

    await usuario.click(
        screen.getByRole("button", { name: "Consultar estado" })
    );

    expect(await screen.findByText("Estado: pendiente"))
        .toBeInTheDocument();

    expect(screen.getByText("Pedido: 1"))
        .toBeInTheDocument();
});

test("muestra un indicador de carga mientras consulta el pedido", async () => {
    const usuario = userEvent.setup();
    let liberarRespuesta: (() => void) | undefined;
    const espera = new Promise<void>((resolve) => { liberarRespuesta = resolve; });

    server.use(
        http.get(URLpedido, async () => {
            await espera;

            return HttpResponse.json(pedidoApi);
        })
    );

    render(<SeguimientoPedido />);

    await usuario.type(
        screen.getByLabelText("ID del pedido"),
        "1"
    );

    try {
        await usuario.click(
            screen.getByRole("button", { name: "Consultar estado" })
        );
        expect(screen.getByRole("status"))
            .toHaveTextContent("Consultando pedido");
        expect(screen.getByRole("button", { name: "Consultar estado" })).toBeDisabled();
    } finally {
        liberarRespuesta?.();
    }

    expect(await screen.findByText("Estado: pendiente"))
        .toBeInTheDocument();

    expect(screen.queryByRole("status"))
        .not.toBeInTheDocument();
});

test("muestra un error cuando el pedido no existe", async () => {
    const usuario = userEvent.setup();

    server.use(
        http.get(URLpedido, () => {
            return HttpResponse.json(
                erroresApi.pedidoNoEncontrado,
                { status: 404 }
            );
        })
    );

    render(<SeguimientoPedido />);

    await usuario.type(
        screen.getByLabelText("ID del pedido"),
        "1"
    );

    await usuario.click(
        screen.getByRole("button", { name: "Consultar estado" })
    );

    expect(await screen.findByRole("alert"))
        .toHaveTextContent(
            "No se encontró un pedido con ese ID"
        );
});

test("permite consultar directamente el pedido confirmado sin ingresar un ID", async () => {
    const usuario = userEvent.setup();
    let solicitudes = 0;
    server.use(http.get(new URL("/pedidos/9", window.location.origin).href, () => {
        solicitudes++;
        return HttpResponse.json({ ...pedidoApi, id: 9, estado: "en preparación" });
    }));
    render(<SeguimientoPedido pedidoId={9} />);
    expect(screen.queryByLabelText("ID del pedido")).not.toBeInTheDocument();
    await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
    expect(await screen.findByText("Estado actual: en preparación")).toBeInTheDocument();
    expect(solicitudes).toBe(1);
});

test.each([
    { caso: "error 500", responder: () => HttpResponse.json({ error: "Error interno del servidor" }, { status: 500 }), mensaje: "Error interno del servidor" },
    { caso: "API caída", responder: () => HttpResponse.error(), mensaje: "No se pudo conectar con el servidor" },
    { caso: "contrato incompatible", responder: () => HttpResponse.json({ id: "incorrecto" }), mensaje: "La respuesta del servidor no tiene el formato esperado" },
    { caso: "JSON inválido", responder: () => new HttpResponse('{"id":', { headers: { "Content-Type": "application/json" } }), mensaje: "No se pudo interpretar la respuesta del servidor" },
])("muestra $caso y permite reintentar sin perder el ID", async ({ responder, mensaje }) => {
    const usuario = userEvent.setup();
    server.use(http.get(URLpedido, responder));
    render(<SeguimientoPedido />);
    await usuario.type(screen.getByLabelText("ID del pedido"), "1");
    await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(mensaje);
    expect(screen.getByLabelText("ID del pedido")).toHaveValue(1);
    expect(screen.getByRole("button", { name: "Consultar estado" })).toBeEnabled();
    server.use(http.get(URLpedido, () => HttpResponse.json(pedidoApi)));
    await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
    expect(await screen.findByText("Estado: pendiente")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("rechaza IDs fuera del rango de enteros seguros sin consultar la API", async () => {
    const usuario = userEvent.setup();
    let solicitudes = 0;
    server.use(http.get(new URL("/pedidos/:id", window.location.origin).href, () => {
        solicitudes++;
        return HttpResponse.json(pedidoApi);
    }));
    render(<SeguimientoPedido />);
    await usuario.type(screen.getByLabelText("ID del pedido"), "9007199254740992");
    await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Ingresá un ID válido");
    expect(solicitudes).toBe(0);
});

test("bloquea consultas repetidas incluso si se vuelve a enviar el formulario", async () => {
    const usuario = userEvent.setup();
    let solicitudes = 0;
    let liberarRespuesta: (() => void) | undefined;
    const espera = new Promise<void>((resolve) => { liberarRespuesta = resolve; });
    server.use(http.get(URLpedido, async () => {
        solicitudes++;
        await espera;
        return HttpResponse.json(pedidoApi);
    }));
    render(<SeguimientoPedido />);
    const entrada = screen.getByLabelText("ID del pedido");
    await usuario.type(entrada, "1");
    const formulario = entrada.closest("form");
    if (formulario === null) throw new Error("Falta el formulario de seguimiento");
    try {
        await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
        await screen.findByRole("status");
        fireEvent.submit(formulario);
        await waitFor(() => expect(solicitudes).toBe(1));
        expect(entrada).toBeDisabled();
    } finally {
        liberarRespuesta?.();
    }
    await screen.findByText("Estado: pendiente");
    expect(solicitudes).toBe(1);
});

test("actualiza el estado en cada consulta y oculta resultados anteriores ante errores", async () => {
    const usuario = userEvent.setup();
    let solicitudes = 0;
    server.use(http.get(URLpedido, () => {
        solicitudes++;
        return solicitudes === 3
            ? HttpResponse.json(erroresApi.pedidoNoEncontrado, { status: 404 })
            : HttpResponse.json({ ...pedidoApi, estado: solicitudes === 1 ? "pendiente" : "completado" });
    }));
    render(<SeguimientoPedido />);
    await usuario.type(screen.getByLabelText("ID del pedido"), "1");
    await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
    await screen.findByText("Estado: pendiente");
    await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
    await screen.findByText("Estado: completado");
    expect(screen.queryByText("Estado: pendiente")).not.toBeInTheDocument();
    await usuario.click(screen.getByRole("button", { name: "Consultar estado" }));
    await screen.findByRole("alert");
    expect(screen.queryByText("Estado: completado")).not.toBeInTheDocument();
});
