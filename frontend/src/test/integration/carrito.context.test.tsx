import { describe, expect, it } from "vitest";
import { useCarrito } from "../../hooks/useCarrito";
import { CarritoProvider } from "../../context/CarritoContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Producto } from "../../api/esquemas/productos";

const productoMock: Producto = {
  id: 5,
  tipo: "expreso",
  nombre: "Expreso Mediano",
  precio: 7360,
};

function CarritoProbe() {
  const { items, agregarProducto } = useCarrito();
  return (
    <>
      <button onClick={() => agregarProducto(productoMock)}>
        Agregar producto
      </button>

      <span>Cantidad del ítem: {items[0]?.cantidad ?? 0}</span>
    </>
  );
}

describe("CarritoContext", () => {
  it("inicia el carrito vacío", () => {
    render(
      <CarritoProvider>
        <CarritoProbe />
      </CarritoProvider>
    );

    expect(screen.getByText("Cantidad del ítem: 0")).toBeInTheDocument();
  });
  it("agrega un producto al carrito", async () => {
    const user = userEvent.setup();

    render(
      <CarritoProvider>
        <CarritoProbe />
      </CarritoProvider>
    );

    await user.click(screen.getByRole("button", {
      name: "Agregar producto",
    }));

    expect(screen.getByText("Cantidad del ítem: 1"))
      .toBeInTheDocument();
  });
});
