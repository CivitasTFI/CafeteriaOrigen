import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import encabezado from "../../components/layout/Encabezado";

describe("encabezado", () => {

    it("muestra el número de mesa cuando está definido", () => {
        render(<Encabezado mesaId={4} />);

        expect(screen.getByRole("heading", {
            name: "Cafeteria Origen"
        })).toBeInTheDocument();

        expect(screen.getByText("mesa 4")).toBeInTheDocument();
    })
});