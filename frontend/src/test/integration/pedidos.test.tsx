import {render, screen, waitFor} from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import {http, HttpResponse, delay} from "msw";
import {expect, test} from "vitest";
import { CarritoProvider } from "../../context/CarritoContext";
import { useCarrito } from "../../hooks/useCarrito";
import ConfirmarPedido from "../../components/pedidos/ConfirmarPedido";
import { cafeApi, pasteleriaApi } from "../fixtures/productos";
import {
    respuestaCrearPedidoApi,
    respuestaCrearPedidoConMesaApi
} from "../fixtures/pedidos";
import {server} from "../mocks/server";

const URLpedidos = new URL("/pedidos", window.location.origin).href;

function PrepararCarrito(){
    const {agregarProducto} = useCarrito();

    return(
        <>
            <button onClick={() => agregarProducto(cafeApi)}>
                Agregar café
            </button>
            <button onClick={() => agregarProducto(pasteleriaApi)}>
                Agregar pastelería
            </button>
        </>
    );
}

function EstadoCarrito() {
    const { items } = useCarrito();

    return (
        <span data-testid="items-carrito">
            {items.length}
        </span>
    );
}

function renderizarConfirmacion(mesaId?: number){
    render(
        <CarritoProvider>
            <PrepararCarrito />
            <ConfirmarPedido mesaId={mesaId} />
            <EstadoCarrito />
        </CarritoProvider>
    );
}

async function cargarCarrito(usuario: ReturnType<typeof userEvent.setup>){
    await usuario.click(screen.getByRole("button", {name: "Agregar café"}));
    await usuario.click(screen.getByRole("button", {name: "Agregar café"}));
    await usuario.click(screen.getByRole("button", {name: "Agregar pastelería"}));
}

test.each([
    {
        caso: "barra",
        mesaId: undefined,
        respuesta: respuestaCrearPedidoApi,
        cuerpoEsperado: {
            items: [
                { productoId: 5, cantidad: 2 },
                { productoId: 19, cantidad: 1 },
            ],
        },
    },
    {
        caso: "mesa 4",
        mesaId: 4,
        respuesta: respuestaCrearPedidoConMesaApi,
        cuerpoEsperado: {
            mesaId: 4,
            items: [
                { productoId: 5, cantidad: 2 },
                { productoId: 19, cantidad: 1 },
            ],
        },
    },
])(
    "envía los items y la mesa para confirmar un pedido para $caso",
    async ({mesaId, respuesta, cuerpoEsperado}) => {
        const usuario = userEvent.setup();
        const solicitudes: unknown[] = [];

        server.use(
            http.post(URLpedidos, async ({ request }) => {
                solicitudes.push(await request.json());

                return HttpResponse.json(respuesta, { status: 201 });
            })
        );

        renderizarConfirmacion(mesaId);

        await cargarCarrito(usuario);

        await usuario.click(
            screen.getByRole("button", { name: "Confirmar pedido" })
        );

        await waitFor(() => {
            expect(solicitudes).toHaveLength(1);
        });

        expect(solicitudes[0]).toEqual(cuerpoEsperado);
    }    
);

test("muestra la carga y bloquea confirmaciones repetidas durante el envío", async () => {
    const usuario = userEvent.setup();
    let cantidadSolicitudes = 0;

    server.use(
        http.post(URLpedidos, async () => {
            cantidadSolicitudes++;

            await delay(150);

            return HttpResponse.json(respuestaCrearPedidoApi, {
                status: 201,
            });
        })
    )

    renderizarConfirmacion();

    await cargarCarrito(usuario);

    await usuario.click(
        screen.getByRole("button", { name: "Confirmar pedido" })
    );

    const botonEnviado = await screen.findByRole("button", { name: "Enviando pedido...", });

    expect(botonEnviado).toBeDisabled();

    await usuario.click(botonEnviado);

    await waitFor(() => {
        expect(
            screen.getByRole("button", { name: "Confirmar pedido" })
        ).toBeEnabled();
    });

    expect(cantidadSolicitudes).toBe(1);
})

test("muestra la información del pedido creado", async () => {
    const usuario = userEvent.setup();

    server.use(
        http.post(URLpedidos, async () => {
            console.log("POST ejecutado");
            return HttpResponse.json(
                respuestaCrearPedidoApi,
                { status: 201 }
            );
        })
    );

    renderizarConfirmacion();

    await cargarCarrito(usuario);

    await usuario.click(
        screen.getByRole("button", {
            name: "Confirmar pedido",
        })
    );

    screen.debug();

    expect(
        await screen.findByText(/id:\s*1/)
    ).toBeInTheDocument();

    expect(
        screen.getByText(/estado:\s*pendiente/i)
    ).toBeInTheDocument();

    expect(
        screen.getByText(/total:\s*17220/i)
    ).toBeInTheDocument();
});

test("vacía el carrito después de crear correctamente el pedido", async () => {
    const usuario = userEvent.setup();

    server.use(
        http.post(URLpedidos, () => {
            return HttpResponse.json(
                respuestaCrearPedidoApi,
                { status: 201 }
            );
        })
    );

    renderizarConfirmacion();

    await cargarCarrito(usuario);

    expect(screen.getByTestId("items-carrito"))
        .toHaveTextContent("2");

    await usuario.click(
        screen.getByRole("button", {
            name: "Confirmar pedido",
        })
    );

    await screen.findByText(/id:\s*1/);

    expect(screen.getByTestId("items-carrito"))
        .toHaveTextContent("0");
});