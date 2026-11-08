import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import SelectorCafe from "../../components/cafe/SelectorCafe";
import Carrito from "../../components/carrito/Carrito";
import { CarritoProvider } from "../../context/CarritoContext";
import {
  cafeApi,
  catalogoPrueba,
} from "../fixtures/productos";
import {
  crearHandlerBuscarProductos,
  crearHandlerProductos,
} from "../mocks/handlers";
import { server } from "../mocks/server";
import { productosApi } from "../fixtures/productos";

function renderSelector() {
  return render(
    <CarritoProvider>
      <SelectorCafe />
      <Carrito />
    </CarritoProvider>,
  );
}

beforeEach(() => {
  server.use(
    crearHandlerProductos(productosApi),
    crearHandlerBuscarProductos(catalogoPrueba),
  );
});

describe("SelectorCafe", () => {
  it("mantiene deshabilitado el botón agregar hasta elegir origen", async () => {
    const usuario = userEvent.setup();
    renderSelector();

    await usuario.click(screen.getByRole("radio", { name: "Expreso" }));
    await usuario.click(screen.getByRole("radio", { name: "Mediano" }));

    expect(
      screen.getByRole("button", { name: "Agregar café al carrito" }),
    ).toBeDisabled();
  });

  it("muestra precios y descripciones de cada origen", async () => {
    const usuario = userEvent.setup();
    renderSelector();

    await usuario.click(screen.getByRole("radio", { name: "Expreso" }));
    await usuario.click(screen.getByRole("radio", { name: "Mediano" }));

    expect(
      await screen.findByText(cafeApi.variedad.descripcion),
    ).toBeInTheDocument();
    expect(screen.getByText("$7.360")).toBeInTheDocument();
  });

  it("habilita agregar y envía el producto al carrito", async () => {
    const usuario = userEvent.setup();
    renderSelector();

    await usuario.click(screen.getByRole("radio", { name: "Expreso" }));
    await usuario.click(screen.getByRole("radio", { name: "Mediano" }));
    await usuario.click(await screen.findByRole("radio", { name: /Colombia/ }));

    const agregar = screen.getByRole("button", {
      name: "Agregar café al carrito",
    });
    expect(agregar).toBeEnabled();
    await usuario.click(agregar);

    expect(screen.getByText(cafeApi.nombre)).toBeInTheDocument();
  });

  it("limpia el origen al cambiar el tamaño", async () => {
    const usuario = userEvent.setup();
    renderSelector();

    await usuario.click(screen.getByRole("radio", { name: "Expreso" }));
    await usuario.click(screen.getByRole("radio", { name: "Mediano" }));
    const origenColombia = await screen.findByRole("radio", { name: /Colombia/ });
    await usuario.click(origenColombia);
    expect(origenColombia).toBeChecked();

    await usuario.click(screen.getByRole("radio", { name: "Pocillo" }));
    expect(screen.getByRole("radio", { name: /Colombia/ })).not.toBeChecked();
  });
});
