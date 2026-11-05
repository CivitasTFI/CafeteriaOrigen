import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import App from "../../App";
import { useCarrito } from "../../hooks/useCarrito";
import { cafeApi } from "../fixtures/productos";

// Ambos consumidores necesitan el mismo proveedor real montado por App.
vi.mock("../../pages/MenuPage", () => {
  function ResumenCarritoDePrueba() {
    const { items } = useCarrito();
    const unidades = items.reduce((total, item) => total + item.cantidad, 0);

    return <p>Unidades en el carrito: {unidades}</p>;
  }

  function BotonAgregarCafeDePrueba() {
    const { agregarProducto } = useCarrito();

    return (
      <button type="button" onClick={() => agregarProducto(cafeApi)}>
        Agregar café de prueba
      </button>
    );
  }

  return {
    default: function MenuConCarritoDePrueba() {
      return (
        <>
          <ResumenCarritoDePrueba />
          <BotonAgregarCafeDePrueba />
        </>
      );
    },
  };
});

test("App provee un carrito vacío que el menú puede actualizar", async () => {
  const usuario = userEvent.setup();

  render(<App />);

  expect(screen.getByText("Unidades en el carrito: 0")).toBeInTheDocument();

  await usuario.click(
    screen.getByRole("button", { name: "Agregar café de prueba" }),
  );

  expect(screen.getByText("Unidades en el carrito: 1")).toBeInTheDocument();
});
