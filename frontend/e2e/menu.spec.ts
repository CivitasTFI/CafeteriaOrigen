import { expect, test } from "@playwright/test";
import { prepararApi } from "./fixtures/api";

test.beforeEach(async ({ request }) => {
  await prepararApi(request);
});

test("muestra el catálogo, selector de café y pastelería", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Ver productos" }).click();

  const menu = page.getByRole("list", {
    name: "Productos del menú",
  });
  await expect(menu.getByRole("listitem")).toHaveCount(20);

  await page.getByRole("button", { name: "Pedir" }).click();

  await expect(
    page.getByRole("heading", { name: "Café", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Pastelería", exact: true }),
  ).toBeVisible();
});

test("mantiene los controles y el carrito dentro de 375 px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  await page.getByRole("radio", { name: "Expreso", exact: true }).check();
  await page.getByRole("radio", { name: "Mediano", exact: true }).check();
  await page.getByRole("radio", { name: /Colombia/ }).check();
  const agregarCafe = page.getByRole("button", {
    name: "Agregar café al carrito",
    exact: true,
  });
  await agregarCafe.click();
  await agregarCafe.click();
  await page.getByRole("button", {
    name: "Agregar Muffin de Chocolate",
    exact: true,
  }).click();

  await expect(page.getByText("Cantidad: 2", { exact: true })).toBeVisible();
  await expect(page.getByText("Cantidad: 1", { exact: true })).toBeVisible();
  await expect(page.getByText("Subtotal orientativo: $17.220", {
    exact: true,
  })).toBeVisible();
  await expect(page.getByRole("button", {
    name: "Confirmar pedido",
  })).toBeEnabled();

  const controlesRecortados = await page.locator("input, button, label").evaluateAll(
    (controles) => controles.filter((control) => {
      const limites = control.getBoundingClientRect();
      return limites.width > 0 && (
        limites.left < 0 || limites.right > document.documentElement.clientWidth
      );
    }).map((control) => control.id || control.textContent?.trim()),
  );
  expect(controlesRecortados).toEqual([]);

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
test("comienza con los ocho pedidos del seed", async ({ request }) => {
  const respuesta = await request.get("http://localhost:3000/pedidos");

  expect(respuesta.status()).toBe(200);
  expect(await respuesta.json()).toHaveLength(8);
});
