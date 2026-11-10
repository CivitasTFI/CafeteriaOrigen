import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Pasteleria from "../../components/pasteleria/Pasteleria";
import { CarritoProvider } from "../../context/CarritoContext";
import Carrito from "../../components/carrito/Carrito";
import { useCarrito } from "../../hooks/useCarrito";
import {
  catalogoPrueba,
  pasteleriaApi,
  tortaApi,
} from "../fixtures/productos";

function EstadoCarrito() {
  const { items } = useCarrito();
  return <output aria-label="Productos del carrito">{JSON.stringify(items)}</output>;
}

describe("Pasteleria", () => {
  it("muestra precios desde el catálogo", () => {
    render(
      <CarritoProvider>
        <Pasteleria productos={[
          { ...pasteleriaApi, precio: 1234 },
          { ...tortaApi, precio: 5678 },
        ]} />
      </CarritoProvider>,
    );

    expect(screen.getByText("$1.234")).toBeInTheDocument();
    expect(screen.getByText("$5.678")).toBeInTheDocument();
  });

  it.each([
    { producto: pasteleriaApi, idEsperado: 19, subtotal: "$2.500" },
    { producto: tortaApi, idEsperado: 20, subtotal: "$4.200" },
  ])("agrega $producto.nombre con su ID, precio y cantidad correctos", async ({ producto, idEsperado, subtotal }) => {
    const usuario = userEvent.setup();

    render(
      <CarritoProvider>
        <Pasteleria productos={catalogoPrueba} />
        <Carrito />
        <EstadoCarrito />
      </CarritoProvider>,
    );

    await usuario.click(
      screen.getByRole("button", { name: `Agregar ${producto.nombre}` }),
    );

    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: `Eliminar ${producto.nombre}` })).toBeInTheDocument();
    expect(screen.getByText(`Subtotal orientativo: ${subtotal}`)).toBeInTheDocument();
    expect(screen.getByLabelText("Productos del carrito").textContent).toBe(JSON.stringify([{
      productoId: idEsperado,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    }]));
  });
});
