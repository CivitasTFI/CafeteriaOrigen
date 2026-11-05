import { describe, expect, it } from "vitest";
import { useCarrito } from "../../hooks/useCarrito";
import { CarritoProvider } from "../../context/CarritoContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { cafeApi as productoMock } from "../fixtures/productos";

function CarritoProbe() {
  const { items, agregarProducto, restarProducto, eliminarProducto } = useCarrito();
  return (
    <>
      <button onClick={() => agregarProducto(productoMock)}>
        Agregar producto
      </button>
      <button onClick={() => restarProducto(productoMock)}>
        Restar producto
      </button>
      <button onClick={() => eliminarProducto(productoMock)}>
        Eliminar producto
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
  it("resta un producto al carrito", async () => {
    const user = userEvent.setup();

    render(
      <CarritoProvider>
        <CarritoProbe />
      </CarritoProvider>
    );
    await user.click(screen.getByRole("button", { name: "Agregar producto" }));
    await user.click(screen.getByRole("button", { name: "Agregar producto" }));
    await user.click(screen.getByRole("button", { name: "Restar producto" }));

    expect(screen.getByText("Cantidad del ítem: 1")).toBeInTheDocument();
  })
  it("elimina un producto del carrito", async () => {
  const user = userEvent.setup();

  render(
    <CarritoProvider>
      <CarritoProbe />
    </CarritoProvider>
  );

  await user.click(screen.getByRole("button", { name: "Agregar producto" }));
  await user.click(screen.getByRole("button", { name: "Eliminar producto" }));

  expect(screen.getByText("Cantidad del ítem: 0")).toBeInTheDocument();
  });
});

// npm.cmd run test:frontend -- src/test/integration/carrito.context.test.tsx
