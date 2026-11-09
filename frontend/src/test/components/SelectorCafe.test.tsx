import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SelectorCafe from "../../components/cafe/SelectorCafe";
import Carrito from "../../components/carrito/Carrito";
import { CarritoProvider } from "../../context/CarritoContext";
import { useCarrito } from "../../hooks/useCarrito";
import {
  cafeApi,
  cafeExpresoMedianoBrasil,
  cafeExpresoMedianoEtiopia,
  catalogoPrueba,
} from "../fixtures/productos";

function EstadoCarrito() {
  const { items } = useCarrito();
  return <output aria-label="Café agregado al carrito">{JSON.stringify(items)}</output>;
}

function renderSelector() {
  return render(
    <CarritoProvider>
      <SelectorCafe productos={catalogoPrueba} />
      <Carrito />
      <EstadoCarrito />
    </CarritoProvider>,
  );
}

describe("SelectorCafe", () => {
  it("mantiene deshabilitado el botón agregar hasta elegir origen", async () => {
    const usuario = userEvent.setup();
    renderSelector();

    const agregar = screen.getByRole("button", { name: "Agregar café al carrito" });
    expect(agregar).toBeDisabled();

    await usuario.click(screen.getByRole("radio", { name: "Expreso" }));
    expect(agregar).toBeDisabled();
    await usuario.click(screen.getByRole("radio", { name: "Mediano" }));
    expect(agregar).toBeDisabled();
    await usuario.click(screen.getByRole("radio", { name: /Colombia/ }));
    expect(agregar).toBeEnabled();
  });

  it("muestra precios y descripciones de cada origen", async () => {
    const usuario = userEvent.setup();
    renderSelector();

    await usuario.click(screen.getByRole("radio", { name: "Expreso" }));
    await usuario.click(screen.getByRole("radio", { name: "Mediano" }));

    for (const { origen, producto, precio } of [
      { origen: /Brasil/, producto: cafeExpresoMedianoBrasil, precio: /\$6\.280/ },
      { origen: /Colombia/, producto: cafeApi, precio: /\$7\.360/ },
      { origen: /Etiopía/, producto: cafeExpresoMedianoEtiopia, precio: /\$8\.980/ },
    ]) {
      const radio = screen.getByRole("radio", { name: origen });
      expect(radio).toHaveAccessibleName(precio);
      expect(radio).toHaveAccessibleName(new RegExp(producto.variedad.descripcion));
    }
  });

  it.each([
    { bebida: "Expreso", tamano: "Mediano", origen: /Brasil/, idEsperado: 4 },
    { bebida: "Expreso", tamano: "Mediano", origen: /Colombia/, idEsperado: 5 },
    { bebida: "Expreso", tamano: "Mediano", origen: /Etiopía/, idEsperado: 6 },
    { bebida: "Filtrado", tamano: "Pocillo", origen: /Brasil/, idEsperado: 10 },
  ])("agrega el café $idEsperado elegido por bebida, tamaño y origen", async ({ bebida, tamano, origen, idEsperado }) => {
    const usuario = userEvent.setup();
    renderSelector();

    await usuario.click(screen.getByRole("radio", { name: bebida }));
    await usuario.click(screen.getByRole("radio", { name: tamano }));
    await usuario.click(screen.getByRole("radio", { name: origen }));

    const agregar = screen.getByRole("button", {
      name: "Agregar café al carrito",
    });
    expect(agregar).toBeEnabled();
    await usuario.click(agregar);

    const elegido = catalogoPrueba.find((producto) => producto.id === idEsperado);
    if (elegido === undefined) throw new Error("Falta el café esperado en el fixture");
    expect(screen.getByRole("button", { name: `Eliminar ${elegido.nombre}` })).toBeInTheDocument();
    expect(screen.getByLabelText("Café agregado al carrito").textContent).toBe(JSON.stringify([{
      productoId: idEsperado,
      nombre: elegido.nombre,
      precio: elegido.precio,
      cantidad: 1,
    }]));
  });

  it.each(["Pocillo", "Filtrado"])("limpia el origen y bloquea agregar al cambiar a %s", async (opcion) => {
    const usuario = userEvent.setup();
    renderSelector();

    await usuario.click(screen.getByRole("radio", { name: "Expreso" }));
    await usuario.click(screen.getByRole("radio", { name: "Mediano" }));
    const origenColombia = screen.getByRole("radio", { name: /Colombia/ });
    await usuario.click(origenColombia);
    expect(origenColombia).toBeChecked();

    await usuario.click(screen.getByRole("radio", { name: opcion }));
    expect(screen.getByRole("radio", { name: /Colombia/ })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Agregar café al carrito" })).toBeDisabled();
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
