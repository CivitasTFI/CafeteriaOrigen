import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Encabezado from "../../components/layout/Encabezado";
import { leerMesa } from "../../utils/leerMesa";

describe("encabezado", () => {

    it("muestra el número de mesa cuando está definido", () => {
        render(<Encabezado mesaId={4} />);

        expect(screen.getByRole("heading", {
            name: "Cafetería Origen"
        })).toBeInTheDocument();

        expect(screen.getByText("mesa 4")).toBeInTheDocument();
    });

    it("muestra retiro en barra cuando no hay mesa", () => {
        render(<Encabezado/>);

        expect(screen.getByText("retiro en barra")).toBeInTheDocument();
    });

    it.each(["mesa=abc", "mesa=0", "mesa=9", "mesa=4.5", "mesa="])(
        "permite mostrar el encabezado para la URL inválida %s",
        (query) => {
            render(<Encabezado mesaId={leerMesa(new URLSearchParams(query))} />);

            expect(screen.getByText("retiro en barra")).toBeInTheDocument();
        },
    );
});
