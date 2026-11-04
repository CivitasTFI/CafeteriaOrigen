import { describe, expect, it } from "vitest";
import { useCarrito } from "../../hooks/useCarrito";
import { CarritoProvider } from "../../context/CarritoContext";
import { render, screen } from "@testing-library/react";

function CarritoProbe() {
  const { items } = useCarrito();
  return <span>Cantidad: {items.length}</span>;
}

describe("CarritoContext", () => {
  it("inicia el carrito vacío", () => {
    render(
      <CarritoProvider>
        <CarritoProbe />
      </CarritoProvider>
    );

    expect(screen.getByText("Cantidad: 0")).toBeInTheDocument();
  });
});