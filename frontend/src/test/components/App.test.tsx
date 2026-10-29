import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../../App";

test.each([
  "permite montar App en el DOM y consultar su encabezado",
  "mantiene el DOM aislado al montar App en otra prueba",
])("%s", () => {
  render(<App />);

  const encabezado = screen.getByRole("heading", {
    name: "Cafetería Origen",
    level: 1,
  });

  expect(encabezado).toBeInTheDocument();
});
