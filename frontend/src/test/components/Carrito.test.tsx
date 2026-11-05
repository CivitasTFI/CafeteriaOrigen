import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CarritoProvider } from '../../context/CarritoContext';
import Carrito from '../../components/carrito/Carrito';

describe("Carrito componente", () => {
    it("Renderiza el carrito y muestra el mensaje de carrito vacio", () => {
        render(
            <CarritoProvider>
                <Carrito/>
            </CarritoProvider>
        );
        expect(screen.getByText("Tu carrito está vacio")).toBeInTheDocument();
    });
})