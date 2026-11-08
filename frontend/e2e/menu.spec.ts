import { expect, test } from "@playwright/test";

test("muestra el selector de café y la pastelería", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Café", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Pastelería", exact: true }),
  ).toBeVisible();
});

test("el menú no tiene scroll horizontal a 375 px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Café", exact: true }),
  ).toBeVisible();

  const medidas = await page.evaluate(() => ({
    contenido: document.documentElement.scrollWidth,
    visible: document.documentElement.clientWidth,
  }));

  expect(medidas.contenido).toBeLessThanOrEqual(medidas.visible);
});

test("impide confirmar un pedido con el carrito vacío", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("Tu carrito está vacio", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Confirmar pedido" }),
  ).toBeDisabled();
});
