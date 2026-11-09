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

function renderizarConfirmacion(mesaId?: number){
    render(
        <CarritoProvider>
            <PrepararCarrito />
            <ConfirmarPedido mesaId={mesaId} />
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