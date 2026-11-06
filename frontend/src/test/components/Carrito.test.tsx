import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CarritoProvider } from '../../context/CarritoContext';
import Carrito from '../../components/carrito/Carrito';
import userEvent from '@testing-library/user-event';
import { useCarrito } from '../../hooks/useCarrito';
import type { Producto } from '../../api/esquemas/productos';

const productoMock: Producto = {
    id: 5,
    tipo: "expreso",
    nombre: "Expreso Mediano",
    precio: 7360,
};

const productoMock2: Producto = {
    id: 6,
    tipo: "expreso",
    nombre: "Expreso Grande",
    precio: 7360,
};

type AgregarProductoDePruebaProps = {
    producto: Producto;
};

function AgregarProductoDePrueba({ producto }: AgregarProductoDePruebaProps) {
    const { agregarProducto } = useCarrito();
    return (
        <button onClick={() => agregarProducto(producto)}>
            Agregar {producto.nombre}
        </button>
    );
}

describe("Carrito componente", () => {
    it("Renderiza el carrito y muestra el mensaje de carrito vacio", () => {
        render(
            <CarritoProvider>
                <Carrito/>
            </CarritoProvider>
        );
        expect(screen.getByText("Tu carrito está vacio")).toBeInTheDocument();
    });
    it("muestra el nombre de un producto agregado", async () => {
        const user = userEvent.setup();

        render(
            <CarritoProvider>
                <AgregarProductoDePrueba producto={productoMock} />
                <Carrito />
            </CarritoProvider>,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Agregar Expreso Mediano",
            }),
        );

        expect(
            screen.getByText("Expreso Mediano"),
        ).toBeInTheDocument();
    });
    it("muestra los nombres de dos productos distintos", async () => {
    const user = userEvent.setup();

    render(
        <CarritoProvider>
            <AgregarProductoDePrueba producto={productoMock} />
            <AgregarProductoDePrueba producto={productoMock2} />
            <Carrito />
        </CarritoProvider>,
    );

    await user.click(
        screen.getByRole("button", {
            name: "Agregar Expreso Mediano",
        }),
    );

    await user.click(
        screen.getByRole("button", {
            name: "Agregar Expreso Grande",
        }),
    );

    expect(
        screen.getByText("Expreso Mediano"),
    ).toBeInTheDocument();

    expect(
        screen.getByText("Expreso Grande"),
    ).toBeInTheDocument();
});
    it("Muestra la cantidad acumulada del mismo producto", async () => {
        const user = userEvent.setup();

        render(
            <CarritoProvider>
                <AgregarProductoDePrueba producto={productoMock} />
                <Carrito />
            </CarritoProvider>,
        );
        const botonAgregar = screen.getByRole("button", { name: "Agregar Expreso Mediano" });

        await user.click(botonAgregar);
        await user.click(botonAgregar);

        expect(screen.getByText("Cantidad: 2")).toBeInTheDocument();
    });
    it("Muestra el subtotal del item segun su precio y cantidad", async () => {
        const user = userEvent.setup();
        render(
            <CarritoProvider>
                <AgregarProductoDePrueba producto={productoMock} />
                <Carrito />
            </CarritoProvider>,
        );
        const botonAgregar = screen.getByRole("button", { name: "Agregar Expreso Mediano" });
        await user.click(botonAgregar);
        await user.click(botonAgregar);
        expect(screen.getByText("Subtotal ítem: $14.720")).toBeInTheDocument();
    });
    it("Muestra el subtotal general del carrito", async() => {
        const user = userEvent.setup();
        render(
            <CarritoProvider>
                <AgregarProductoDePrueba producto={productoMock} />
                <AgregarProductoDePrueba producto={productoMock2} />
                <Carrito />
            </CarritoProvider>,
        );

        const agregarMediano = screen.getByRole("button", { name: "Agregar Expreso Mediano" });
        const agregarGrande = screen.getByRole("button", { name: "Agregar Expreso Grande" });

        await user.click(agregarMediano);
        await user.click(agregarGrande);
        await user.click(agregarMediano);

        expect(screen.getByText("Subtotal: $22.080")).toBeInTheDocument();
    });
    it("Incrementa la cantidad del producto al clickear el boton de sumar", async() => {
        const user = userEvent.setup();

        render(
            <CarritoProvider>
                <AgregarProductoDePrueba producto={productoMock} />
                <Carrito />
            </CarritoProvider>,
        );

        await user.click(screen.getByRole("button", { name: "Agregar Expreso Mediano" }));
        await user.click(screen.getByRole("button", { name: "Sumar Expreso Mediano" }));
        
        expect(screen.getByText("Cantidad: 2")).toBeInTheDocument();
    });
    it("Resta la cantidad del producto al clickear el boton de restar", async() => {
        const user = userEvent.setup();

        render(
            <CarritoProvider>
                <AgregarProductoDePrueba producto={productoMock} />
                <Carrito />
            </CarritoProvider>,
        );

        await user.click(screen.getByRole("button", { name: "Agregar Expreso Mediano" }));
        await user.click(screen.getByRole("button", { name: "Sumar Expreso Mediano" }));
        await user.click(screen.getByRole("button", { name: "Restar Expreso Mediano" }));

        expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
    });
})
