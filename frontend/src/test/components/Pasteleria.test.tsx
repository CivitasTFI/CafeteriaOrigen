import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Pasteleria from "../../components/pasteleria/Pasteleria";
import { CarritoProvider } from "../../context/CarritoContext";
import Carrito from "../../components/carrito/Carrito";
import {
  catalogoPrueba,
  pasteleriaApi,
  tortaApi,
} from "../fixtures/productos";

describe("Pasteleria", () => {
  it("muestra precios desde el catálogo", () => {
    render(
      <CarritoProvider>
        <Pasteleria productos={catalogoPrueba} />
      </CarritoProvider>,
    );

    expect(screen.getByText("$2.500")).toBeInTheDocument();
    expect(screen.getByText("$4.200")).toBeInTheDocument();
  });

  it("agrega un producto al carrito", async () => {
    const usuario = userEvent.setup();

    render(
      <CarritoProvider>
        <Pasteleria productos={catalogoPrueba} />
        <Carrito />
      </CarritoProvider>,
    );

    await usuario.click(
      screen.getByRole("button", { name: `Agregar ${pasteleriaApi.nombre}` }),
    );

    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  });

  it("permite agregar la torta", async () => {
    const usuario = userEvent.setup();

    render(
      <CarritoProvider>
        <Pasteleria productos={catalogoPrueba} />
        <Carrito />
      </CarritoProvider>,
    );

    await usuario.click(
      screen.getByRole("button", { name: `Agregar ${tortaApi.nombre}` }),
    );

    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  });
});
