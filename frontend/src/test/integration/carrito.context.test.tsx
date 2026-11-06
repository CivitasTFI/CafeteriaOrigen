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

const productoMock2: Producto = {
  id: 9,
  tipo: "expreso",
  nombre: "Expreso Chico",
  precio: 1360,
};

function CarritoProbe() {
  const { items, agregarProducto, restarProducto, eliminarProducto, vaciarCarrito } = useCarrito();
  return (
    <>
      <button onClick={() => agregarProducto(productoMock)}>
        Agregar producto
      </button>
      <button onClick={() => agregarProducto(productoMock2)}>
        Agregar producto 2
      </button>
      <button onClick={() => restarProducto(productoMock)}>
        Restar producto
      </button>
      <button onClick={() => eliminarProducto(productoMock)}>
        Eliminar producto
      </button>
      <button onClick={() => vaciarCarrito()}>
        Vaciar carrito
      </button>
      <span>Cantidad de ítems en el carrito: {items.length}</span>
      <br />

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
  it("Vacia el carrito de todos los productos que contenga", async() => {
    const user = userEvent.setup();
    render(
      <CarritoProvider>
        <CarritoProbe />
      </CarritoProvider>
    );
    await user.click(screen.getByRole("button", { name: "Agregar producto" }));
    await user.click(screen.getByRole("button", { name: "Agregar producto 2" }));
    await user.click(screen.getByRole("button", { name: "Agregar producto" }));
    
    expect(screen.getByText("Cantidad de ítems en el carrito: 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Vaciar carrito" }));

    expect(screen.getByText("Cantidad de ítems en el carrito: 0")).toBeInTheDocument();
    
  })
});

// npm.cmd run test:frontend -- src/test/integration/carrito.context.test.tsx