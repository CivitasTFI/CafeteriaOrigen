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

function AgregarProductoDePrueba() {
    const { agregarProducto } = useCarrito();
        return (
        <button onClick={() => agregarProducto(productoMock)}>
            Agregar producto de prueba
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
                <AgregarProductoDePrueba />
                <Carrito />
            </CarritoProvider>,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Agregar producto de prueba",
            }),
        );

        expect(
            screen.getByText("Expreso Mediano"),
        ).toBeInTheDocument();
    });
})