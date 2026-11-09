import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SelectorCafe from "../../components/cafe/SelectorCafe";
import Carrito from "../../components/carrito/Carrito";
import { CarritoProvider } from "../../context/CarritoContext";
import { cafeApi, catalogoPrueba } from "../fixtures/productos";

function renderSelector() {
  return render(
    <CarritoProvider>
      <SelectorCafe productos={catalogoPrueba} />
      <Carrito />
    </CarritoProvider>,
  );
}

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

    expect(screen.getByText((cafeApi).variedad.descripcion)).toBeInTheDocument();
    expect(screen.getByText("$7.360")).toBeInTheDocument();
  });

  it("habilita agregar y envía el producto al carrito", async () => {
    const usuario = userEvent.setup();
    renderSelector();

    await usuario.click(screen.getByRole("radio", { name: "Expreso" }));
    await usuario.click(screen.getByRole("radio", { name: "Mediano" }));
    await usuario.click(screen.getByRole("radio", { name: /Colombia/ }));

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
    const origenColombia = screen.getByRole("radio", { name: /Colombia/ });
    await usuario.click(origenColombia);
    expect(origenColombia).toBeChecked();

    await usuario.click(screen.getByRole("radio", { name: "Pocillo" }));
    expect(screen.getByRole("radio", { name: /Colombia/ })).not.toBeChecked();
  });

  it("no ofrece botón reintentar ante un catálogo vacío", async () => {
    const usuario = userEvent.setup();
    render(
      <CarritoProvider>
        <SelectorCafe productos={[]} />
      </CarritoProvider>,
    );

    await usuario.click(screen.getByRole("radio", { name: "Expreso" }));
    await usuario.click(screen.getByRole("radio", { name: "Mediano" }));

    expect(
      screen.getByText("No hay orígenes para esta combinación en el catálogo."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Reintentar" }),
    ).not.toBeInTheDocument();
  });
});
