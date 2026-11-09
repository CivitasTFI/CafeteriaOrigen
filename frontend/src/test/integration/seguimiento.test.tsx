
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, delay } from "msw";
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

    server.use(
        http.get(URLpedido, async () => {
            await delay(150);

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

    expect(screen.getByRole("status"))
        .toHaveTextContent("Consultando pedido");

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
