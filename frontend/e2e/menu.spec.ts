import { expect, test } from "@playwright/test";

test("muestra los 20 productos de la API real", async ({ page }) => {
  await page.goto("/");

  const menu = page.getByRole("list", {
    name: "Productos del menú",
  });

  await expect(menu.getByRole("listitem")).toHaveCount(20);
  await expect(menu.getByText("Expreso Pocillo Brasil", {
    exact: true,
  })).toBeVisible();
});
test("el menú no tiene scroll horizontal a 375 px", async ({ page }) => {
  await page.goto("/");

  const menu = page.getByRole("list", {
    name: "Productos del menú",
  });

  await expect(menu.getByRole("listitem")).toHaveCount(20);

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