import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../../App";

test("permite montar App en el DOM y consultar su encabezado", () => {
  render(<App />);

  const encabezado = screen.getByRole("heading", {
    name: "Cafetería Origen",
    level: 1,
  });

  expect(encabezado.textContent).toBe("Cafetería Origen");
});
