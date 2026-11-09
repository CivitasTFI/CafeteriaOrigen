import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Encabezado from "../../components/layout/Encabezado";

describe("encabezado", () => {

    it("muestra el número de mesa cuando está definido", () => {
        render(<Encabezado mesaId={4} />);

        expect(screen.getByRole("heading", {
            name: "Cafeteria Origen"
        })).toBeInTheDocument();

        expect(screen.getByText("mesa 4")).toBeInTheDocument();
    });

    it("muestra retiro en barra cuando no hay mesa", () => {
        render(<Encabezado/>);

        expect(screen.getByText("retiro en barra")).toBeInTheDocument();
    });
});