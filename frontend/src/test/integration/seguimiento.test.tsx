
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, delay } from "msw";
import { expect, test } from "vitest";
import SeguimientoPedido from "../../components/pedidos/SeguimientoPedido";
import { pedidoApi } from "../fixtures/pedidos";
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