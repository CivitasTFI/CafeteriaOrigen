import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import Pasteleria from "../../components/pasteleria/Pasteleria";
import { CarritoProvider } from "../../context/CarritoContext";
import Carrito from "../../components/carrito/Carrito";
import {
  catalogoPrueba,
  pasteleriaApi,
  tortaApi,
} from "../fixtures/productos";
import {
  crearHandlerBuscarProductos,
  crearHandlerProductos,
} from "../mocks/handlers";
import { server } from "../mocks/server";
import { productosApi } from "../fixtures/productos";

beforeEach(() => {
  server.use(
    crearHandlerProductos(productosApi),
    crearHandlerBuscarProductos(catalogoPrueba),
  );
});

describe("Pasteleria", () => {
  it("muestra precios desde la API", async () => {
    render(
      <CarritoProvider>
        <Pasteleria />
      </CarritoProvider>,
    );

    expect(await screen.findByText("$2.500")).toBeInTheDocument();
    expect(screen.getByText("$4.800")).toBeInTheDocument();
  });

  it("agrega un producto al carrito", async () => {
    const usuario = userEvent.setup();

    render(
      <CarritoProvider>
        <Pasteleria />
        <Carrito />
      </CarritoProvider>,
    );

    await screen.findByText(pasteleriaApi.nombre);
    await usuario.click(
      screen.getByRole("button", { name: `Agregar ${pasteleriaApi.nombre}` }),
    );

    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  });

  it("permite agregar la torta", async () => {
    const usuario = userEvent.setup();

    render(
      <CarritoProvider>
        <Pasteleria />
        <Carrito />
      </CarritoProvider>,
    );

    await usuario.click(
      await screen.findByRole("button", { name: `Agregar ${tortaApi.nombre}` }),
    );

    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  });
});
